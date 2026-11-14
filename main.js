import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js";

// ==========================================
// 1. BASIC GAME SETTINGS
// ==========================================

const canvas = document.getElementById("gameCanvas");

const scene = new THREE.Scene();

scene.background = new THREE.Color("#9bb0bd");
scene.fog = new THREE.Fog("#9bb0bd", 100, 650);

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1200
);

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ==========================================
// 2. LIGHTING
// ==========================================

scene.add(new THREE.HemisphereLight("#dceaff", "#39402d", 2));

const sunlight = new THREE.DirectionalLight("#fff0d5", 2.2);

sunlight.position.set(-120, 180, 100);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);

sunlight.shadow.camera.left = -300;
sunlight.shadow.camera.right = 300;
sunlight.shadow.camera.top = 300;
sunlight.shadow.camera.bottom = -300;

scene.add(sunlight);

// ==========================================
// 3. MATERIALS
// ==========================================

const materials = {
    grass: new THREE.MeshStandardMaterial({ color: "#456b43" }),
    snow: new THREE.MeshStandardMaterial({ color: "#dce9f0" }),
    mountain: new THREE.MeshStandardMaterial({ color: "#777c83" }),
    cave: new THREE.MeshStandardMaterial({ color: "#343044" }),
    kingdom: new THREE.MeshStandardMaterial({ color: "#5b4a65" }),
    stone: new THREE.MeshStandardMaterial({ color: "#77716c" }),
    bark: new THREE.MeshStandardMaterial({ color: "#493323" }),
    leaves: new THREE.MeshStandardMaterial({ color: "#234a32" }),
    iceLeaves: new THREE.MeshStandardMaterial({ color: "#a8d5e5" }),
    skin: new THREE.MeshStandardMaterial({ color: "#b97e5d" }),
    shirt: new THREE.MeshStandardMaterial({ color: "#493d70" }),
    trousers: new THREE.MeshStandardMaterial({ color: "#262d3c" }),
    boots: new THREE.MeshStandardMaterial({ color: "#30251f" }),
    hair: new THREE.MeshStandardMaterial({ color: "#211a19" }),
    gold: new THREE.MeshStandardMaterial({
        color: "#d8ad53",
        metalness: 0.7,
        roughness: 0.3
    })
};

// ==========================================
// 4. WORLD GROUND
// ==========================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    materials.grass
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.15;
ground.receiveShadow = true;

scene.add(ground);

// ==========================================
// 5. FIVE REGIONS
// ==========================================

const regions = [
    {
        name: "Whispering Forest",
        x: -250,
        z: -250,
        color: "#355f3b",
        puzzle: "I have branches but no hands. I grow without walking. What am I?",
        answer: "tree"
    },
    {
        name: "Frozen Kingdom",
        x: 250,
        z: -250,
        color: "#b9dce8",
        puzzle: "I fall from the sky, cover the earth, and melt in warmth. What am I?",
        answer: "snow"
    },
    {
        name: "Broken Mountains",
        x: -250,
        z: 250,
        color: "#777b83",
        puzzle: "I stand for ages, yet wind and water slowly change me. What am I?",
        answer: "stone"
    },
    {
        name: "Crystal Caverns",
        x: 250,
        z: 250,
        color: "#49345f",
        puzzle: "I travel through a cave, repeating what I hear, but I have no voice of my own. What am I?",
        answer: "echo"
    },
    {
        name: "Forgotten Kingdom",
        x: 0,
        z: 0,
        color: "#62506b",
        puzzle: "I hold yesterday, but cannot be touched. I can teach you without speaking. What am I?",
        answer: "memory"
    }
];

regions.forEach((region, index) => {

    const land = new THREE.Mesh(
        new THREE.CircleGeometry(85, 48),
        new THREE.MeshStandardMaterial({
            color: region.color,
            roughness: 0.95
        })
    );

    land.rotation.x = -Math.PI / 2;
    land.position.set(region.x, 0.02, region.z);
    land.receiveShadow = true;

    scene.add(land);

    // Stone entrance markers
    for (let i = 0; i < 12; i++) {

        const angle = (i / 12) * Math.PI * 2;

        const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(2.5 + Math.random() * 2),
            materials.stone
        );

        rock.position.set(
            region.x + Math.cos(angle) * 76,
            2,
            region.z + Math.sin(angle) * 76
        );

        rock.scale.y = 1.5;
        rock.castShadow = true;

        scene.add(rock);
    }
});

// ==========================================
// 6. TREES AND WORLD DECORATION
// ==========================================

function createTree(x, z, icy = false) {

    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 1.1, 8, 8),
        materials.bark
    );

    trunk.position.y = 4;
    trunk.castShadow = true;

    tree.add(trunk);

    for (let i = 0; i < 3; i++) {

        const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(5 - i, 9, 8),
            icy ? materials.iceLeaves : materials.leaves
        );

        leaves.position.y = 7 + i * 3.5;
        leaves.castShadow = true;

        tree.add(leaves);
    }

    tree.position.set(x, 0, z);
    scene.add(tree);
}

function createMountain(x, z, size) {

    const mountain = new THREE.Mesh(
        new THREE.ConeGeometry(size, size * 2, 7),
        materials.mountain
    );

    mountain.position.set(x, size, z);
    mountain.castShadow = true;
    mountain.receiveShadow = true;

    scene.add(mountain);
}

function createCaveRock(x, z) {

    const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(7),
        materials.cave
    );

    rock.position.set(x, 5, z);
    rock.scale.set(1.4, 1.1, 1);
    rock.castShadow = true;

    scene.add(rock);
}

// Forest trees
for (let i = 0; i < 35; i++) {
    createTree(
        -250 + (Math.random() - 0.5) * 150,
        -250 + (Math.random() - 0.5) * 150
    );
}

// Snow trees
for (let i = 0; i < 25; i++) {
    createTree(
        250 + (Math.random() - 0.5) * 150,
        -250 + (Math.random() - 0.5) * 150,
        true
    );
}

// Mountains
for (let i = 0; i < 20; i++) {
    createMountain(
        -250 + (Math.random() - 0.5) * 150,
        250 + (Math.random() - 0.5) * 150,
        10 + Math.random() * 15
    );
}

// Cave scenery
for (let i = 0; i < 22; i++) {
    createCaveRock(
        250 + (Math.random() - 0.5) * 150,
        250 + (Math.random() - 0.5) * 150
    );
}
// ==========================================
// FLOWERS AND FOREST DECORATION
// ==========================================

function createFlower(x, z) {

    const flower = new THREE.Group();

    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.08, 1, 6),
        new THREE.MeshStandardMaterial({ color: "#328443" })
    );

    stem.position.y = 0.5;
    flower.add(stem);

    const colors = ["#ffb5d5", "#fff0a6", "#bca0ff", "#ffffff"];

    const petalMaterial = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)]
    });

    for (let i = 0; i < 5; i++) {

        const angle = i * Math.PI * 2 / 5;

        const petal = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 8, 8),
            petalMaterial
        );

        petal.position.set(
            Math.cos(angle) * 0.22,
            1.05,
            Math.sin(angle) * 0.22
        );

        flower.add(petal);
    }

    const centre = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        materials.gold
    );

    centre.position.y = 1.05;
    flower.add(centre);

    flower.position.set(x, 0, z);
    scene.add(flower);
}

// Scatter flowers through the forest
for (let i = 0; i < 100; i++) {

    createFlower(
        -250 + (Math.random() - 0.5) * 140,
        -250 + (Math.random() - 0.5) * 140
    );
}// ==========================================
// DECORATIVE GLOWING CRYSTALS
// ==========================================

function createCrystalDecoration(x, z, size) {

    const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(size),
        new THREE.MeshStandardMaterial({
            color: "#bd80ff",
            emissive: "#812cff",
            emissiveIntensity: 2,
            metalness: 0.5,
            roughness: 0.2
        })
    );

    crystal.position.set(x, size, z);
    crystal.castShadow = true;

    scene.add(crystal);

    const light = new THREE.PointLight("#a65cff", 2, 18);
    light.position.set(x, size + 2, z);

    scene.add(light);
}

// Crystal Caverns decoration
for (let i = 0; i < 35; i++) {

    createCrystalDecoration(
        250 + (Math.random() - 0.5) * 130,
        250 + (Math.random() - 0.5) * 130,
        1.5 + Math.random() * 2
    );
}

// ==========================================
// 7. CREATE THE BOY
// ==========================================

const player = new THREE.Group();

function makePart(geometry, material, x, y, z) {

    const part = new THREE.Mesh(geometry, material);

    part.position.set(x, y, z);
    part.castShadow = true;
    part.receiveShadow = true;

    player.add(part);

    return part;
}

// Torso
makePart(
    new THREE.CapsuleGeometry(0.48, 0.85, 8, 16),
    materials.shirt,
    0, 1.55, 0
);

// Head
makePart(
    new THREE.SphereGeometry(0.38, 24, 24),
    materials.skin,
    0, 2.65, 0
);

// Hair
makePart(
    new THREE.SphereGeometry(0.4, 20, 16),
    materials.hair,
    0, 2.84, -0.03
);

// Hairline adjustment
makePart(
    new THREE.BoxGeometry(0.55, 0.12, 0.12),
    materials.hair,
    0, 2.65, 0.31
);

// Legs
const legPivots = [];

for (const side of [-1, 1]) {

    const pivot = new THREE.Group();

    pivot.position.set(side * 0.2, 0.95, 0);

    const leg = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.16, 0.6, 6, 12),
        materials.trousers
    );

    leg.position.y = -0.35;
    leg.castShadow = true;

    pivot.add(leg);

    const boot = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.2, 0.48),
        materials.boots
    );

    boot.position.set(0, -0.72, 0.1);
    boot.castShadow = true;

    pivot.add(boot);

    player.add(pivot);
    legPivots.push(pivot);
}

// Arms
const armPivots = [];

for (const side of [-1, 1]) {

    const pivot = new THREE.Group();

    pivot.position.set(side * 0.52, 2, 0);

    const arm = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.14, 0.55, 6, 12),
        materials.shirt
    );

    arm.position.y = -0.35;
    arm.castShadow = true;

    pivot.add(arm);

    player.add(pivot);
    armPivots.push(pivot);
}

// Belt
makePart(
    new THREE.TorusGeometry(0.46, 0.06, 8, 24),
    materials.gold,
    0, 1.2, 0
).rotation.x = Math.PI / 2;

// Sword
const sword = new THREE.Group();

const blade = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 1.4, 0.07),
    new THREE.MeshStandardMaterial({
        color: "#d9e2ec",
        metalness: 0.9,
        roughness: 0.2
    })
);

blade.position.y = 0.8;
sword.add(blade);

const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.5, 8),
    materials.bark
);

handle.position.y = 0.05;
sword.add(handle);

const guard = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.1, 0.12),
    materials.gold
);

guard.position.y = 0.25;
sword.add(guard);

sword.position.set(0.75, 1.5, 0.1);
player.add(sword);

player.position.set(-250, 0, -320);
scene.add(player);

// ==========================================
// 8. FIVE CHESTS
// ==========================================

const chests = [];

function createChest(region, index) {

    const chest = new THREE.Group();

    const wood = new THREE.MeshStandardMaterial({
        color: "#654126",
        roughness: 0.75
    });

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(5, 2.5, 3.5),
        wood
    );

    base.position.y = 1.3;
    base.castShadow = true;

    chest.add(base);

    const lid = new THREE.Mesh(
        new THREE.BoxGeometry(5, 1, 3.5),
        new THREE.MeshStandardMaterial({ color: "#86562f" })
    );

    lid.position.y = 3;
    lid.castShadow = true;

    chest.add(lid);

    const lock = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.8, 0.2),
        materials.gold
    );

    lock.position.set(0, 1.7, 1.85);
    chest.add(lock);

    chest.position.set(region.x, 0, region.z + 13);
    scene.add(chest);

    chests.push({
        model: chest,
        lid,
        region,
        index,
        opened: false
    });
}

regions.forEach((region, index) => createChest(region, index));

// ==========================================
// 9. MONSTERS
// ==========================================

const monsters = [];

function createMonster(region, index) {

    const monster = new THREE.Group();

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: index === 1 ? "#638ba2" : "#39463b",
        roughness: 0.8
    });

    const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(2.3, 3.8, 8, 16),
        bodyMaterial
    );

    body.position.y = 4;
    body.castShadow = true;

    monster.add(body);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(2, 20, 16),
        bodyMaterial
    );

    head.position.y = 7.5;
    head.castShadow = true;

    monster.add(head);

    // Glowing eyes
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: "#ff2020",
        emissive: "#ff0000",
        emissiveIntensity: 3
    });

    for (const side of [-1, 1]) {

        const eye = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 12, 12),
            eyeMaterial
        );

        eye.position.set(side * 0.8, 7.7, 1.65);
        monster.add(eye);
    }

    // Horns
    for (const side of [-1, 1]) {

        const horn = new THREE.Mesh(
            new THREE.ConeGeometry(0.55, 2.4, 8),
            materials.stone
        );

        horn.position.set(side * 1.25, 9.3, 0);
        horn.rotation.z = side * -0.3;
        horn.castShadow = true;

        monster.add(horn);
    }

    // Long arms
    for (const side of [-1, 1]) {

        const arm = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.65, 2.4, 6, 12),
            bodyMaterial
        );

        arm.position.set(side * 2.5, 3.6, 0);
        arm.rotation.z = side * -0.25;
        arm.castShadow = true;

        monster.add(arm);
    }

    // Legs
    for (const side of [-1, 1]) {

        const leg = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.75, 2, 6, 12),
            bodyMaterial
        );

        leg.position.set(side * 1, 0.9, 0);
        leg.castShadow = true;

        monster.add(leg);
    }

    monster.position.set(region.x + 20, 0, region.z - 8);
    monster.scale.setScalar(1.15);

    scene.add(monster);

    monsters.push({
        model: monster,
        region,
        health: 20,
        maxHealth: 20,
        attackCooldown: 0,
        alive: true,
        index
    });
}

regions.forEach((region, index) => createMonster(region, index));

// ==========================================
// 10. SONIC POWER
// ==========================================

let sonicCooldown = 0;

function useSonicPower() {

    if (sonicCooldown > 0 || gameOver) return;

    sonicCooldown = 4;

    const wave = new THREE.Mesh(
        new THREE.SphereGeometry(1, 24, 16),
        new THREE.MeshBasicMaterial({
            color: "#b67aff",
            wireframe: true,
            transparent: true,
            opacity: 0.9
        })
    );

    wave.position.copy(player.position);
    wave.position.y += 2;

    scene.add(wave);

    const startTime = performance.now();

    function expandWave() {

        if (gameOver) {
            scene.remove(wave);
            return;
        }

        const elapsed = (performance.now() - startTime) / 1000;

        wave.scale.setScalar(1 + elapsed * 13);
        wave.material.opacity = Math.max(0, 0.9 - elapsed);

        monsters.forEach(monster => {

            if (!monster.alive) return;

            const distance = player.position.distanceTo(
                monster.model.position
            );

            if (distance < 14 && !monster.sonicHit) {
                monster.health = Math.max(0, monster.health - 2);
                monster.sonicHit = true;
                updateBossDisplay();
                checkMonsterDefeat(monster);
            }
        });

        if (elapsed < 0.9) {
            requestAnimationFrame(expandWave);
        } else {
            monsters.forEach(monster => monster.sonicHit = false);
            scene.remove(wave);
        }
    }

    expandWave();
    showMessage("SONIC BLAST!");
}

// ==========================================
// 11. SWORD ATTACK
// ==========================================

let attackCooldown = 0;
let swordSwing = 0;

function swordAttack() {

    if (attackCooldown > 0 || gameOver) return;

    attackCooldown = 0.45;
    swordSwing = 0.3;

    let target = null;
    let nearest = 5;

    monsters.forEach(monster => {

        if (!monster.alive) return;

        const distance = player.position.distanceTo(
            monster.model.position
        );

        if (distance < nearest) {
            nearest = distance;
            target = monster;
        }
    });

    if (target) {

        target.health = Math.max(0, target.health - 1);

        showMessage("SWORD HIT! Guardian strength: " + target.health);

        updateBossDisplay();
        checkMonsterDefeat(target);
    }
}

// ==========================================
// 12. MONSTER DEFEAT
// ==========================================

function checkMonsterDefeat(monster) {

    if (monster.health <= 0 && monster.alive) {

        monster.alive = false;
        scene.remove(monster.model);

        showMessage(
            monster.region.name + " guardian defeated! Find its chest."
        );

        updateBossDisplay();
    }
}

// ==========================================
// 13. MONSTER ATTACKS
// ==========================================

function updateMonsters(delta) {

    monsters.forEach(monster => {

        if (!monster.alive || gameOver) return;

        const dx = player.position.x - monster.model.position.x;
        const dz = player.position.z - monster.model.position.z;

        const distance = Math.sqrt(dx * dx + dz * dz);

        // Chase player
        if (distance < 65 && distance > 4) {

            monster.model.position.x +=
                (dx / distance) * 8 * delta;

            monster.model.position.z +=
                (dz / distance) * 8 * delta;

            monster.model.rotation.y = Math.atan2(dx, dz);
        }

        // Attack player
        monster.attackCooldown -= delta;

        if (distance < 5 && monster.attackCooldown <= 0) {

            playerHealth -= 8;

            monster.attackCooldown = 1.1;

            updateHealth();

            showMessage("A GUARDIAN HIT YOU!");

            if (playerHealth <= 0) {
                finishGame(false);
            }
        }
    });
}

// ==========================================
// 14. CHEST PUZZLES
// ==========================================

let currentChest = null;

function openChestPuzzle(chest) {

    if (chest.opened) return;

    const guardian = monsters[chest.index];

    if (guardian.alive) {
        showMessage("Defeat the guardian before opening this chest!");
        return;
    }

    currentChest = chest;

    document.getElementById("puzzleQuestion").textContent =
        chest.region.puzzle;

    document.getElementById("puzzleAnswer").value = "";
    document.getElementById("puzzleFeedback").textContent = "";

    document.getElementById("puzzlePanel").style.display = "flex";
}

document.getElementById("submitAnswer").addEventListener("click", () => {

    if (!currentChest) return;

    const answer = document.getElementById("puzzleAnswer")
        .value.trim().toLowerCase();

    if (answer === currentChest.region.answer) {

        currentChest.opened = true;

        currentChest.lid.rotation.x = -1.2;
        currentChest.lid.position.y = 3.7;

        const crystal = new THREE.Mesh(
            new THREE.OctahedronGeometry(1.5),
            new THREE.MeshStandardMaterial({
                color: "#c68cff",
                emissive: "#9d35ff",
                emissiveIntensity: 3,
                metalness: 0.6,
                roughness: 0.2
            })
        );

        crystal.position.set(
            currentChest.region.x,
            4,
            currentChest.region.z + 13
        );

        scene.add(crystal);

        setTimeout(() => scene.remove(crystal), 1800);

        crystalsFound++;

        document.getElementById("crystalCount").textContent =
            "Crystals: " + crystalsFound + " / 5";

        document.getElementById("puzzlePanel").style.display = "none";

        showMessage("CRYSTAL FOUND!");

        if (crystalsFound === 5) {
            finishGame(true);
        }

        currentChest = null;

    } else {

        document.getElementById("puzzleFeedback").textContent =
            "Incorrect. Think carefully and try again.";
    }
});

document.getElementById("closePuzzle").addEventListener("click", () => {
    document.getElementById("puzzlePanel").style.display = "none";
    currentChest = null;
});

// ==========================================
// 15. PLAYER HEALTH
// ==========================================

let playerHealth = 100;
let crystalsFound = 0;
let gameOver = false;

function updateHealth() {

    document.getElementById("healthFill").style.width =
        Math.max(0, playerHealth) + "%";
}

function updateBossDisplay() {

    const nearby = monsters
        .filter(monster => monster.alive)
        .sort((a, b) =>
            player.position.distanceTo(a.model.position) -
            player.position.distanceTo(b.model.position)
        )[0];

    const name = document.getElementById("bossName");
    const fill = document.getElementById("bossFill");

    if (!nearby) {
        name.textContent = "No guardian nearby";
        fill.style.width = "0%";
        return;
    }

    const distance = player.position.distanceTo(nearby.model.position);

    if (distance > 70) {
        name.textContent = "No guardian nearby";
        fill.style.width = "0%";
        return;
    }

    name.textContent =
        nearby.region.name + " Guardian: " + nearby.health + " / 20";

    fill.style.width =
        (nearby.health / nearby.maxHealth * 100) + "%";
}

// ==========================================
// 16. GAME OVER AND VICTORY
// ==========================================

function finishGame(won) {

    if (gameOver) return;

    gameOver = true;

    document.getElementById("endTitle").textContent =
        won ? "THE CRYSTALS ARE RESTORED!" : "GAME OVER";

    document.getElementById("endText").textContent =
        won
            ? "You defeated all five guardians, solved the five riddles and recovered the ancient crystals. The Home of Crystal is safe again."
            : "The guardians have defeated you. Your adventure is not over. Try again and recover the five crystals.";

    document.getElementById("endScreen").style.display = "flex";
}

// ==========================================
// 17. KEYBOARD CONTROLS
// ==========================================

const keys = {};

window.addEventListener("keydown", event => {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (event.code === "Space") {
        event.preventDefault();
        swordAttack();
    }

    if (key === "q") {
        useSonicPower();
    }

    if (key === "e") {
        interactWithChest();
    }
});

window.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
});

// ==========================================
// 18. CHEST INTERACTION
// ==========================================

function interactWithChest() {

    if (gameOver || currentChest) return;

    chests.forEach(chest => {

        if (chest.opened) return;

        const distance = player.position.distanceTo(
            chest.model.position
        );

        if (distance < 9) {
            openChestPuzzle(chest);
        }
    });
}

// ==========================================
// 19. PLAYER MOVEMENT
// ==========================================

let isMoving = false;

function movePlayer(delta) {

    let dx = 0;
    let dz = 0;

    if (keys["w"] || keys["arrowup"]) dz -= 1;
    if (keys["s"] || keys["arrowdown"]) dz += 1;
    if (keys["a"] || keys["arrowleft"]) dx -= 1;
    if (keys["d"] || keys["arrowright"]) dx += 1;

    isMoving = dx !== 0 || dz !== 0;

    if (isMoving) {

        const length = Math.sqrt(dx * dx + dz * dz);

        dx /= length;
        dz /= length;

        const speed = keys["shift"] ? 28 : 17;

        player.position.x += dx * speed * delta;
        player.position.z += dz * speed * delta;

        player.rotation.y = Math.atan2(dx, dz);
    }

    player.position.x = THREE.MathUtils.clamp(
        player.position.x, -490, 490
    );

    player.position.z = THREE.MathUtils.clamp(
        player.position.z, -490, 490
    );
}

// ==========================================
// 20. REGION DISPLAY
// ==========================================

function updateRegionDisplay() {

    let closest = "The Great Wilderness";
    let nearestDistance = Infinity;

    regions.forEach(region => {

        const dx = player.position.x - region.x;
        const dz = player.position.z - region.z;

        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < nearestDistance) {
            nearestDistance = distance;
            closest = region.name;
        }
    });

    document.getElementById("regionName").textContent = closest;
}

// ==========================================
// 21. CAMERA
// ==========================================

function updateCamera() {

    const offset = new THREE.Vector3(0, 9, 17);

    const target = player.position.clone().add(offset);

    camera.position.lerp(target, 0.08);

    camera.lookAt(
        player.position.x,
        player.position.y + 2,
        player.position.z
    );
}

// ==========================================
// 22. MESSAGES
// ==========================================

let messageTimer = 0;

function showMessage(text) {

    const message = document.getElementById("message");

    message.textContent = text;
    message.style.display = "block";

    messageTimer = 2.5;
}

// ==========================================
// 23. ANIMATION
// ==========================================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    if (!gameOver) {

        movePlayer(delta);

        if (isMoving) {

            const swing = Math.sin(performance.now() * 0.012) * 0.6;

            legPivots[0].rotation.x = swing;
            legPivots[1].rotation.x = -swing;

            armPivots[0].rotation.x = -swing;
            armPivots[1].rotation.x = swing;
        } else {

            legPivots.forEach(leg => leg.rotation.x *= 0.8);
            armPivots.forEach(arm => arm.rotation.x *= 0.8);
        }

        if (swordSwing > 0) {
            sword.rotation.z = -0.9;
            swordSwing -= delta;
        } else {
            sword.rotation.z = 0;
        }

        attackCooldown = Math.max(0, attackCooldown - delta);
        sonicCooldown = Math.max(0, sonicCooldown - delta);

        updateMonsters(delta);
        updateCamera();
        updateRegionDisplay();
        updateBossDisplay();

        messageTimer -= delta;

        if (messageTimer <= 0) {
            document.getElementById("message").style.display = "none";
        }
    }

    renderer.render(scene, camera);
}

// ==========================================
// 24. SCREEN RESIZING
// ==========================================

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// ==========================================
// 25. START THE GAME
// ==========================================

updateHealth();
updateBossDisplay();
animate();
