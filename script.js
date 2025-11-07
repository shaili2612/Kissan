const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🐇 Rabbit animation images
const rabbitStand = new Image();
rabbitStand.src = "rabbit.png";

const rabbitJump = new Image();
rabbitJump.src = "rabbit.png";

const rabbitRunImages = [
  "rabbit.jpg"
].map(src => { const img = new Image(); img.src = src; return img; });

// 🍅 Tomato images
const tomatoImg = new Image();
tomatoImg.src = "tomato.jpg";

const tomatoSquishImg = new Image();
tomatoSquishImg.src = "tomato_squished.jpg";

// Game variables
let score = 0;
let isJumping = false;
let jumpHeight = 0;
let jumpSpeed = 0;
let gravity = 0.8;
let runFrame = 0;

let rabbit = { x: 50, y: 300, width: 60, height: 60 };
let tomato = { x: 800, y: 320, width: 50, height: 50, squished: false };

// Draw rabbit with animation
function drawRabbit() {
  let img;
  if (isJumping) {
    img = rabbitJump;
  } else {
    // Cycle through running frames
    runFrame += 0.2;
    if (runFrame >= rabbitRunImages.length) runFrame = 0;
    img = rabbitRunImages[Math.floor(runFrame)];
  }
  ctx.drawImage(img, rabbit.x, rabbit.y - jumpHeight, rabbit.width, rabbit.height);
}

// Draw tomato
function drawTomato() {
  if (tomato.squished) {
    ctx.drawImage(tomatoSquishImg, tomato.x, tomato.y + 20, tomato.width, 25);
  } else {
    ctx.drawImage(tomatoImg, tomato.x, tomato.y, tomato.width, tomato.height);
  }
}

// Score
function drawScore() {
  ctx.font = "22px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 30);
}

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jump logic
  if (isJumping) {
    jumpHeight += jumpSpeed;
    jumpSpeed -= gravity;
    if (jumpHeight <= 0) { jumpHeight = 0; isJumping = false; }
  }

  // Move tomato
  tomato.x -= 6;
  if (tomato.x + tomato.width < 0) {
    tomato.x = 800 + Math.random() * 300;
    tomato.squished = false;
  }

  // Collision
  if (!tomato.squished &&
      rabbit.x + rabbit.width > tomato.x &&
      rabbit.x < tomato.x + tomato.width &&
      rabbit.y - jumpHeight + rabbit.height > tomato.y &&
      rabbit.y - jumpHeight < tomato.y + tomato.height) {
    tomato.squished = true;
    score++;
  }

  drawRabbit();
  drawTomato();
  drawScore();

  requestAnimationFrame(update);
}

// Jump key
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isJumping) {
    isJumping = true;
    jumpSpeed = 12;
  }
});

update();
