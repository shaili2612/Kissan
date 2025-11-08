const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let rabbit = { x: 100, y: 300, width: 80, height: 80, vy: 0, jumping: false, runFrame: 0 };
let tomatoes = [];
let score = 0;
let gameOver = false;

const gravity = 0.5;
const jumpStrength = -10;

const rabbitRunImages = [new Image(), new Image()];
rabbitRunImages[0].src = "rabbit.jpeg";
rabbitRunImages[1].src = "rabbit.jpeg";
const rabbitJump = new Image();
rabbitJump.src = "rabbit.jpeg";
const tomatoImg = new Image();
tomatoImg.src = "Tomato250.jpg";
const squishImg = new Image();
squishImg.src = "tomato_squish.jpg";

document.addEventListener("keydown", e => {
  if (e.code === "Space" && !rabbit.jumping && !gameOver) {
    rabbit.vy = jumpStrength;
    rabbit.jumping = true;
  }
});

function spawnTomato() {
  tomatoes.push({
    x: canvas.width,
    y: 320,
    width: 50,
    height: 50,
    squished: false,
    img: tomatoImg
  });
}

function drawRabbit(r, jump = false) {
  let img;
  if (jump) img = rabbitJump;
  else {
    r.runFrame += 0.2;
    if (r.runFrame >= rabbitRunImages.length) r.runFrame = 0;
    img = rabbitRunImages[Math.floor(r.runFrame)];
  }
  ctx.drawImage(img, r.x, r.y, r.width, r.height);
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rabbit gravity
  rabbit.vy += gravity;
  rabbit.y += rabbit.vy;
  if (rabbit.y >= 300) {
    rabbit.y = 300;
    rabbit.vy = 0;
    rabbit.jumping = false;
  }

  drawRabbit(rabbit, rabbit.jumping);

  // Tomatoes movement + collision
  tomatoes.forEach((t, i) => {
    t.x -= 5;
    ctx.drawImage(t.img, t.x, t.y, t.width, t.height);

    // Collision detection
    if (
      !t.squished &&
      rabbit.x < t.x + t.width &&
      rabbit.x + rabbit.width > t.x &&
      rabbit.y + rabbit.height > t.y + 20
    ) {
      t.img = squishImg;
      t.squished = true;
      score += 1;
      document.getElementById("scoreDisplay").innerText = "Score: " + score;

      setTimeout(() => endGame(), 1000); // delay before game over
    }

    if (t.x + t.width < 0) tomatoes.splice(i, 1);
  });

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
  window.open(`${shareUrl}`, "_blank");
  alert("Copy this text and share it in your story:\n" + shareText);
});

setInterval(spawnTomato, 2000);
update();
