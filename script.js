const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let rabbit = { x: 100, y: 300, width: 80, height: 80, vy: 0, jumping: false };
let tomato = { x: 800, y: 320, width: 60, height: 60, squished: false };
let score = 0;
let gameOver = false;

const gravity = 0.5;
const jumpStrength = -10;

// Load images
const rabbitImg = new Image();
rabbitImg.src = "rabbit.jpeg";
const tomatoImg = new Image();
tomatoImg.src = "Tomato250.jpg";
const tomatoSquishImg = new Image();
tomatoSquishImg.src = "tomato_squished.jpg";

// Key event for jump
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !rabbit.jumping && !gameOver) {
    rabbit.vy = jumpStrength;
    rabbit.jumping = true;
  }
});

function drawRabbit() {
  ctx.drawImage(rabbitImg, rabbit.x, rabbit.y, rabbit.width, rabbit.height);
}

function drawTomato() {
  if (tomato.squished) {
    ctx.drawImage(tomatoSquishImg, tomato.x, tomato.y + 15, tomato.width, 40);
  } else {
    ctx.drawImage(tomatoImg, tomato.x, tomato.y, tomato.width, tomato.height);
  }
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gravity
  rabbit.vy += gravity;
  rabbit.y += rabbit.vy;
  if (rabbit.y >= 300) {
    rabbit.y = 300;
    rabbit.vy = 0;
    rabbit.jumping = false;
  }

  // Tomato movement
  tomato.x -= 6;
  if (tomato.x + tomato.width < 0) {
    tomato.x = 800 + Math.random() * 300;
    tomato.squished = false;
  }

  // Collision detection
  if (
    !tomato.squished &&
    rabbit.x < tomato.x + tomato.width &&
    rabbit.x + rabbit.width > tomato.x &&
    rabbit.y + rabbit.height > tomato.y + 20
  ) {
    tomato.squished = true;
    score += 1;
    document.getElementById("scoreDisplay").innerText = "Score: " + score;

    // 🩸 Squish animation stays for 1.2 seconds before game over
    setTimeout(() => endGame(), 1200);
  }

  drawRabbit();
  drawTomato();

  requestAnimationFrame(update);
}

function endGame() {
  gameOver = true;
  document.getElementById("finalScore").innerText = `Final Score: ${score}`;
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("gameCanvas").style.display = "none";
}

document.getElementById("shareBtn").addEventListener("click", () => {
  const shareText = `I scored ${score} points in the Kissan Tomato Game! 🍅🐇`;
  const shareUrl = "https://www.instagram.com/";
  window.open(shareUrl, "_blank");
  alert("Copy this text and share it in your story:\n" + shareText);
});

update();
