const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// 🖼️ Images
const rabbitImg = new Image();
rabbitImg.src = "rabbit.jpeg";

const tomatoImg = new Image();
tomatoImg.src = "Tomato250.jpg";

const tomatoSquishImg = new Image();
tomatoSquishImg.src = "tomato_squish.jpg"; // ✅ Make sure this filename is correct!

// ✅ Wait until all images load
let imagesLoaded = 0;
[rabbitImg, tomatoImg, tomatoSquishImg].forEach((img) => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) startGame();
  };
});

// 🧩 Game variables
let rabbit = { x: 100, y: 300, width: 80, height: 80, jumping: false, jumpSpeed: 0 };
let tomatoes = [];
let score = 0;
let gameOver = false;
let gravity = 0.5;
let adShown = false;
let lastTomatoTime = 0;
let tomatoDelay = 2000; // 🕒 at least 2 seconds between tomatoes

// 🕹️ Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !rabbit.jumping && !gameOver) {
    rabbit.jumping = true;
    rabbit.jumpSpeed = -10;
  }
});

// 🍅 Spawn tomatoes (with spacing)
function spawnTomato() {
  const now = Date.now();
  const lastTomato = tomatoes[tomatoes.length - 1];
  if (lastTomato && lastTomato.x > 500) return; // 🧱 Don't spawn too close
  if (now - lastTomatoTime < tomatoDelay) return; // ⏳ Cooldown

  tomatoes.push({
    x: canvas.width + Math.random() * 200,
    y: 320,
    width: 60,
    height: 60,
    squished: false,
    squishTime: 0
  });
  lastTomatoTime = now;
}

// 🚀 Start game
function startGame() {
  spawnTomato();
  update();
}

// 🧠 Game logic
function update() {
  if (gameOver) return;

  // 🐇 Jump logic
  if (rabbit.jumping) {
    rabbit.jumpSpeed += gravity;
    rabbit.y += rabbit.jumpSpeed;
    if (rabbit.y >= 300) {
      rabbit.y = 300;
      rabbit.jumping = false;
    }
  }

  // 🍅 Move tomatoes
  for (let t of tomatoes) {
    t.x -= 6;

    // 🧍‍♂️ Collision detection
    if (
      !t.squished &&
      rabbit.x < t.x + t.width &&
      rabbit.x + rabbit.width > t.x &&
      rabbit.y < t.y + t.height &&
      rabbit.y + rabbit.height > t.y
    ) {
      if (rabbit.jumping) {
        t.squished = true;
        t.squishTime = Date.now();
        score++;
      } else {
        endGame();
      }
    }
  }

  // 🍅 Remove off-screen or expired squished tomatoes
  tomatoes = tomatoes.filter((t) => {
    if (t.squished && Date.now() - t.squishTime > 800) return false;
    return t.x + t.width > 0;
  });

  // 🌱 Add tomatoes only if spaced enough
  spawnTomato();

  draw();
  requestAnimationFrame(update);
}

// 🖌️ Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffe6f0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🐇 Rabbit
  ctx.drawImage(rabbitImg, rabbit.x, rabbit.y, rabbit.width, rabbit.height);

  // 🍅 Tomatoes
  for (let t of tomatoes) {
    if (t.squished) {
      ctx.drawImage(tomatoSquishImg, t.x, t.y + 10, t.width, t.height - 10);
    } else {
      ctx.drawImage(tomatoImg, t.x, t.y, t.width, t.height);
    }
  }

  // 🧮 Score
  ctx.fillStyle = "black";
  ctx.font = "20px Poppins";
  ctx.fillText("Score: " + score, 20, 30);
}

// 🚫 Game over
function endGame() {
  gameOver = true;
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Poppins";
  ctx.fillText("Game Over! Your Score: " + score, 220, 180);

  // 🖼️ Show Kissan ad
  if (!adShown) {
    adShown = true;
    const adImg = new Image();
    adImg.src = "kissan_ad.jpg";
    adImg.onload = () => {
      ctx.drawImage(adImg, 280, 220, 250, 130);

      // 📱 Add share button
      const shareBtn = document.createElement("button");
      shareBtn.innerText = "Share on Instagram 📸";
      shareBtn.style = `
        position: absolute;
        top: 370px;
        left: 310px;
        background-color: #ff6699;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 10px;
        cursor: pointer;
      `;
      document.body.appendChild(shareBtn);

      shareBtn.onclick = () => {
        const text = `I scored ${score} in the Kissan Game! 🍅🐇`;
        window.open(
          `https://www.instagram.com/?text=${encodeURIComponent(text)}`,
          "_blank"
        );
      };
    };
  }
}

