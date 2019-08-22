var canvas = document.getElementById("game");
var context = canvas.getContext('2d');
var ball =
  {
    x: 20,
    y: 20,
    dx: 5,
    dy: 2,
    radius: 10

  }
// document.addEventListener('keypress',function (event) {
//   cosole.log(event);
//
// })
var paddle =
  {
    width: 70,
    height: 18,
    x: 0,
    y: canvas.height - 10,
    speed: 10,

    isMovingLeft: false,
    isMovingRight: false,
  };
var BrickConfig =
  {
    offsetX: 25,
    offsetY: 25,
    margin: 25,
    width: 70,
    height: 15,
    totalRow: 3,
    totalCol: 5

  };
var isGameOver = false;
var isGameWin = false;
var UserScore = 0;
var MaxScore = BrickConfig.totalCol * BrickConfig.totalRow;

var BrickList = [];

for (var i = 0; i < BrickConfig.totalRow; i++) {
  for (var j = 0; j < BrickConfig.totalCol; j++) {
    BrickList.push({
      x: BrickConfig.offsetX + j * (BrickConfig.width + BrickConfig.margin),
      y: BrickConfig.offsetY + i * (BrickConfig.height + BrickConfig.margin),
      isBroken: false
    });
  }
}
document.addEventListener('keyup', function (event) {

  if (event.keyCode == 37) {
    paddle.isMovingLeft = false;
  } else if (event.keyCode == 39) {
    paddle.isMovingRight = false;
  }


});

document.addEventListener('keydown', function (event) {

  if (event.keyCode == 37) {
    paddle.isMovingLeft = true;
  } else if (event.keyCode == 39) {
    paddle.isMovingRight = true;
  }

})

function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = 'red';
  context.fill();
  context.closePath();

}

// drawBall();
// setInterval(function () {
//   context.clearRect(0,0,canvas.width,canvas.height);
//   drawBall();
// x+=2;
// y+=2;
// },200);
function drawpaddle() {
  context.beginPath();
  context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  context.fill();
  context.closePath();

}

function drawBricks() {
  BrickList.forEach(function (b) {
    if (!b.isBroken) {
      context.beginPath();
      context.rect(b.x, b.y, BrickConfig.width, BrickConfig.height);
      context.fill();
      context.closePath();
    }


  });
}

function handleBallCollideBounds() {
  if (ball.x <= ball.radius || ball.x >= canvas.width - ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y < ball.radius) {
    ball.dy = -ball.dy;
  }
}

function handleBallCollidePaddle() {
  if (ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width && ball.y + ball.radius >= canvas.height - paddle.height) {
    ball.dy = -ball.dy;
  }
}

function handleBallCollideBricks() {
  BrickList.forEach(function (b) {
    if (!b.isBroken) {
      if (ball.x >= b.x && ball.x <= b.x + BrickConfig.width && ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + BrickConfig.height) {
        ball.dy = -ball.dy;
        b.isBroken = true;
        UserScore += 1;
        if (UserScore >= MaxScore) {
          isGameOver = true;
          isGameWin = true;
        }
      }
    }

  })

}

function updateBallPosition() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function updatePaddlePosition() {
  if (paddle.isMovingLeft) {
    paddle.x -= paddle.speed;
  } else if (paddle.isMovingRight) {
    paddle.x += paddle.speed;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  } else if (paddle.x > canvas.width - paddle.width) {
    paddle.x = canvas.width - paddle.width;
  }
}

function checkGameOver() {
  if (ball.y > canvas.height - ball.radius) {
    isGameOver = true;
  }
}

function handleGameOver() {
  if (isGameWin) {
    console.log('YOU WIN');

  } else {
    console.log("YOU LOSE");
  }
}

function draw() {
  if (!isGameOver) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(); //tạo bóng  
    drawpaddle();// tạo thanh hứng bóng
    drawBricks();// tạo gạch

    handleBallCollideBounds();
    handleBallCollidePaddle();
    handleBallCollideBricks();
    updateBallPosition();
    updatePaddlePosition();
    checkGameOver();

    requestAnimationFrame(draw);
  } else {
    handleGameOver();
  }

}

draw();

