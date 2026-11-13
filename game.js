
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
const scoreText = document.getElementById("score");

let score = 0;

const player = {
    x: 400,
    y: 225,
    size: 18,
    speed: 3,
    direction: "down"
};

const keys = {};

const crystals = [
    {x: 150, y: 100, collected: false},
    {x: 300, y: 330, collected: false},
    {x: 550, y: 130, collected: false},
    {x: 680, y: 350, collected: false},
    {x: 100, y: 350, collected: false}
];

document.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;

    if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
        event.preventDefault();
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});


function drawWorld() {
    // Fill the entire screen with grass
    ctx.fillStyle = "#285B42";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Magical pathway
    ctx.fillStyle = "#542D78";
    ctx.fillRect(
        0,
        canvas.height / 2 - 32,
        canvas.width,
        65
    );

    // Decorative magical plants
    for (let i = 0; i < 100; i++) {
        const x = (i * 97) % canvas.width;
        const y = (i * 61) % canvas.height;

        ctx.fillStyle = "#80B879";
        ctx.fillRect(x, y, 5, 5);
    }

    // Magical glowing flowers
    for (let i = 0; i < 35; i++) {
        const x = (i * 113 + 45) % canvas.width;
        const y = (i * 79 + 30) % canvas.height;

        if (
            y > canvas.height / 2 - 40 &&
            y < canvas.height / 2 + 40
        ) continue;

        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#D98BFF";

        ctx.fillStyle = i % 2 === 0 ? "#D98BFF" : "#F3D78B";

        ctx.beginPath();
        ctx.arc(x, y - 5, 5, 0, Math.PI * 2);
        ctx.arc(x, y + 5, 5, 0, Math.PI * 2);
        ctx.arc(x - 5, y, 5, 0, Math.PI * 2);
        ctx.arc(x + 5, y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#FFF4B0";
        ctx.fillRect(x - 2, y - 2, 4, 4);

        ctx.restore();
    }

    // Trees
    for (let i = 0; i < 25; i++) {
        const x = (i * 137 + 30) % canvas.width;

        const y = i % 2 === 0
            ? 55 + (i * 13) % Math.max(1, canvas.height / 3)
            : canvas.height - 55 - (i * 17) % Math.max(1, canvas.height / 3);

        ctx.fillStyle = "#10271F";
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawCrystal(x, y) {
    ctx.save();

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#B78AE0";

    ctx.fillStyle = "#B78AE0";
    ctx.beginPath();
    ctx.moveTo(x, y - 17);
    ctx.lineTo(x + 12, y);
    ctx.lineTo(x, y + 17);
    ctx.lineTo(x - 12, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#F3D78B";
    ctx.fillRect(x - 2, y - 10, 4, 20);

    ctx.restore();
}

function drawPlayer() {
    const x = Math.round(player.x);
    const y = Math.round(player.y);

    const moving =
        keys["w"] || keys["a"] || keys["s"] || keys["d"] ||
        keys["arrowup"] || keys["arrowdown"] ||
        keys["arrowleft"] || keys["arrowright"];

    const step = moving ? Math.floor(Date.now() / 180) % 2 : 0;

    ctx.save();

    // Magical glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#B78AE0";

    // Hair
    ctx.fillStyle = "#51301F";
    ctx.fillRect(x - 10, y - 13, 20, 8);
    ctx.fillRect(x - 13, y - 7, 4, 12);

    // Face
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#E9AE82";
    ctx.fillRect(x - 9, y - 7, 18, 12);

    // Purple outfit
    ctx.fillStyle = "#713DA5";
    ctx.fillRect(x - 12, y + 5, 24, 13);

    // Golden belt
    ctx.fillStyle = "#F3D78B";
    ctx.fillRect(x - 12, y + 9, 24, 3);

    // Arms
    ctx.fillStyle = "#E9AE82";
    ctx.fillRect(x - 16, y + 6, 4, 9);
    ctx.fillRect(x + 12, y + 6, 4, 9);

    // Eyes
    if (player.direction !== "up") {
        ctx.fillStyle = "#241638";

        if (player.direction === "left") {
            ctx.fillRect(x - 7, y - 3, 3, 3);
        } else if (player.direction === "right") {
            ctx.fillRect(x + 4, y - 3, 3, 3);
        } else {
            ctx.fillRect(x - 5, y - 3, 3, 3);
            ctx.fillRect(x + 3, y - 3, 3, 3);
        }
    }

    // Walking legs
    ctx.fillStyle = "#302047";

    if (step === 0) {
        ctx.fillRect(x - 9, y + 18, 7, 7);
        ctx.fillRect(x + 2, y + 18, 7, 7);
    } else {
        ctx.fillRect(x - 10, y + 18, 7, 7);
        ctx.fillRect(x + 4, y + 18, 7, 7);
    }

    // Golden shoes
    ctx.fillStyle = "#F3D78B";
    ctx.fillRect(x - 10, y + 23, 8, 3);
    ctx.fillRect(x + 3, y + 23, 8, 3);

    ctx.restore();
}

function movePlayer() {
    if (keys["arrowup"] || keys["w"]) {
        player.y -= player.speed;
        player.direction = "up";
    }

    if (keys["arrowdown"] || keys["s"]) {
        player.y += player.speed;
        player.direction = "down";
    }

    if (keys["arrowleft"] || keys["a"]) {
        player.x -= player.speed;
        player.direction = "left";
    }

    if (keys["arrowright"] || keys["d"]) {
        player.x += player.speed;
        player.direction = "right";
    }

    // Keep player inside the full-screen game world
    player.x = Math.max(
        22,
        Math.min(canvas.width - 22, player.x)
    );

    player.y = Math.max(
        28,
        Math.min(canvas.height - 28, player.y)
    );
}


function collectCrystals() {
    crystals.forEach(crystal => {
        if (crystal.collected) return;

        const dx = player.x - crystal.x;
        const dy = player.y - crystal.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30) {
            crystal.collected = true;
            score++;
            scoreText.textContent = score;
        }
    });
}

function gameLoop() {
    movePlayer();

    drawWorld();

    crystals.forEach(crystal => {
        if (!crystal.collected) {
            drawCrystal(crystal.x, crystal.y);
        }
    });

    collectCrystals();
    drawPlayer();

    if (score === crystals.length) {
        ctx.fillStyle = "#F3D78B";
        ctx.font = "bold 28px Georgia";
        ctx.textAlign = "center";
        ctx.fillText("ALL CRYSTALS FOUND!", 400, 50);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

