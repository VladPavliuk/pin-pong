let server = {
    url: 'https://localhost:44390',
    connection: undefined,
    room: undefined,

    getToken() {
        let url = new URL(window.location.href);
        return url.searchParams.get("token");
    },

    _init: function() {
        server.connection = new signalR.HubConnectionBuilder()
            .withUrl(server.url + "/chatHub")
            .build();
    },
    _autorun: function() {
        if(this.getToken()) {
            server.room = this.getToken();
            this._init();
            this.subscribe();
        }
    },
    subscribe: function() {
        server.connection
            .start()
            .then(() => server.connection.invoke("joinRoom", server.room))
            .catch(err => console.error(err));
    },
    score: {
        send(score) {
            server.connection.invoke("closeSession", {
                room: server.room,
                score
            })
        }
    }
};

server._autorun();

let canvasElement = document.createElement('canvas');
canvasElement.width = 800;
canvasElement.height = 400;

let wrapper = document.getElementById('wrapper');
wrapper.appendChild(canvasElement);

let canvasContext = canvasElement.getContext('2d');

let isGameOver = false;
let ball = {
        x: 0,
        y: 0,
        width: 25,
        height: 25,
        speed: {
            x: 15,
            y: 10
        },
        color: '#fff'
    },
    user = {
        x: 0,
        y: 0,
        width: 15,
        height: 100,
        color: '#fff',
        score: 0,
    },
    cpu = {
        x: 0,
        y: 0,
        width: 15,
        height: 100,
        color: '#fff',
        speed: {
            y: 10
        }
    };

let initMap = () => {
        ball.x = canvasElement.width / 2;
        ball.y = canvasElement.height / 2 + 80;
        ball.speed.x = Math.random() > .5 ? 10 : -10;
        ball.speed.y = 0;

        user.x = 0;
        user.y = canvasElement.height / 2;

        cpu.x = canvasElement.width - cpu.width;
        cpu.y = canvasElement.height / 2;
    },
    clearCanvas = () => {
        canvasContext.fillStyle = '#000';
        canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);
    },
    drawScore = (score, font = 30) => {
        canvasContext.font = font + "px Arial";
        canvasContext.fillStyle = '#fff';
        canvasContext.fillText("Your score: " + score, canvasElement.width / 2 - 90, 50);
    },
    userLoseEvent = () => {
        isGameOver = true;
    },
    userWinEvent = () => {
        user.score++;
        drawScore(user.score);
        initMap();
    },
    moveUser = (direction) => {
        user.y += direction;

        if (user.y < 0) {
            user.y = 0;
        } else if (user.y + user.height > canvasElement.height) {
            user.y = canvasElement.height - user.height;
        }
    },
    drawUser = () => {
        canvasContext.fillStyle = user.color;
        canvasContext.fillRect(user.x, user.y, user.width, user.height);
    },
    moveBall = () => {
        ball.x += ball.speed.x;
        ball.y += ball.speed.y;

        if (ball.y + ball.height >= canvasElement.height || ball.y <= 0) {
            ball.speed.y = -ball.speed.y;
        }

        if (ball.x - ball.speed.x >= 0 && ball.x - ball.speed.x <= user.x + user.width
            && ball.y > user.y - ball.height && ball.y < user.y + user.height) {
            ball.x = user.x + user.width + 1;
            ball.speed.x = -ball.speed.x;
            ball.speed.y = -1 * ball.speed.y + Math.random() * (5 - 1) + 1;
        }

        if (ball.x + ball.speed.x <= canvasElement.width && ball.x + ball.speed.x >= cpu.x - cpu.width
            && ball.y > cpu.y - ball.height && ball.y < cpu.y + cpu.height) {
            ball.x = cpu.x - cpu.width - 1;
            ball.speed.x = -ball.speed.x;
            ball.speed.y = -1 * ball.speed.y + Math.random() * (5 - 1) + 1;
        }

        if (ball.x < 0) {
            userLoseEvent();
        } else if (ball.x + ball.width > canvasElement.width) {
            userWinEvent();
        }
    },
    drawBall = () => {
        canvasContext.fillStyle = ball.color;
        canvasContext.fillRect(ball.x, ball.y, ball.width, ball.height);
    },
    moveCpu = () => {
        if (ball.y > cpu.y + cpu.height / 2 && cpu.y + cpu.height < canvasElement.height) {
            cpu.y += cpu.speed.y;
        } else if (ball.y < cpu.y) {
            cpu.y -= cpu.speed.y;
        }
    },
    drawCpu = () => {
        canvasContext.fillStyle = cpu.color;
        canvasContext.fillRect(cpu.x, cpu.y, cpu.width, cpu.height);
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
    if (!isGameOver) {
        clearCanvas();
        drawScore(user.score);
        moveBall();
        drawBall();

        moveCpu();
        drawCpu();

        drawUser();
    } else {
        clearCanvas();
        drawScore(user.score, 60);
        server.score.send(user.score);
        clearInterval(gameInterval);
    }
};

clearCanvas();
initMap();

let gameInterval = setInterval(gameIteration, 40);
