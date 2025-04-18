function myMenuFunction() {
  var menubth = document.getElementById("myNavMenu");

  if (menubth.className === "nav-menu") {
    menubth.className += " responsive";
  } else {
    menubth.className = "nav-menu";
  }
}

/*---typing effect*/
var typingEffect = new Typed(".typedText", {
  strings: ["Junior developer", "coder"],

  loop: true,
  typeSpeed: 50,
  backSpeed: 80,
  backDelay: 2000,
});

/*--- scroll animation---*/

const sr = ScrollReveal({
  origin: "top",
  distance: "80px",
  duration: 2000,
  reset: true,
});

sr.reveal(".featured-name", { delay: 100 });
sr.reveal(".hello", { delay: 100 });
sr.reveal(".text-info", { delay: 200 });
sr.reveal(".text-btn", { delay: 200 });
sr.reveal(".social_icons", { delay: 200 });
sr.reveal(".featured-image", { delay: 320 });

sr.reveal(".project-box", { interval: 200 });
sr.reveal(".card", { interval: 200 });
sr.reveal(".certificate-gallery img", { interval: 200 });
sr.reveal(".top-hearder", {});

const srLeft = ScrollReveal({
  origin: "left",
  distance: "80px",
  duration: 2000,
  reset: true,
});

srLeft.reveal(".about-info", { delay: 100 });
srLeft.reveal(".contact-info", { delay: 100 });
srLeft.reveal(".skills-list", { delay: 100 });
srLeft.reveal("#contact", { delay: 100 });

const srRight = ScrollReveal({
  origin: "left",
  distance: "80px",
  duration: 2000,
  reset: true,
});

srRight.reveal(".skill", { delay: 100 });
srRight.reveal(".skill-box", { delay: 100 });

/*---active link---*/

const sections = document.querySelectorAll(".section[id]");

function scrollActive() {
  const scrollY = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 50,
      sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}

window.addEventListener("scroll", scrollActive);

//flappy game
const canvas = document.getElementById("gameCanvas");
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
rocketImg.src = "images/missile.png"; // Add rocket image

// Load sounds
const flapSound = new Audio("sounds/flap.mp3");
const scoreSound = new Audio("sounds/score.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");

// Game variables
let dev = { x: 50, y: 100, width: 40, height: 27, gravity: 0.5, lift: -5, velocity: 0 };
let pipes = [];
let rockets = [];
let frame = 0;
let gameOver = false;
let gameStarted = false;
let score = 0;
let obstacleType = "pipes"; // Start with pipes
let nextSwitchScore = 40; // Next score threshold to switch to rockets
let rocketModeActive = false; // Track if rocket mode is active

// Buttons
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const instructions = document.querySelector(".instructions");

// Hide restart button initially
restartBtn.style.display = "none";

// Start game on button click
startBtn.addEventListener("click", () => {
    gameStarted = true;
    startBtn.style.display = "none";
    instructions.style.display = "none";
});

// Restart game on button click
restartBtn.addEventListener("click", () => {
    resetGame();
    restartBtn.style.display = "none";
    instructions.style.display = "none";
});

// Handle key press
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "w" && gameStarted && !gameOver) {
        dev.velocity = dev.lift;
        flapSound.play(); // Play flap sound
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
        gameOverSound.play(); // Play game over sound
        restartBtn.style.display = "block";
        instructions.style.display = "block";
    }

    // Switch to rockets when score reaches the next threshold
    if (score >= nextSwitchScore && !rocketModeActive) {
        obstacleType = "rockets";
        rocketModeActive = true;
        pipes = []; // Clear existing pipes
        setTimeout(() => {
            obstacleType = "pipes"; // Switch back to pipes after 5 seconds
            rocketModeActive = false; // Reset rocket mode
            rockets = []; // Clear existing rockets
            nextSwitchScore += 80; // Set the next threshold (e.g., 100, 150, etc.)
        }, 9000); // 5 seconds
    }

    // Generate pipes (obstacles) every 100 frames
    if (obstacleType === "pipes" && frame % 100 === 0) {
        let gap = 80; // Increased space between pipes
        let topHeight = Math.random() * (canvas.height - gap - 40);
        
        pipes.push({ x: canvas.width, y: 0, width: 45, height: topHeight, type: "top", passed: false });
        pipes.push({ x: canvas.width, y: topHeight + gap, width: 45, height: canvas.height - topHeight - gap, type: "bottom", passed: false });
    }

    // Generate rockets (obstacles) every 50 frames
    if (obstacleType === "rockets" && frame % 50 === 0) {
        let rocketY = Math.random() * (canvas.height - 30);
        rockets.push({ x: canvas.width, y: rocketY, width: 45, height: 30, passed: false });
    }

    // Move pipes & check for collisions
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;

        if (dev.x < pipes[i].x + pipes[i].width &&
            dev.x + dev.width > pipes[i].x &&
            dev.y < pipes[i].y + pipes[i].height &&
            dev.y + dev.height > pipes[i].y) {
            gameOver = true;
            gameOverSound.play(); // Play game over sound
            restartBtn.style.display = "block";
            instructions.style.display = "block";
        }

        // Increase score when a pipe is passed
        if (pipes[i].x + pipes[i].width < dev.x && !pipes[i].passed) {
            pipes[i].passed = true;
            score++;
            scoreSound.play(); // Play score sound
        }
    }

    // Move rockets & check for collisions
    for (let i = 0; i < rockets.length; i++) {
        rockets[i].x -= 4;

        if (dev.x < rockets[i].x + rockets[i].width &&
            dev.x + dev.width > rockets[i].x &&
            dev.y < rockets[i].y + rockets[i].height &&
            dev.y + dev.height > rockets[i].y) {
            gameOver = true;
            gameOverSound.play(); // Play game over sound
            restartBtn.style.display = "block";
            instructions.style.display = "block";
        }

        // Increase score when a rocket is passed
        if (rockets[i].x + rockets[i].width < dev.x && !rockets[i].passed) {
            rockets[i].passed = true;
            score++;
            scoreSound.play(); // Play score sound
        }
    }

    // Remove pipes and rockets that have left the screen
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
    rockets = rockets.filter(rocket => rocket.x + rocket.width > 0);

    frame++;
}

// Draw game elements
function draw() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); // Draw background
    ctx.drawImage(birdImg, dev.x, dev.y, dev.width, dev.height); // Draw rocket ship

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
    obstacleType = "pipes"; // Reset to pipes
    rocketModeActive = false; // Reset rocket mode
    nextSwitchScore = 120; // Reset the score threshold
    restartBtn.style.display = "none";
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();