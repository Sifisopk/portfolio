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
  strings: ["Junior developer", "coder", "UX Designer"],

  loop: true,
  typeSpeed: 100,
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
birdImg.src = "images/airship.png" ;

const pipeTopImg = new Image();
pipeTopImg.src = "images/building-top.png"; 

const pipeBottomImg = new Image();
pipeBottomImg.src = "images/building-bottom.png"; 

// Game variables
let dev = { x: 50, y: 100, width: 40, height: 27, gravity: 0.5, lift: -5, velocity: 0 };
let pipes = [];
let frame = 0;
let gameOver = false;
let gameStarted = false;
let score = 0;

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
        restartBtn.style.display = "block";
        instructions.style.display = "block";
    }

    // Generate pipes (obstacles) every 100 frames
    if (frame % 100 === 0) {
        let gap = 80; // Increased space between pipes
        let topHeight = Math.random() * (canvas.height - gap - 40);
        
        pipes.push({ x: canvas.width, y: 0, width: 45, height: topHeight, type: "top" });
        pipes.push({ x: canvas.width, y: topHeight + gap, width: 45, height: canvas.height - topHeight - gap, type: "bottom" });
    }

    // Move pipes & check for collisions
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;

        if (dev.x < pipes[i].x + pipes[i].width &&
            dev.x + dev.width > pipes[i].x &&
            dev.y < pipes[i].y + pipes[i].height &&
            dev.y + dev.height > pipes[i].y) {
            gameOver = true;
            restartBtn.style.display = "block";
            instructions.style.display = "block";
        }
    }

    // Remove pipes that have left the screen
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Increase score as the player moves forward
    score++;

    frame++;
}

// Draw game elements
function draw() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); // Draw background
    ctx.drawImage(birdImg, dev.x, dev.y, dev.width, dev.height); // Draw rocket ship

    for (let pipe of pipes) {
        if (pipe.type === "top") {
            ctx.drawImage(pipeTopImg, pipe.x, pipe.y, pipe.width, pipe.height);
        } else {
            ctx.drawImage(pipeBottomImg, pipe.x, pipe.y, pipe.width, pipe.height);
        }
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
    frame = 0;
    score = 0;
    gameOver = false;
    gameStarted = true;
    restartBtn.style.display = "none";
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
