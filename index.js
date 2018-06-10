let canvasElement = document.getElementById('canvas');
let canvasContext = canvasElement.getContext('2d');

// canvasElement.width = 800 + 'px';
// canvasElement.height = 800;


let ball = {
        x: canvasElement.width / 2,
        y: canvasElement.height / 2,
        width: 25,
        height: 25,
        speed: {
            x: -10,
            y: 3
        },
        color: '#fff'
    },
    user = {
        x: 0,
        y: canvasElement.height / 2,
        width: 15,
        height: 100,
        color: '#fff'
    },
    cpu = {
        x: 0,
        y: canvasElement.height / 2,
        width: 20,
        height: 50,
        color: '#fff'
    };

let clearCanvas = () => {
    canvasContext.fillStyle = '#000';
    canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);
};

let userLoseEvent = () => {
    console.log('lose');
};

let moveUser = (direction) => {
    user.y += direction;

    if (user.y < 0) {
        user.y = 0;
    } else if (user.y + user.height > canvasElement.height) {
        user.y = canvasElement.height - user.height;
    }
};

let drawUser = () => {
    canvasContext.fillStyle = user.color;
    canvasContext.fillRect(user.x, user.y, user.width, user.height);
};

let drawBall = () => {
    ball.x += ball.speed.x;
    ball.y += ball.speed.y;

    if (ball.y + ball.height >= canvasElement.height || ball.y <= 0) {
        ball.speed.y = -ball.speed.y;
    }

    if (ball.x + ball.width >= canvasElement.width) {
        ball.speed.x = -ball.speed.x;
    }

    if (ball.x - ball.speed.x >= 0 && ball.x - ball.speed.x <= user.x + user.width
        && ball.y > user.y - ball.height && ball.y < user.y + user.height) {
        ball.x = user.x + user.width + 1;
        ball.speed.x = -ball.speed.x;
        ball.speed.y = -1 * ball.speed.y + Math.random() * (5 - 1) + 1;
    }

    canvasContext.fillStyle = ball.color;
    canvasContext.fillRect(ball.x, ball.y, ball.width, ball.height);
};

document.onkeydown = (event) => {
    const key = event.key;

    if (key === 'ArrowUp') {
        moveUser(-15);
    } else if (key === 'ArrowDown') {
        moveUser(15);
    }
};

let gameIteration = () => {
    clearCanvas();

    drawBall();
    drawUser();
};

clearCanvas();

setInterval(gameIteration, 50);
