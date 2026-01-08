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

    // ========== FLAPPY GAME ==========
    const canvas = document.getElementById("gameCanvas");
    if (canvas) {
        console.log("Game canvas found, initializing game...");
        const ctx = canvas.getContext("2d");

        // Load images
        const bgImg = new Image();
        bgImg.src = "images/sky.jpg"; 

        const birdImg = new Image();
        birdImg.src = "images/airship.png";

        const pipeTopImg = new Image();
        pipeTopImg.src = "images/building-top.png"; 

        const pipeBottomImg = new Image();
        pipeBottomImg.src = "images/building-bottom.png"; 

        const rocketImg = new Image();
        rocketImg.src = "images/missile.png";

        // Load sounds (add your sound files)
        const flapSound = new Audio();
        const scoreSound = new Audio();
        const gameOverSound = new Audio();

        // Game variables
        let dev = { x: 50, y: 100, width: 40, height: 27, gravity: 0.5, lift: -5, velocity: 0 };
        let pipes = [];
        let rockets = [];
        let frame = 0;
        let gameOver = false;
        let gameStarted = false;
        let score = 0;
        let obstacleType = "pipes";
        let nextSwitchScore = 40;
        let rocketModeActive = false;

        // Buttons
        const startBtn = document.getElementById("startBtn");
        const restartBtn = document.getElementById("restartBtn");
        const instructions = document.querySelector(".instructions");

        if (startBtn && restartBtn) {
            // Hide restart button initially
            restartBtn.style.display = "none";

            // Start game on button click
            startBtn.addEventListener("click", () => {
                gameStarted = true;
                startBtn.style.display = "none";
                if (instructions) instructions.style.display = "none";
            });

            // Restart game on button click
            restartBtn.addEventListener("click", () => {
                resetGame();
                restartBtn.style.display = "none";
                if (instructions) instructions.style.display = "none";
            });
        }

        // Handle key press
        document.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === "w" && gameStarted && !gameOver) {
                dev.velocity = dev.lift;
                flapSound.play();
            }
        });

        // Update game state
        function update() {
            if (!gameStarted || gameOver) return;

            dev.velocity += dev.gravity;
            dev.y += dev.velocity;

            // Prevent falling off screen
            if (dev.y + dev.height > canvas.height || dev.y < 0) {
                gameOver = true;
                flapSound.pause();
                flapSound.currentTime = 0;
                gameOverSound.play();
                if (restartBtn) restartBtn.style.display = "block";
                if (instructions) instructions.style.display = "block";
            }

            // Switch to rockets when score reaches threshold
            if (score >= nextSwitchScore && !rocketModeActive) {
                obstacleType = "rockets";
                rocketModeActive = true;
                pipes = [];
                setTimeout(() => {
                    obstacleType = "pipes";
                    rocketModeActive = false;
                    rockets = [];
                    nextSwitchScore += 80;
                }, 9000);
            }

            // Generate pipes
            if (obstacleType === "pipes" && frame % 100 === 0) {
                let gap = 80;
                let topHeight = Math.random() * (canvas.height - gap - 40);
                
                pipes.push({ x: canvas.width, y: 0, width: 45, height: topHeight, type: "top", passed: false });
                pipes.push({ x: canvas.width, y: topHeight + gap, width: 45, height: canvas.height - topHeight - gap, type: "bottom", passed: false });
            }

            // Generate rockets
            if (obstacleType === "rockets" && frame % 50 === 0) {
                let rocketY = Math.random() * (canvas.height - 30);
                rockets.push({ x: canvas.width, y: rocketY, width: 45, height: 30, passed: false });
            }

            // Move pipes & check collisions
            for (let i = 0; i < pipes.length; i++) {
                pipes[i].x -= 2;

                if (dev.x < pipes[i].x + pipes[i].width &&
                    dev.x + dev.width > pipes[i].x &&
                    dev.y < pipes[i].y + pipes[i].height &&
                    dev.y + dev.height > pipes[i].y) {
                    gameOver = true;
                    flapSound.pause();
                    flapSound.currentTime = 0;
                    gameOverSound.play();
                    if (restartBtn) restartBtn.style.display = "block";
                    if (instructions) instructions.style.display = "block";
                }

                if (pipes[i].x + pipes[i].width < dev.x && !pipes[i].passed) {
                    pipes[i].passed = true;
                    score++;
                    scoreSound.play();
                }
            }

            // Move rockets & check collisions
            for (let i = 0; i < rockets.length; i++) {
                rockets[i].x -= 4;

                if (dev.x < rockets[i].x + rockets[i].width &&
                    dev.x + dev.width > rockets[i].x &&
                    dev.y < rockets[i].y + rockets[i].height &&
                    dev.y + dev.height > rockets[i].y) {
                    gameOver = true;
                    flapSound.pause();
                    flapSound.currentTime = 0;
                    gameOverSound.play();
                    if (restartBtn) restartBtn.style.display = "block";
                    if (instructions) instructions.style.display = "block";
                }

                if (rockets[i].x + rockets[i].width < dev.x && !rockets[i].passed) {
                    rockets[i].passed = true;
                    score++;
                    scoreSound.play();
                }
            }

            // Remove off-screen objects
            pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
            rockets = rockets.filter(rocket => rocket.x + rocket.width > 0);

            frame++;
        }

        // Draw game elements
        function draw() {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(birdImg, dev.x, dev.y, dev.width, dev.height);

            // Draw pipes
            for (let pipe of pipes) {
                if (pipe.type === "top") {
                    ctx.drawImage(pipeTopImg, pipe.x, pipe.y, pipe.width, pipe.height);
                } else {
                    ctx.drawImage(pipeBottomImg, pipe.x, pipe.y, pipe.width, pipe.height);
                }
            }

            // Draw rockets
            for (let rocket of rockets) {
                ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
            }

            ctx.fillStyle = "#42f5d7";
            ctx.font = "20px Arial";
            ctx.fillText("Score: " + score, 10, 20);
        }

        // Reset game function
        function resetGame() {
            dev.y = 150;
            dev.velocity = 0;
            pipes = [];
            rockets = [];
            frame = 0;
            score = 0;
            gameOver = false;
            gameStarted = true;
            obstacleType = "pipes";
            rocketModeActive = false;
            nextSwitchScore = 120;
            if (restartBtn) restartBtn.style.display = "none";
        }

        // Game loop
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }

        // Start game loop when images are loaded
        let imagesLoaded = 0;
        const totalImages = 5;
        
        function imageLoaded() {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                console.log("All game images loaded, starting game loop");
                gameLoop();
            }
        }
        
        bgImg.onload = imageLoaded;
        birdImg.onload = imageLoaded;
        pipeTopImg.onload = imageLoaded;
        pipeBottomImg.onload = imageLoaded;
        rocketImg.onload = imageLoaded;
        
        // Fallback in case images fail to load
        setTimeout(() => {
            if (imagesLoaded < totalImages) {
                console.log("Some images failed to load, starting game anyway");
                gameLoop();
            }
        }, 3000);
        
        console.log("Game initialized");
    } else {
        console.log("Game canvas not found, skipping game initialization");
    }
    
    console.log("All JavaScript initialized successfully!");
});

// ========== TYPED.JS EFFECT ==========
// Initialize typed.js separately since it needs to be global
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Typed !== 'undefined') {
        console.log("Typed.js loaded, initializing...");
        var typingEffect = new Typed(".typedText", {
            strings: ["Frontend developer", "coder"],
            loop: true,
            typeSpeed: 50,
            backSpeed: 80,
            backDelay: 2000,
        });
        console.log("Typed.js initialized");
    } else {
        console.warn("Typed.js not found");
    }

    
});