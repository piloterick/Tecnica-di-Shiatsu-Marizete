
// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
});

// Initialize Fancybox
Fancybox.bind("[data-fancybox]", {
    // Options
});

// Navbar scroll effect
const navbar = document.getElementById('mainNavbar');
const topBar = document.querySelector('.top-bar');
let topBarHeight = topBar.offsetHeight;

window.addEventListener('scroll', function () {
    if (window.scrollY > topBarHeight) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// =============================================
// BACK TO TOP BUTTON
// =============================================

(function() {
    'use strict';
    
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    
    // Smooth scroll to top
    function scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', scrollToTop);
    
    // Initial check
    toggleBackToTop();
})();

// =============================================
// WHATSAPP FLOATING BUTTON WITH INTERSECTION OBSERVER
// =============================================

(function() {
    'use strict';
    
    // Configuration
    const config = {
        sections: {
            'services': {
                message: 'Hai domande sui nostri trattamenti? Scrivici!',
                threshold: 0.3
            },
            'pricing': {
                message: 'Vuoi sapere di più sui nostri pacchetti? Contattaci!',
                threshold: 0.3
            },
            'appointment': {
                message: 'Preferisci prenotare via WhatsApp? Siamo qui!',
                threshold: 0.5
            },
            'gallery': {
                message: 'Ti piace il nostro ambiente? Vieni a trovarci!',
                threshold: 0.3
            },
            'about': {
                message: 'Vuoi conoscerci meglio? Scrivici!',
                threshold: 0.3
            }
        },
        tooltipDisplayDuration: 8000,
        tooltipCooldown: 30000,
        initialDelay: 2000,
        storageKey: 'whatsapp_tooltip_closed'
    };
    
    // State
    let lastTooltipTime = 0;
    let currentSection = null;
    let tooltipTimeout = null;
    let isInitialized = false;
    let userClosedTooltip = false;
    
    // DOM Elements
    const whatsappFloat = document.getElementById('whatsappFloat');
    const whatsappTooltip = document.getElementById('whatsappTooltip');
    const tooltipClose = document.getElementById('tooltipClose');
    const tooltipText = whatsappTooltip?.querySelector('.tooltip-text');
    
    if (!whatsappFloat || !whatsappTooltip || !tooltipText) {
        console.warn('WhatsApp floating button elements not found');
        return;
    }
    
    function checkClosedState() {
        const closedTime = sessionStorage.getItem(config.storageKey);
        if (closedTime) {
            const elapsed = Date.now() - parseInt(closedTime, 10);
            if (elapsed < 300000) {
                userClosedTooltip = true;
            } else {
                sessionStorage.removeItem(config.storageKey);
            }
        }
    }
    
    function showTooltip(sectionId, message) {
        const now = Date.now();
        
        if (userClosedTooltip) return;
        if (now - lastTooltipTime < config.tooltipCooldown) return;
        if (!isInitialized) return;
        if (whatsappTooltip.classList.contains('show') && currentSection === sectionId) return;
        
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
        }
        
        tooltipText.textContent = message;
        whatsappTooltip.setAttribute('data-section', sectionId);
        currentSection = sectionId;
        
        requestAnimationFrame(() => {
            whatsappTooltip.classList.add('show');
        });
        
        lastTooltipTime = now;
        
        tooltipTimeout = setTimeout(() => {
            hideTooltip();
        }, config.tooltipDisplayDuration);
    }
    
    function hideTooltip() {
        whatsappTooltip.classList.remove('show');
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
            tooltipTimeout = null;
        }
    }
    
    function handleCloseClick(e) {
        e.preventDefault();
        e.stopPropagation();
        hideTooltip();
        userClosedTooltip = true;
        sessionStorage.setItem(config.storageKey, Date.now().toString());
    }
    
    function createObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return null;
        }
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.3, 0.5, 0.7]
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                const sectionConfig = config.sections[sectionId];
                
                if (!sectionConfig) return;
                
                if (entry.isIntersecting && entry.intersectionRatio >= sectionConfig.threshold) {
                    showTooltip(sectionId, sectionConfig.message);
                }
            });
        }, observerOptions);
        
        return observer;
    }
    
    function initObservers() {
        const observer = createObserver();
        if (!observer) return;
        
        Object.keys(config.sections).forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });
    }
    
    function init() {
        checkClosedState();
        
        if (tooltipClose) {
            tooltipClose.addEventListener('click', handleCloseClick);
        }
        
        const whatsappButton = whatsappFloat.querySelector('.whatsapp-button');
        if (whatsappButton) {
            whatsappButton.addEventListener('click', () => {
                hideTooltip();
            });
        }
        
        setTimeout(() => {
            isInitialized = true;
            initObservers();
        }, config.initialDelay);
        
        setTimeout(() => {
            if (!userClosedTooltip && !whatsappTooltip.classList.contains('show')) {
                const visibleSection = Object.keys(config.sections).find(sectionId => {
                    const section = document.getElementById(sectionId);
                    if (!section) return false;
                    const rect = section.getBoundingClientRect();
                    return rect.top < window.innerHeight && rect.bottom > 0;
                });
                
                if (visibleSection) {
                    showTooltip(visibleSection, config.sections[visibleSection].message);
                }
            }
        }, config.initialDelay + 1000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    window.WhatsAppFloat = {
        show: () => whatsappFloat.style.display = 'flex',
        hide: () => whatsappFloat.style.display = 'none',
        showTooltip: (message) => showTooltip('custom', message),
        hideTooltip: hideTooltip
    };
})();