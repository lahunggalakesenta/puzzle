let level = 1;
let timer = 60;
let score = 0;
let interval;
let enemyInterval;
let player = { x: 1, y: 1 };
let enemy = { x: 0, y: 0 };
let maze = [];
let size;

function generateMaze(s) {
    size = s;
    maze = [];
    for (let y = 0; y < size; y++) {
        maze[y] = [];
        for (let x = 0; x < size; x++) {
            if (y === 0 || x === 0 || y === size - 1 || x === size - 1) {
                maze[y][x] = 1;
            } else {
                maze[y][x] = Math.random() > 0.75 ? 1 : 0;
            }
        }
    }

    maze[1][1] = 0;
    maze[size - 2][size - 2] = 2;

    // coins
    for (let i = 0; i < level + 2; i++) {
        let rx = Math.floor(Math.random() * (size - 2)) + 1;
        let ry = Math.floor(Math.random() * (size - 2)) + 1;
        if (maze[ry][rx] === 0) maze[ry][rx] = 3;
    }
}

function levelSevenMaze() {
    maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    size = 9;
}

function drawMaze() {
    const mazeDiv = document.getElementById("maze");
    mazeDiv.innerHTML = "";
    mazeDiv.style.gridTemplateColumns = `repeat(${size}, 28px)`;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (maze[y][x] === 1) cell.classList.add("wall");
            if (maze[y][x] === 0) cell.classList.add("path");
            if (maze[y][x] === 2) cell.classList.add("goal");
            if (maze[y][x] === 3) cell.classList.add("coin");

            if (player.x === x && player.y === y)
                cell.classList.add("player");

            if (level >= 5 && enemy.x === x && enemy.y === y)
                cell.classList.add("enemy");

            mazeDiv.appendChild(cell);
        }
    }
}

function startTimer() {
    timer = 60;
    document.getElementById("timer").innerText = timer;
    clearInterval(interval);
    interval = setInterval(() => {
        timer--;
        document.getElementById("timer").innerText = timer;
        if (timer <= 0) gameOver("⏰ Time Up!");
    }, 1000);
}

function move(dx, dy) {
    let nx = player.x + dx;
    let ny = player.y + dy;

    if (maze[ny][nx] !== 1) {
        player.x = nx;
        player.y = ny;

        if (maze[ny][nx] === 3) {
            score += 10;
            maze[ny][nx] = 0;
            document.getElementById("score").innerText = score;
        }

        if (maze[ny][nx] === 2) nextLevel();

        if (level >= 5 && nx === enemy.x && ny === enemy.y)
            gameOver("💀 Kena Musuh!");

        drawMaze();
    }
}

function moveEnemy() {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const d = dirs[Math.floor(Math.random() * 4)];
    let nx = enemy.x + d[0];
    let ny = enemy.y + d[1];

    if (maze[ny][nx] !== 1) {
        enemy.x = nx;
        enemy.y = ny;
    }

    if (enemy.x === player.x && enemy.y === player.y)
        gameOver("💀 Kena Musuh!");

    drawMaze();
}

function nextLevel() {
    clearInterval(interval);
    clearInterval(enemyInterval);

    if (level < 10) {
        level++;
        document.getElementById("level").innerText = level;
        document.getElementById("progress").style.width = level * 10 + "%";
        player = { x: 1, y: 1 };

        if (level === 7) levelSevenMaze();
        else generateMaze(6 + level);

        if (level >= 5) {
            enemy = { x: size - 2, y: 1 };
            enemyInterval = setInterval(moveEnemy, 500);
        }

        startTimer();
        drawMaze();
    } else {
        alert("🏆 YOU WIN! Final Score: " + score);
        restartGame();
    }
}

function gameOver(msg) {
    clearInterval(interval);
    clearInterval(enemyInterval);
    alert(msg + " | Score: " + score);
    restartGame();
}

function restartGame() {
    level = 1;
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("progress").style.width = "10%";
    document.getElementById("level").innerText = level;
    player = { x: 1, y: 1 };
    generateMaze(7);
    startTimer();
    drawMaze();
}

document.addEventListener("keydown", e => {
    if (e.key === "w" || e.key === "W") move(0, -1);
    if (e.key === "s" || e.key === "S") move(0, 1);
    if (e.key === "a" || e.key === "A") move(-1, 0);
    if (e.key === "d" || e.key === "D") move(1, 0);
});

restartGame();
