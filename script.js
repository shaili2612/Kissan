const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let rabbit = { x: 100, y: 300, width: 80, height: 80, jumping: false, velocityY: 0 };
let gravity = 0.5;
let tomatoes = [];
let gameOver = false;
let score = 0;

const rabbitImg = new Image();
rabbitImg.src = "rabbit.jpeg";

const tomatoImg = new Image();
tomatoImg.src = "Tomato250.jpg";

const tomatoSquishedImg = new Image();
tomatoSquishedImg.src = "tomato_squished.jpg"; // <-- add your squish image

const jumpSound = new Audio();
const squishSound = new Audio();
squishSound.src = "squish.mp3"; // optional sound

function spawnTomato() {
  const lastTomato = tomatoes[tomatoes.length - 1];
  const gap = 400 + Math.random() * 200;
  const x = lastTomato ? lastTomato.x + gap : 900;
  tomatoes.push({ x, y: 320, width: 50, height: 50, squished: false });
}

function drawRabbit() {
  ctx.drawImage(rabbitImg, rabbit.x, rabbit.y, rabbit.width, rabbit.height);
}

function drawTomatoes() {
  tomatoes.forEach(t => {
    if (t.squished) ctx.drawImage(tomatoSquishedImg, t.x, t.y + 20, t.width, t.height);
    else ctx.drawImage(tomatoImg, t.x, t.y, t.width, t.height);
  });
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRabbit();
  drawTomatoes();

  // gravity
  if (rabbit.jumping) {
    rabbit.y += rabbit.velocityY;
    rabbit.velocityY += gravity;
    if (rabbit.y >= 300) {
      rabbit.y = 300;
      rabbit.jumping = false;
    }
  }

  // move tomatoes
  tomatoes.forEach(t => (t.x -= 5));

  // collision & scoring
  tomatoes.forEach(t => {
    if (!t.squished &&
        rabbit.x < t.x + t.width &&
        rabbit.x + rabbit.width > t.x &&
        rabbit.y + rabbit.height > t.y) {
      t.squished = true;
      squishSound.play();
      endGame();
    } else if (t.x + t.width < rabbit.x && !t.passed) {
      score++;
      t.passed = true;
    }
  });

  // remove off-screen tomatoes
  tomatoes = tomatoes.filter(t => t.x + t.width > 0);

  // spawn new tomato
  if (tomatoes.length < 3) spawnTomato();

  // score text
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 20, 30);

  requestAnimationFrame(update);
}

function endGame() {
  gameOver = true;
  document.getElementById("gameOver").style.display = "block";
  document.getElementById("finalScore").innerText = `Your Score: ${score}`;
}

document.addEventListener("keydown", e => {
  if (e.code === "Space" && !rabbit.jumping && !gameOver) {
    rabbit.jumping = true;
    rabbit.velocityY = -10;
  }
});

document.getElementById("shareBtn").addEventListener("click", () => {
  const text = `I scored ${score} in the Kissan Game! 🍅🐇 Try it now!`;
  const url = "https://shaili2612.github.io/Kissan/";
  const instaURL = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;
  window.open(instaURL, "_blank");
});

s
