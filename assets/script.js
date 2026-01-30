
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

// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
document.querySelector('.appointment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    // Add form submission logic here
    alert('Grazie per la tua prenotazione! Ti contatteremo presto per confermare.');
    this.reset();
});

// Navbar collapse on mobile after click
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
            bootstrap.Collapse.getInstance(navbarCollapse).hide();
        }
    });
});
