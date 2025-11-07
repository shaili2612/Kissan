// ====== Canvas Setup ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// ====== Game Assets ======
const rabbitRunImages = [];
const totalRabbitFrames = 2; // you can add more later

for (let i = 1; i <= totalRabbitFrames; i++) {
  const img = new Image();
  img.src = `rabbit${i}.png`; // example: rabbit1.png, rabbit2.png
  rabbitRunImages.push(img);
}

const rabbitJump = new Image();
rabbitJump.src = "rabbit_jump.png";

const tomatoImg = new Image();
tomatoImg.src = "tomato.png";

// ====== Game Variables ======
let rabbit = {
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

let tomatoes = [];
let frameCount = 0;
let score = 0;
let jumpHeight = 60;

// ====== Controls ======
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && rabbit.onGround) {
    rabbit.dy = rabbit.jumpPower;
    rabbit.onGround = false;
  }
});

// ====== Functions ======

function spawnTomato() {
  const tomato = {
    x: canvas.width,
    y: canvas.height - 100,
    width: 50,
    height: 50
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
    ctx.drawImage(tomatoImg, t.x, t.y, t.width, t.height);
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

function update() {
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

    if (checkCollision(rabbit, t)) {
      tomatoes.splice(i, 1);
      score += 10; // ✅ score increase
    }

    if (t.x + t.width < 0) {
      tomatoes.splice(i, 1);
    }
  }

  // Spawn Tomatoes Every 120 Frames (~2 seconds)
  if (frameCount % 120 === 0) {
    spawnTomato();
  }

  // Draw Everything
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
update();
