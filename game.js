
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
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
    ctx.fillStyle = "#285B42";
    ctx.fillRect(0, 0, 800, 450);

    // Magical pathway
    ctx.fillStyle = "#542D78";
    ctx.fillRect(0, 195, 800, 65);

    // Decorative magical plants
    for (let i = 0; i < 35; i++) {
        const x = (i * 97) % 790;
        const y = (i * 61) % 440;

        ctx.fillStyle = "#80B879";
        ctx.fillRect(x, y, 5, 5);
    }

    // Trees
    for (let i = 0; i < 12; i++) {
        const x = (i * 137 + 30) % 780;
        const y = i % 2 === 0 ? 55 : 390;

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
    // Character body
    ctx.fillStyle = "#F3D78B";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    // Character face
    ctx.fillStyle = "#241638";
    ctx.beginPath();
    ctx.arc(player.x - 6, player.y - 3, 2, 0, Math.PI * 2);
    ctx.arc(player.x + 6, player.y - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Magical glow
    ctx.strokeStyle = "#B78AE0";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 23, 0, Math.PI * 2);
    ctx.stroke();
}

function movePlayer() {
    if (keys["arrowup"] || keys["w"]) {
        player.y -= player.speed;
    }

    if (keys["arrowdown"] || keys["s"]) {
        player.y += player.speed;
    }

    if (keys["arrowleft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["arrowright"] || keys["d"]) {
        player.x += player.speed;
    }

    player.x = Math.max(22, Math.min(778, player.x));
    player.y = Math.max(22, Math.min(428, player.y));
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

