// ====== Canvas Setup ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// ====== DOM Elements ======
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreText = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const shareBtn = document.getElementById("shareBtn");

// ====== Game Assets ======
const rabbitRunImages = [];
const totalRabbitFrames = 2;

for (let i = 1; i <= totalRabbitFrames; i++) {
  const img = new Image();
  img.src = `rabbit.jpg`;
  rabbitRunImages.push(img);
}

const rabbitJump = new Image();
rabbitJump.src = "rabbit.jpg";

const tomatoImg = new Image();
tomatoImg.src = "Tomato250.jpg";

const tomatoSquishImg = new Image();
tomatoSquishImg.src = "tomato_squished.jpg";

// ====== Game Variables ======
let rabbit, tomatoes, frameCount, score, gameOver;

function initGame() {
  rabbit = {
    x: 100,
    y: canvas.height - 120,
    width: 80,
    height: 80,
    dy: 0,
    gravity: 0.6,
    jumpPower: -12,
    onGround: true,
    runFrame: 0
  };
  tomatoes = [];
  frameCount = 0;
  score = 0;
  gameOver = false;
  gameOverScreen.style.display = "none";
  update();
}

// ====== Controls ======
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && rabbit.onGround && !gameOver) {
    rabbit.dy = rabbit.jumpPower;
    rabbit.onGround = false;
  }
});

restartBtn.addEventListener("click", initGame);

shareBtn.addEventListener("click", () => {
  const shareText = `I scored ${score} points in the Kissan Game 🍅🐇!`;
  const instagramUrl = `https://www.instagram.com/?text=${encodeURIComponent(shareText)}`;
  window.open(instagramUrl, "_blank");
});

// ====== Functions ======

function spawnTomato() {
  const tomato = {
    x: canvas.width,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    squished: false,
    squishTime: 0
  };
  tomatoes.push(tomato);
}

function drawRabbit(r, jump = false) {
  let img;
  if (jump) {
    img = rabbitJump;
  } else {
    r.runFrame += 0.2;
    if (r.runFrame >= rabbitRunImages.length) r.runFrame = 0;
    img = rabbitRunImages[Math.floor(r.runFrame)];
  }
  ctx.drawImage(img, r.x, r.y, r.width, r.height);
}

function drawTomatoes() {
  for (const t of tomatoes) {
    if (t.squished) {
      ctx.drawImage(tomatoSquishImg, t.x, t.y + 20, t.width, 25);
    } else {
      ctx.drawImage(tomatoImg, t.x, t.y, t.width, t.height);
    }
  }
}

function checkCollision(r, t) {
  return (
    r.x < t.x + t.width &&
    r.x + r.width > t.x &&
    r.y < t.y + t.height &&
    r.y + r.height > t.y
  );
}

function endGame() {
  gameOver = true;
  finalScoreText.textContent = `Game Over! 🎮 Your Score: ${score}`;
  gameOverScreen.style.display = "flex";
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#bde0fe";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#90e0ef";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

  // Rabbit Physics
  rabbit.y += rabbit.dy;
  rabbit.dy += rabbit.gravity;

  if (rabbit.y + rabbit.height >= canvas.height - 40) {
    rabbit.y = canvas.height - 40 - rabbit.height;
    rabbit.dy = 0;
    rabbit.onGround = true;
  }

  // Tomato Movement + Collision
  for (let i = tomatoes.length - 1; i >= 0; i--) {
    const t = tomatoes[i];
    t.x -= 6;

    // Collision
    if (!t.squished && checkCollision(rabbit, t)) {
      t.squished = true;
      t.squishTime = frameCount;
      score += 10;

      // 🎬 End game immediately when squished
      endGame();
      return;
    }

    if (t.squished && frameCount - t.squishTime > 20) {
      tomatoes.splice(i, 1);
    } else if (t.x + t.width < 0) {
      tomatoes.splice(i, 1);
    }
  }

  // Spawn Tomatoes Every 120 Frames (~2 seconds)
  if (frameCount % 120 === 0) {
    spawnTomato();
  }

  // Draw
  drawTomatoes();
  drawRabbit(rabbit, !rabbit.onGround);

  // Draw Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);

  frameCount++;
  requestAnimationFrame(update);
}

// ====== Start Game ======
initGame();
