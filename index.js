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
            x: 10,
            y: 10
        },
        color: '#fff'
    },
    user = {
        x: 0,
        y: 0,
        width: 20,
        height: 50,
        color: '#fff'
    },
    cpu = {
        x: 0,
        y: 0,
        width: 20,
        height: 50,
        color: '#fff'
    };

let clearCanvas = (canvasContext) => {
    canvasContext.fillStyle = '#000';
    canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);
};

let gameIteration = (canvasContext) => {
    clearCanvas(canvasContext);
    ball.x += ball.speed.x;
    ball.y += ball.speed.y;

    if(ball.y + ball.height >= canvasElement.height || ball.y <= 0) {
        ball.speed.y = -ball.speed.y;
    }

    if(ball.x + ball.width >= canvasElement.width || ball.x <= 0) {
        ball.speed.x = -ball.speed.x;
    }

    canvasContext.fillStyle = ball.color;
    canvasContext.fillRect(ball.x, ball.y, ball.width, ball.height);
};

clearCanvas(canvasContext);

setInterval(() => {
    gameIteration(canvasContext)
}, 50);