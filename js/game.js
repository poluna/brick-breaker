const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

const PADDLE_WIDTH = 120;
const PADDLE_MARGIN_BOTTOM = 35;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 13;
const SCORE_UNIT = 10;
let SCORE = 0;
let LIFE = 3;
let LEVEL = 1;
let leftArrow = false;
let rightArrow = false;

const scoreStats = document.querySelector(".score");
const levelStats = document.querySelector(".level");
const lifeStats = document.querySelector(".life");

const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5,
};

// draw paddle
function drawPaddle() {
  ctx.fillStyle = "#2e3548";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    leftArrow = true;
  } else if (event.keyCode == 39) {
    rightArrow = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.keyCode == 37) {
    leftArrow = false;
  } else if (event.keyCode == 39) {
    rightArrow = false;
  }
});

//move paddle
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

//create the ball
const ball = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};

//draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#4998bf";
  ctx.fill();
  ctx.closePath();
}

//move the ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

//ball and wall collision detection
function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }
  if (ball.y + ball.radius > cvs.height) {
    LIFE--;
    resetBall();
  }
}

//reset the ball
function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}

//ball and paddle collision
function ballPaddleCollision() {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    ball.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  ) {
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);
    collidePoint = collidePoint / (paddle.width / 2);
    let angle = (collidePoint * Math.PI) / 3;

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}

//create the bricks
const brick = {
  row: 3,
  column: 5,
  width: 85,
  height: 20,
  offSetLeft: 23,
  offSetTop: 20,
  marginTop: 30,
  fillColor: "#401e52",
};

let bricks = [];

function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.width + brick.offSetLeft) + brick.offSetLeft,
        y:
          r * (brick.height + brick.offSetTop) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
}

createBricks();

//draw the bricks
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          ball.dy = -ball.dy;
          b.status = false;
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
}

function showStats() {
  scoreStats.innerText = SCORE;
  levelStats.innerText = LEVEL;
  lifeStats.innerText = LIFE;
}

function updateStatus() {
  let hitAllBricks = true;
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      hitAllBricks = hitAllBricks && !bricks[r][c].status;
    }
  }
  if (hitAllBricks && LEVEL < 3) {
    LEVEL++;
    if (LEVEL == 3) {
      alert("YOU WIN");
      document.location.reload();
    } else {
      brick.row++;
      ball.speed += 0.8;
      resetBall();
      createBricks();
    }
  }
  if (LIFE == 0) {
    alert("GAME OVER");
    LIFE = 3;
    document.location.reload();
  }
}

//draw function
function draw() {
  drawPaddle();
  drawBall();
  drawBricks();
}

//update game function
function update() {
  movePaddle();
  moveBall();
  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();
  showStats();
  updateStatus();
}

function loop() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  draw();
  update();

  requestAnimationFrame(loop);
}

// const interval = setInterval(loop, 5);
loop();
