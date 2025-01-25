/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const brickInitX = 0;
const brickInitY = 50;
const brickWidth = 50;
const brickHeight = 20;
const offsetX = brickWidth / 2;
const offsetY = 10;
const brickRows = 5;
const brickCols = 7;

var bricks = [];
var score = 0;

const paddleWidth = 80;
const paddleHeight = 20;

const keys = { ArrowRight: false, ArrowLeft: false };
const mouseClick = {
  x: undefined,
  y: undefined,
  width: 0.1,
  height: 0.1,
  clicked: false,
};
const restartBtn = new Button(
  70,
  30,
  canvas.width / 2 - 35,
  canvas.height / 2 - 15,
  "purple",
  "Restart.",
  "white",
  canvas,
  restart,
  mouseClick
);
var canvasRect = canvas.getBoundingClientRect();

var gameOver = false;

const soundEffects = {
  paddle_hit: new Audio("resources/paddle_hit.mp3"),
  brick_break: new Audio("resources/brick_break.mp3"),
};

function trackMouse() {
  window.addEventListener("resize", function () {
    canvasRect = canvas.getBoundingClientRect();
  });

  canvas.addEventListener("mousedown", function () {
    mouseClick.clicked = true;
  });

  canvas.addEventListener("mouseup", function () {
    mouseClick.clicked = false;
  });

  canvas.addEventListener("mousemove", function (e) {
    mouseClick.x = e.clientX - canvasRect.left;
    mouseClick.y = e.clientY - canvasRect.top;
  });

  canvas.addEventListener("mouseleave", function (e) {
    mouseClick.x = undefined;
    mouseClick.y = undefined;
  });
}

function startScreen() {
  canvas.addEventListener("click", startGame);
  canvas.title = "click to start play.";
  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.textBaseline = "center";
  ctx.fillStyle = "white";
  ctx.font = "30px monospace";
  ctx.fillText("Start Game.", canvas.width / 2, canvas.height / 2);
}

window.addEventListener("load", function () {
  startScreen();
});

function startGame() {
  window.addEventListener("keydown", function (e) {
    if (keys.hasOwnProperty(e.code)) {
      keys[e.code] = true;
    }
  });

  window.addEventListener("keyup", function (e) {
    if (keys.hasOwnProperty(e.code)) {
      keys[e.code] = false;
    }
  });

  canvas.removeEventListener("click", startGame);
  canvas.style.cursor = "none";
  canvas.removeAttribute("title");

  generateBricks();
  trackMouse();
  requestAnimationFrame(Render);
}

function generateBricks() {
  for (let r = 0; r < brickRows; r++) {
    for (let c = 0; c < brickCols; c++) {
      const brick = new Brick(
        brickInitX + c * brickWidth + c * offsetX,
        brickInitY + r * brickHeight + r * offsetY,
        brickWidth,
        brickHeight,
        soundEffects.brick_break.cloneNode()
      );
      bricks.push(brick);
    }
  }
}

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: -2,
  dy: 2,
  speed: 2,
  radius: 7.5,
  width: 7.5,
  height: 7.5,
  draw: function () {
    ctx.beginPath();
    ctx.fillStyle = "azure";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  },
  update: function () {
    this.x += this.dx;
    this.y += this.dy;

    if (this.y <= this.radius) {
      this.dy *= -1;
    }

    if (this.x + this.radius >= canvas.width || this.x <= this.radius) {
      this.dx *= -1;
    }

    if (this.y + this.height >= canvas.height) {
      gameOver = true;
    }
  },
  init() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.dx = Math.floor(Math.random() * 2) ? 2 : -2;
    this.dy = 2;
  },
  updateSpeed() {
    this.dx = Math.sign(this.dx) == 1 ? this.speed : -this.speed;
    this.dy = Math.sign(this.dy) == 1 ? this.speed : -this.speed;
  }
};

const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - paddleHeight,
  width: paddleWidth,
  height: paddleHeight,
  speed: 4,
  draw: function () {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  update() {
    if (keys.ArrowRight) {
      var nextX = this.x + this.speed;
      if (!outOfBounds(nextX)) {
        this.x += this.speed;
      } else {
        this.x = canvas.width - this.width;
      }
    }
    if (keys.ArrowLeft) {
      var nextX = this.x - this.speed;
      if (!outOfBounds(nextX)) {
        this.x -= this.speed;
      } else {
        this.x = 0;
      }
    }

    if (collisionDetection(ball, this)) {
      soundEffects.paddle_hit.play();
      ball.dy *= -1;
      if (score == 5) {
        ball.speed++;
        ball.updateSpeed();
      }
    }
  },
  init() {
    this.x = canvas.width / 2 - paddleWidth / 2;
    this.y = canvas.height - paddleHeight;
  },
};

function outOfBounds(xPos) {
  return xPos < 0 || xPos + paddleWidth > canvas.width;
}

function handleBricks() {
  
  for (let i = 0; i < bricks.length; i++) {
    var brick = bricks[i];
    brick.draw();

    if (collisionDetection(ball, brick)) {
      brick.breakSound.play();
      brick.broked = true;
      ball.dy *= -1;
      score++;
    }
  }
  console.log(brick);
}

function displayScore() {
  ctx.beginPath();
  ctx.textBaseline = "top";
  ctx.textAlign = "start";
  ctx.font = "30px monospace";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 0, 0);
}

function Render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) gameScreen();
  else otherScreen();

  requestAnimationFrame(Render);
}

function gameScreen() {
  if (bricks.length > 0) {
    displayScore();
    handleBricks();
    [ball, paddle].forEach((obj) => obj.draw());
    [ball, paddle].forEach((obj) => obj.update());
    bricks = bricks.filter((brick) => brick.broked != true);
  } else {
    gameOver = true;
  }
}

var y = 0;

function otherScreen() {

  if (bricks.length > 0) {
    canvas.style.cursor = "auto";

    ctx.beginPath();
    ctx.font = "40px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Game Over!", canvas.width / 2, 100);

    restartBtn.display();
  } else {
    ctx.beginPath();
    ctx.font = "40px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";

    if (y < 50) {
      y++;
    }

    ctx.fillText("You Won!", canvas.width / 2, y);
  }
}

function rndColor() {
  return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
    Math.random() * 256
  )},${Math.floor(Math.random() * 256)})`;
}

function collisionDetection(rect1, rect2) {
  return (
    rect1.x + rect1.width >= rect2.x &&
    rect1.x <= rect2.x + rect2.width &&
    rect1.y + rect1.height >= rect2.y &&
    rect1.y <= rect2.y + rect2.height
  );
}

function restart() {
  bricks = [];
  score = 0;
  gameOver = false;
  ball.speed = 2;
  ball.updateSpeed();
  generateBricks();

  [ball, paddle].forEach((obj) => obj.init());
  canvas.style.cursor = "none";
  
}
