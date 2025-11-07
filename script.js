const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Online rabbit images
const rabbitStand = new Image();
rabbitStand.src = "https://i.postimg.cc/8PMYzM3R/rabbit.png"; // placeholder standing

const rabbitJump = new Image();
rabbitJump.src = "https://i.postimg.cc/0jXxq2F0/rabbit-jump.png"; // placeholder jumping

const rabbitRunImages = [
  "https://i.postimg.cc/8PMYzM3R/rabbit.png", // run1
  "https://i.postimg.cc/8PMYzM3R/rabbit.png", // run2
  "https://i.postimg.cc/8PMYzM3R/rabbit.png"  // run3
].map(src => { const img = new Image(); img.src = src; return img; });

// Online tomato images
const tomatoImg = new Image();
tomatoImg.src = "https://i.postimg.cc/qBq8m7Yk/tomato.png";

const tomatoSquishImg = new Image();
tomatoSquishImg.src = "https://i.postimg.cc/d0k0V8kQ/tomato-squished.png";

// Game variables
let score = 0;
let isJumping = false;
let jumpHeight = 0;
let jumpSpeed = 0;
let gravity = 0.8;
let runFrame = 0;

// Player rabbit
let player = { x: 50, y: 300, width: 60, height: 60 };

// Background rabbits
let rabbits = [
  { x: 200, y: 300, width: 50, height: 50, runFrame: 0 },
  { x: 400, y: 300, width: 50, height: 50, runFrame: 0 },
  { x: 600, y: 300, width: 50, height: 50, runFrame: 0 },
];

// Tomatoes
let tomatoes = [];
for (let i = 0; i < 5; i++) {
  tomatoes.push({
    x: 800 + Math.random()*400,
    y: 320,
    width: 50,
    height: 50,
    squished: false
  });
}

// Draw rabbit
function drawRabbit(r, jump=false) {
  let img;
  if (jump) img = rabbitJump;
  else {
    r.runFrame += 0.2;
    if (r.runFrame >= rabbitRunImages.length) r.runFrame = 0;
    img = rabbitRunImages[Math.floor(r.runFrame)];
  }
  ctx.drawImage(img, r.x, r.y - (jump ? jumpHeight : 0), r.width, r.height);
}

// Draw tomato
function drawTomato(t) {
  if (t.squished) ctx.drawImage(tomatoSquishImg, t.x, t.y + 20, t.width, 25);
  else ctx.drawImage(tomatoImg, t.x, t.y, t.width, t.height);
}

// Draw score
function drawScore() {
  ctx.font = "22px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 30);
}

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player jump
  if (isJumping) {
    jumpHeight += jumpSpeed;
    jumpSpeed -= gravity;
    if (jumpHeight <= 0) { jumpHeight = 0; isJumping = false; }
  }

  // Move background rabbits
  rabbits.forEach(r => {
    r.x -= 2;
    if (r.x + r.width < 0) r.x = 800 + Math.random()*200;
    drawRabbit(r);
  });

  // Move tomatoes
  tomatoes.forEach(t => {
    t.x -= 6;
    if (t.x + t.width < 0) {
      t.x = 800 + Math.random()*400;
      t.squished = false;
    }

    // Collision with player
    if (!t.squished &&
        player.x + player.width > t.x &&
        player.x < t.x + t.width &&
        player.y - jumpHeight + player.height > t.y &&
        player.y - jumpHeight < t.y + t.height) {
      t.squished = true;
      score++;
    }

    drawTomato(t);
  });

  // Draw player
  drawRabbit(player, isJumping);

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

// Wait for all images to load before starting
function loadImages(images, callback) {
  let loaded = 0;
  images.forEach(img => {
    img.onload = () => { loaded++; if (loaded === images.length) callback(); }
  });
}

// Start game
loadImages([rabbitStand, rabbitJump, ...rabbitRunImages, tomatoImg, tomatoSquishImg], update);
