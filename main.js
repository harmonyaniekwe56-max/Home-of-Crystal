
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js";

// ==================================
// 1. BASIC GAME SETUP
// ==================================

const canvas = document.getElementById("gameCanvas");
const scoreText = document.getElementById("score");

const scene = new THREE.Scene();

scene.background = new THREE.Color("#182B32");
scene.fog = new THREE.Fog("#182B32", 25, 100);

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ==================================
// 2. MAGICAL LIGHTING
// ==================================

const ambientLight = new THREE.HemisphereLight(
    "#B8D9E8",
    "#243522",
    2
);

scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight("#E4D9FF", 3);

moonLight.position.set(-15, 25, 12);
moonLight.castShadow = true;

scene.add(moonLight);

// ==================================
// 3. FOREST GROUND
// ==================================

const groundGeometry = new THREE.PlaneGeometry(200, 200);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: "#31583D",
    roughness: 1
});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

// ==================================
// 4. STONE PATH
// ==================================

const pathMaterial = new THREE.MeshStandardMaterial({
    color: "#776C70",
    roughness: 1
});

for (let i = 0; i < 30; i++) {

    const stone = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.12, 1.8),
        pathMaterial
    );

    stone.position.set(
        Math.sin(i * 0.2) * 4,
        0.08,
        -i * 3
    );

    stone.rotation.y = Math.sin(i * 0.2) * 0.15;

    stone.receiveShadow = true;

    scene.add(stone);
}

// ==================================
// 5. CREATE MAGICAL TREES
// ==================================

function createTree(x, z, scale = 1) {

    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.3 * scale,
            0.5 * scale,
            3 * scale,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: "#60402D"
        })
    );

    trunk.position.y = 1.5 * scale;
    trunk.castShadow = true;

    tree.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(2 * scale, 8, 8),
        new THREE.MeshStandardMaterial({
            color: "#173F32",
            roughness: 1
        })
    );

    leaves.position.y = 4 * scale;
    leaves.castShadow = true;

    tree.add(leaves);

    tree.position.set(x, 0, z);

    scene.add(tree);
}

// Place trees around the forest

for (let i = 0; i < 90; i++) {

    const x = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;

    // Leave the middle path clear
    if (Math.abs(x) < 7) continue;

    createTree(
        x,
        z,
        0.7 + Math.random() * 0.8
    );
}

// ==================================
// 6. CREATE ROCKS
// ==================================

for (let i = 0; i < 35; i++) {

    const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(
            0.5 + Math.random() * 0.7
        ),
        new THREE.MeshStandardMaterial({
            color: "#777B7B",
            roughness: 1
        })
    );

    rock.position.set(
        (Math.random() - 0.5) * 80,
        0.35,
        (Math.random() - 0.5) * 80
    );

    rock.castShadow = true;
    rock.receiveShadow = true;

    scene.add(rock);
}

 // ==================================
 // 6B. MYSTERIOUS CAVES
 // ==================================

function createCave(x, z) {

    const cave = new THREE.Group();

    // Cave rock structure
    const rockMaterial = new THREE.MeshStandardMaterial({
        color: "#34383B",
        roughness: 1
    });

    const caveRock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(5, 1),
        rockMaterial
    );

    caveRock.scale.set(1.5, 1, 1);
    caveRock.position.y = 2.5;
    cave.add(caveRock);

    // Dark entrance
    const entrance = new THREE.Mesh(
        new THREE.CircleGeometry(2.2, 24),
        new THREE.MeshBasicMaterial({
            color: "#080B10",
            side: THREE.DoubleSide
        })
    );

    entrance.position.set(0, 1.5, 4.5);
    cave.add(entrance);

    // Purple light inside the cave
    const caveLight = new THREE.PointLight(
        "#9B55FF",
        4,
        15
    );

    caveLight.position.set(0, 2, 0);
    cave.add(caveLight);

    cave.position.set(x, 0, z);

    scene.add(cave);
}

// Place caves away from the main path
createCave(24, -38);
createCave(-35, -70);


function updateMonsters(time) {

    monsters.forEach(monster => {

        const angle = time * 0.35 + monster.phase;

        monster.model.position.x =
            monster.centerX + Math.cos(angle) * 4;

        monster.model.position.z =
            monster.centerZ + Math.sin(angle) * 4;

        // Gentle monster movement
        monster.model.position.y =
            Math.abs(Math.sin(time * 2 + monster.phase)) * 0.15;

        monster.model.rotation.y =
            -angle;
    });
}

// ==================================
// 7. CREATE THE BOY CHARACTER
// ==================================

const player = new THREE.Group();

const skinMaterial = new THREE.MeshStandardMaterial({
    color: "#C98F69"
});

const clothesMaterial = new THREE.MeshStandardMaterial({
    color: "#633D91"
});

const darkMaterial = new THREE.MeshStandardMaterial({
    color: "#30233F"
});

const goldMaterial = new THREE.MeshStandardMaterial({
    color: "#F3D78B",
    metalness: 0.4,
    roughness: 0.5
});

// Body

const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.45, 0.8, 4, 8),
    clothesMaterial
);

body.position.y = 1.35;
body.castShadow = true;

player.add(body);

// Head

const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 16, 16),
    skinMaterial
);

head.position.y = 2.25;
head.castShadow = true;

player.add(head);

// Hair

const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 12, 8),
    darkMaterial
);

hair.scale.set(1, 0.55, 1);
hair.position.y = 2.5;

player.add(hair);


// Animated legs
const legs = [];
const arms = [];

for (const side of [-1, 1]) {

    const legPivot = new THREE.Group();

    legPivot.position.set(side * 0.2, 0.72, 0);

    const leg = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.13, 0.45, 4, 8),
        darkMaterial
    );

    leg.position.y = -0.28;
    leg.castShadow = true;

    legPivot.add(leg);
    player.add(legPivot);

    legs.push(legPivot);
}

// Animated arms
for (const side of [-1, 1]) {

    const armPivot = new THREE.Group();

    armPivot.position.set(side * 0.48, 1.75, 0);

    const arm = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.12, 0.42, 4, 8),
        skinMaterial
    );

    arm.position.y = -0.27;
    arm.castShadow = true;

    armPivot.add(arm);
    player.add(armPivot);

    arms.push(armPivot);
}

// Golden belt

const belt = new THREE.Mesh(
    new THREE.TorusGeometry(0.43, 0.07, 8, 16),
    goldMaterial
);

belt.position.y = 1.1;
belt.rotation.x = Math.PI / 2;

player.add(belt);

// Add character to the world

player.position.set(0, 0, 5);

scene.add(player);


 // ==================================
 // 8. CREATE HIDDEN DIAMONDS
 // ==================================

const crystals = [];

// Five diamonds hidden away from the main path
const crystalPositions = [
    [-19, -17],
    [25, -29],
    [-32, -46],
    [31, -64],
    [-43, -79]
];

function createCrystal(x, z) {

    const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.8),
        new THREE.MeshStandardMaterial({
            color: "#B78AE0",
            emissive: "#8B35FF",
            emissiveIntensity: 2,
            metalness: 0.4,
            roughness: 0.2
        })
    );

    crystal.position.set(x, 1.3, z);

    crystal.castShadow = true;

    scene.add(crystal);

    crystals.push(crystal);
}

crystalPositions.forEach(position => {
    createCrystal(position[0], position[1]);
});

// ==================================
// 9. KEYBOARD CONTROLS
// ==================================

const keys = {};

window.addEventListener("keydown", event => {

    keys[event.key.toLowerCase()] = true;

    if (event.key.startsWith("Arrow")) {
        event.preventDefault();
    }
});

window.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
});


// ==================================
// 10. PLAYER MOVEMENT
// ==================================

let score = 0;
let isMoving = false;
let movementSpeed = 0.12;

function movePlayer() {

    let dx = 0;
    let dz = 0;

    if (keys["w"] || keys["arrowup"]) dz -= 1;
    if (keys["s"] || keys["arrowdown"]) dz += 1;
    if (keys["a"] || keys["arrowleft"]) dx -= 1;
    if (keys["d"] || keys["arrowright"]) dx += 1;

    isMoving = dx !== 0 || dz !== 0;

    // Hold SHIFT to run
    movementSpeed = keys["shift"] ? 0.20 : 0.12;

    if (isMoving) {

        const length = Math.sqrt(dx * dx + dz * dz);

        dx /= length;
        dz /= length;

        player.position.x += dx * movementSpeed;
        player.position.z += dz * movementSpeed;

        player.rotation.y = Math.atan2(dx, dz);
    }

    player.position.x = THREE.MathUtils.clamp(
        player.position.x, -85, 85
    );

    player.position.z = THREE.MathUtils.clamp(
        player.position.z, -85, 85
    );
}

function collectCrystals() {

    crystals.forEach((crystal, index) => {

        if (!crystal.visible) return;

        const distance = player.position.distanceTo(
            crystal.position
        );

        if (distance < 2) {

            crystal.visible = false;

            score++;

            scoreText.textContent = score;
        }
    });
}

// ==================================
// 12. CAMERA FOLLOWS PLAYER
// ==================================

function updateCamera() {

    const cameraOffset = new THREE.Vector3(
        0,
        7,
        11
    );

    const desiredPosition = player.position.clone().add(
        cameraOffset
    );

    camera.position.lerp(desiredPosition, 0.08);

    camera.lookAt(
        player.position.x,
        player.position.y + 1,
        player.position.z
    );
}

// ==================================
// 13. ANIMATION LOOP
// ==================================

const timer = new THREE.Timer();

function animate() {

    requestAnimationFrame(animate);

timer.update();
const time = timer.getElapsed();
    movePlayer();

    // Animate walking and running
    if (isMoving) {

        const speed = keys["shift"] ? 13 : 8;
        const swing = Math.sin(time * speed) * 0.55;

        legs[0].rotation.x = swing;
        legs[1].rotation.x = -swing;

        arms[0].rotation.x = -swing * 0.8;
        arms[1].rotation.x = swing * 0.8;

    } else {

        // Return limbs to normal when standing
        legs.forEach(leg => {
            leg.rotation.x = THREE.MathUtils.lerp(
                leg.rotation.x, 0, 0.15
            );
        });

        arms.forEach(arm => {
            arm.rotation.x = THREE.MathUtils.lerp(
                arm.rotation.x, 0, 0.15
            );
        });
    }

    // Diamonds gently float and rotate
    crystals.forEach((crystal, index) => {

        crystal.rotation.y += 0.015;

        crystal.position.y =
            1.1 + Math.sin(time * 1.5 + index) * 0.12;
    });

    collectCrystals();
    updateCamera();

    renderer.render(scene, camera);
}
