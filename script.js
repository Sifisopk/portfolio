// DOM Content Loaded - ensures everything is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    

    
    // ========== MOBILE MENU FUNCTION ==========
    function myMenuFunction() {
        var menubth = document.getElementById("myNavMenu");
        console.log("Menu button clicked");

        if (menubth.className === "nav-menu") {
            menubth.className += " responsive";
        } else {
            menubth.className = "nav-menu";
        }
    }
    

    
    // Make function globally available
    window.myMenuFunction = myMenuFunction;

    // ========== NAVBAR SCROLL EFFECT ==========
    const nav = document.getElementById('header');
    console.log("Navbar element found:", nav);
    
    function updateNav() {
        if (window.pageYOffset > 50) {
            nav.classList.add('nav-scrolled');
            console.log("Nav scrolled - class added");
        } else {
            nav.classList.remove('nav-scrolled');
            console.log("At top - class removed");
        }
    }
    
    // Run on load and scroll
    updateNav(); // Initial check
    window.addEventListener('scroll', updateNav);
    console.log("Scroll listener attached");

    // ========== SCROLL REVEAL ANIMATIONS ==========
    // Check if ScrollReveal is loaded
    if (typeof ScrollReveal !== 'undefined') {
        console.log("ScrollReveal loaded, initializing...");
        
        const sr = ScrollReveal({
            origin: "top",
            distance: "80px",
            duration: 2000,
            reset: false,
            delay: 200
        });

        

        // Reveal elements on scroll
        sr.reveal('.featured-name', { delay: 100 });
        sr.reveal('.hello', { delay: 100 });
        sr.reveal('.text-info', { delay: 200 });
        sr.reveal('.text-btn', { delay: 200 });
        sr.reveal('.social_icons', { delay: 200 });
        sr.reveal('.featured-image', { delay: 320 });
        sr.reveal('.project-box', { interval: 200 });
        sr.reveal('.card', { interval: 200 });
        sr.reveal('.certificate-gallery img', { interval: 200 });
        sr.reveal('.top-header', { delay: 100 });
        sr.reveal('#Available', { delay: 100 });
        sr.reveal('.top-header-skills', { delay: 100 });
        sr.reveal('.top-header-container', { delay: 100 });

        const srLeft = ScrollReveal({
            origin: "left",
            distance: "80px",
            duration: 2000,
            reset: false,
        });

        srLeft.reveal('.about-info', { delay: 100 });
        srLeft.reveal('.contact-info', { delay: 100 });
        srLeft.reveal('.skills-list', { delay: 100 });
        srLeft.reveal('.form-control', { delay: 100 });
        srLeft.reveal('.tools-header', { delay: 100 });

        const srRight = ScrollReveal({
            origin: "right",
            distance: "80px",
            duration: 2000,
            reset: false,
        });

        srRight.reveal('.skill', { delay: 100 });
        srRight.reveal('.skill-box', { delay: 100 });
        
        console.log("ScrollReveal initialized successfully");
    } else {
        console.warn("ScrollReveal not found - animations will not work");
    }

    // ========== ACTIVE LINK HIGHLIGHT ==========
    const sections = document.querySelectorAll(".section[id]");
    console.log("Found sections:", sections.length);

    function scrollActive() {
        const scrollY = window.scrollY;
        
        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 50;
            const sectionId = current.getAttribute("id");
            
            // Find corresponding nav link
            const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add("active-link");
                } else {
                    navLink.classList.remove("active-link");
                }
            }
        });
    }
    
    window.addEventListener("scroll", scrollActive);
    console.log("Active link listener attached");

    });