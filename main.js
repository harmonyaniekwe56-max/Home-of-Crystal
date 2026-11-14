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
// PATHWAYS CONNECTING THE FIVE REGIONS
function createPath(x1, z1, x2, z2) {
    const dx = x2 - x1;
    const dz = z2 - z1;

    const distance = Math.sqrt(dx * dx + dz * dz);

    const path = new THREE.Mesh(
        new THREE.BoxGeometry(14, 0.25, distance),
        new THREE.MeshStandardMaterial({
            color: 0x77716b,
            roughness: 0.9
        })
    );

    path.position.set(
        (x1 + x2) / 2,
        0.12,
        (z1 + z2) / 2
    );

    path.rotation.y = Math.atan2(dx, dz);
    path.receiveShadow = true;

    scene.add(path);
}

// Connect each region to the Forgotten Kingdom
createPath(-250, -250, 0, 0);
createPath(250, -250, 0, 0);
createPath(-250, 250, 0, 0);
createPath(250, 250, 0, 0);
// BUILDING MATERIALS
const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x68452d,
    roughness: 0.9
});

const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x302638,
    roughness: 0.9
});

const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 1
});

// CREATE ABANDONED HOUSES
function createHouse(x, z) {
    const house = new THREE.Group();

    // Walls
    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(13, 9, 11),
        woodMaterial
    );
    walls.position.y = 4.5;
    walls.castShadow = true;
    house.add(walls);

    // Roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(10, 7, 4),
        roofMaterial
    );
    roof.position.y = 12;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);

    // Door
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 5, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x29190f })
    );
    door.position.set(0, 2.5, 5.6);
    house.add(door);

    house.position.set(x, 0, z);
    scene.add(house);
}

// CREATE RUINED CASTLE
function createCastle(x, z) {
    const castle = new THREE.Group();

    const mainBuilding = new THREE.Mesh(
        new THREE.BoxGeometry(35, 24, 30),
        stoneMaterial
    );
    mainBuilding.position.y = 12;
    mainBuilding.castShadow = true;
    castle.add(mainBuilding);

    // Four castle towers
    for (const dx of [-17, 17]) {
        for (const dz of [-14, 14]) {
            const tower = new THREE.Mesh(
                new THREE.CylinderGeometry(5, 6, 32, 8),
                stoneMaterial
            );

            tower.position.set(dx, 16, dz);
            tower.castShadow = true;
            castle.add(tower);

            const top = new THREE.Mesh(
                new THREE.ConeGeometry(6, 9, 8),
                roofMaterial
            );

            top.position.set(dx, 36, dz);
            castle.add(top);
        }
    }

    castle.position.set(x, 0, z);
    scene.add(castle);
}

// PLACE THE BUILDINGS
createHouse(-120, -120);
createHouse(120, -120);
createHouse(-120, 120);
createHouse(120, 120);

createCastle(65, 55);
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
}
// ==========================================
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
// 7. CREATE THE BOY - WHITE AND PURPLE WARRIOR
// ==========================================

const player = new THREE.Group();

// Character materials
const boyMaterials = {
    skin: new THREE.MeshStandardMaterial({
        color: "#e8bd9e",
        roughness: 0.85
    }),
    hair: new THREE.MeshStandardMaterial({
        color: "#f4f3ff",
        roughness: 0.65
    }),
    coat: new THREE.MeshStandardMaterial({
        color: "#eeeaf8",
        roughness: 0.75
    }),
    purple: new THREE.MeshStandardMaterial({
        color: "#552b91",
        roughness: 0.55
    }),
    dark: new THREE.MeshStandardMaterial({
        color: "#242033",
        roughness: 0.8
    }),
    silver: new THREE.MeshStandardMaterial({
        color: "#dce5f2",
        metalness: 0.85,
        roughness: 0.2
    }),
    gold: new THREE.MeshStandardMaterial({
        color: "#d6ad54",
        metalness: 0.75,
        roughness: 0.3
    }),
    eye: new THREE.MeshStandardMaterial({
        color: "#30204e",
        roughness: 0.3
    })
};

function makePart(geometry, material, x, y, z) {
    const part = new THREE.Mesh(geometry, material);
    part.position.set(x, y, z);
    part.castShadow = true;
    part.receiveShadow = true;
    player.add(part);
    return part;
}

// NECK
makePart(
    new THREE.CylinderGeometry(0.13, 0.15, 0.28, 12),
    boyMaterials.skin,
    0, 2.43, 0
);

// BODY - WHITE COAT
makePart(
    new THREE.CapsuleGeometry(0.43, 0.85, 8, 16),
    boyMaterials.coat,
    0, 1.65, 0
);

// PURPLE INNER SHIRT
makePart(
    new THREE.BoxGeometry(0.34, 0.9, 0.12),
    boyMaterials.purple,
    0, 1.68, 0.37
);

// COAT FRONT DETAILS
for (const side of [-1, 1]) {
    makePart(
        new THREE.BoxGeometry(0.08, 0.9, 0.08),
        boyMaterials.silver,
        side * 0.29, 1.65, 0.34
    );

    // Coat tails
    const tail = makePart(
        new THREE.BoxGeometry(0.3, 0.85, 0.16),
        boyMaterials.coat,
        side * 0.24, 0.85, -0.04
    );
    tail.rotation.z = side * -0.08;
}

// PURPLE COLLAR
makePart(
    new THREE.BoxGeometry(0.25, 0.22, 0.18),
    boyMaterials.purple,
    0, 2.18, 0.29
);

// HEAD
makePart(
    new THREE.SphereGeometry(0.36, 32, 24),
    boyMaterials.skin,
    0, 2.72, 0
);

// EARS
for (const side of [-1, 1]) {
    makePart(
        new THREE.SphereGeometry(0.09, 12, 12),
        boyMaterials.skin,
        side * 0.35, 2.7, 0
    );
}

// WHITE HAIR
makePart(
    new THREE.SphereGeometry(0.39, 24, 20),
    boyMaterials.hair,
    0, 2.96, -0.04
);

// Hair at the sides
for (const side of [-1, 1]) {
    const hairSide = makePart(
        new THREE.SphereGeometry(0.16, 16, 12),
        boyMaterials.hair,
        side * 0.29, 2.78, 0.02
    );
    hairSide.scale.set(0.8, 1.4, 0.8);
}

// Hair fringe
for (let i = 0; i < 5; i++) {
    const fringe = makePart(
        new THREE.ConeGeometry(0.13, 0.38, 7),
        boyMaterials.hair,
        (i - 2) * 0.12,
        2.78 + (i % 2) * 0.08,
        0.29
    );
    fringe.rotation.x = -0.25;
    fringe.rotation.z = (i - 2) * 0.18;
}

// EYES
for (const side of [-1, 1]) {
    makePart(
        new THREE.SphereGeometry(0.045, 12, 12),
        boyMaterials.eye,
        side * 0.13, 2.73, 0.33
    );
}

// BELT
makePart(
    new THREE.TorusGeometry(0.42, 0.045, 8, 24),
    boyMaterials.gold,
    0, 1.22, 0
).rotation.x = Math.PI / 2;

// BELT BUCKLE
makePart(
    new THREE.BoxGeometry(0.17, 0.17, 0.08),
    boyMaterials.gold,
    0, 1.22, 0.43
);

// LEGS
const legPivots = [];

for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.2, 0.95, 0);

    const leg = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.16, 0.62, 8, 12),
        boyMaterials.dark
    );
    leg.position.y = -0.35;
    leg.castShadow = true;
    pivot.add(leg);

    // Boots
    const boot = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.24, 0.48),
        boyMaterials.dark
    );
    boot.position.set(0, -0.72, 0.1);
    boot.castShadow = true;
    pivot.add(boot);

    // Silver boot details
    const bootBand = new THREE.Mesh(
        new THREE.BoxGeometry(0.31, 0.07, 0.3),
        boyMaterials.silver
    );
    bootBand.position.set(0, -0.62, 0.1);
    pivot.add(bootBand);

    player.add(pivot);
    legPivots.push(pivot);
}

// ARMS
const armPivots = [];

for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.48, 2.05, 0);

    const sleeve = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.15, 0.53, 8, 12),
        boyMaterials.coat
    );
    sleeve.position.y = -0.34;
    sleeve.castShadow = true;
    pivot.add(sleeve);

    const cuff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.16, 12),
        boyMaterials.purple
    );
    cuff.position.y = -0.65;
    pivot.add(cuff);

    const hand = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 12),
        boyMaterials.skin
    );
    hand.position.y = -0.78;
    pivot.add(hand);

    player.add(pivot);
    armPivots.push(pivot);
}

// PURPLE SHOULDER DETAILS
for (const side of [-1, 1]) {
    const shoulder = makePart(
        new THREE.SphereGeometry(0.19, 16, 12),
        boyMaterials.purple,
        side * 0.48, 2.04, 0
    );
    shoulder.scale.set(1.1, 0.7, 0.9);
}

// ==========================================
// DETAILED SILVER AND PURPLE SWORD
// ==========================================

const sword = new THREE.Group();

// Silver blade
const blade = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 1.35, 0.055),
    boyMaterials.silver
);
blade.position.y = 0.88;
sword.add(blade);

// Purple line on blade
const bladeLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 1.1, 0.065),
    boyMaterials.purple
);
bladeLine.position.set(0, 0.9, 0.035);
sword.add(bladeLine);

// Blade tip
const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.25, 4),
    boyMaterials.silver
);
tip.position.y = 1.68;
sword.add(tip);

// Sword handle
const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.075, 0.48, 10),
    boyMaterials.dark
);
handle.position.y = 0.05;
sword.add(handle);

// Purple handle grip
const grip = new THREE.Mesh(
    new THREE.TorusGeometry(0.075, 0.025, 8, 12),
    boyMaterials.purple
);
grip.position.y = 0.05;
sword.add(grip);

// Crossguard
const guard = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.1, 0.14),
    boyMaterials.gold
);
guard.position.y = 0.32;
sword.add(guard);

// Purple gems on guard
const gem = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.12),
    boyMaterials.purple
);
gem.position.set(0, 0.32, 0.1);
sword.add(gem);

// Pommel
const pommel = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 12, 12),
    boyMaterials.gold
);
pommel.position.y = -0.23;
sword.add(pommel);

// Position sword beside the boy's right hand
sword.position.set(0.75, 1.15, 0.15);
sword.rotation.z = -0.12;
player.add(sword);

// FINAL POSITION
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
 // 9. ZOMBIE MONSTERS
 // ==========================================

const monsters = [];

function createMonster(region, index) {

    const monster = new THREE.Group();

    // Different clothes for each zombie
    const clothingColors = [
        "#65452f", // Brown
        "#8d2929", // Red
        "#244e83", // Blue
        "#542b78", // Purple
        "#455b37"  // Dark green
    ];

    const skinMaterial = new THREE.MeshStandardMaterial({
        color: "#778477",
        roughness: 1
    });

    const clothMaterial = new THREE.MeshStandardMaterial({
        color: clothingColors[index % clothingColors.length],
        roughness: 1
    });

    const darkMaterial = new THREE.MeshStandardMaterial({
        color: "#252525",
        roughness: 1
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
        color: "#292522",
        roughness: 1
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: "#bd35ff",
        emissive: "#8b00ff",
        emissiveIntensity: 3
    });

    const clawMaterial = new THREE.MeshStandardMaterial({
        color: "#35352f",
        roughness: 0.9
    });

    function addPart(geometry, material, x, y, z) {
        const part = new THREE.Mesh(geometry, material);
        part.position.set(x, y, z);
        part.castShadow = true;
        part.receiveShadow = true;
        monster.add(part);
        return part;
    }

    // BODY
    addPart(
        new THREE.CapsuleGeometry(0.48, 0.85, 8, 12),
        skinMaterial,
        0, 1.85, 0
    );

    // TORN SHIRT
    addPart(
        new THREE.BoxGeometry(0.95, 1.15, 0.55),
        clothMaterial,
        0, 1.95, 0.02
    );

    // Uneven torn shirt pieces
    for (let i = 0; i < 3; i++) {
        const tear = addPart(
            new THREE.BoxGeometry(0.16, 0.3, 0.57),
            darkMaterial,
            (i - 1) * 0.3,
            1.35 + (i % 2) * 0.12,
            0.02
        );
        tear.rotation.z = (i - 1) * 0.15;
    }

    // NECK
    addPart(
        new THREE.CylinderGeometry(0.14, 0.17, 0.3, 10),
        skinMaterial,
        0, 2.58, 0
    );

    // HEAD
    addPart(
        new THREE.SphereGeometry(0.43, 20, 16),
        skinMaterial,
        0, 3.05, 0
    );

    // MESSY HAIR
    addPart(
        new THREE.SphereGeometry(0.44, 16, 12),
        hairMaterial,
        0, 3.35, -0.08
    );

    for (let i = 0; i < 5; i++) {
        const strand = addPart(
            new THREE.ConeGeometry(0.12, 0.38, 6),
            hairMaterial,
            (i - 2) * 0.14,
            3.45,
            0.08
        );
        strand.rotation.z = (i - 2) * 0.3;
    }

    // GLOWING EYES
    for (const side of [-1, 1]) {
        addPart(
            new THREE.SphereGeometry(0.075, 12, 12),
            eyeMaterial,
            side * 0.16, 3.1, 0.38
        );
    }

    // MOUTH
    addPart(
        new THREE.BoxGeometry(0.3, 0.1, 0.06),
        darkMaterial,
        0, 2.83, 0.4
    );

    // ARMS WITH MOVABLE PIVOTS
    const armPivots = [];

    for (const side of [-1, 1]) {

        const pivot = new THREE.Group();
        pivot.position.set(side * 0.55, 2.4, 0);

        const arm = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.17, 0.75, 6, 10),
            skinMaterial
        );

        arm.position.y = -0.43;
        arm.rotation.z = side * -0.12;
        arm.castShadow = true;
        pivot.add(arm);

        // Torn sleeve
        const sleeve = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.17, 0.38, 8),
            clothMaterial
        );

        sleeve.position.y = -0.17;
        pivot.add(sleeve);

        // Zombie hand
        const hand = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 12, 10),
            skinMaterial
        );

        hand.position.y = -0.92;
        pivot.add(hand);

        // Three long claws
        for (let i = 0; i < 3; i++) {
            const claw = new THREE.Mesh(
                new THREE.ConeGeometry(0.045, 0.25, 6),
                clawMaterial
            );

            claw.position.set(
                (i - 1) * 0.11,
                -1.1,
                0.04
            );

            claw.rotation.x = Math.PI;
            pivot.add(claw);
        }

        monster.add(pivot);
        armPivots.push(pivot);
    }

    // LEGS WITH MOVABLE PIVOTS
    const legPivots = [];

    for (const side of [-1, 1]) {

        const pivot = new THREE.Group();
        pivot.position.set(side * 0.23, 1.05, 0);

        const leg = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 0.65, 6, 10),
            skinMaterial
        );

        leg.position.y = -0.38;
        leg.castShadow = true;
        pivot.add(leg);

        // Torn trousers
        const trousers = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.19, 0.42, 8),
            clothMaterial
        );

        trousers.position.y = -0.12;
        pivot.add(trousers);

        // Feet
        const foot = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.18, 0.42),
            darkMaterial
        );

        foot.position.set(0, -0.78, 0.08);
        pivot.add(foot);

        monster.add(pivot);
        legPivots.push(pivot);
    }

    // POSITION AND SIZE
    monster.position.set(region.x + 20, 0, region.z - 8);
    monster.scale.setScalar(1.15);

    monster.lookAt(player.position.x, 0, player.position.z);

    scene.add(monster);

    monsters.push({
        model: monster,
        region,
        health: 20,
        maxHealth: 20,
        attackCooldown: 0,
        alive: true,
        index,

        // New animation parts
        armPivots,
        legPivots,
        isAttacking: false,
        attackAnimation: 0
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

        const model = monster.model;

        let dx = player.position.x - model.position.x;
        let dz = player.position.z - model.position.z;

        let distance = Math.sqrt(dx * dx + dz * dz);

        monster.attackCooldown -= delta;

        // Walking animation timer
        monster.walkTime = (monster.walkTime || 0) + delta;

        // =================================
        // CHASE THE BOY
        // =================================

        const chasing = distance < 65 && distance > 3.8;

        if (chasing) {

            const speed = 8 * delta;

            model.position.x += (dx / distance) * speed;
            model.position.z += (dz / distance) * speed;

            model.rotation.y = Math.atan2(dx, dz);

            // Walking arms
            monster.armPivots.forEach((arm, i) => {
                arm.rotation.x =
                    Math.sin(monster.walkTime * 7 + i * Math.PI) * 0.45;
            });

            // Walking legs
            monster.legPivots.forEach((leg, i) => {
                leg.rotation.x =
                    Math.sin(monster.walkTime * 7 + i * Math.PI) * 0.55;
            });

        } else {

            // Return arms and legs to resting position
            monster.armPivots.forEach(arm => {
                if (!monster.isAttacking) {
                    arm.rotation.x = THREE.MathUtils.lerp(
                        arm.rotation.x, 0, 0.12
                    );
                }
            });

            monster.legPivots.forEach(leg => {
                leg.rotation.x = THREE.MathUtils.lerp(
                    leg.rotation.x, 0, 0.12
                );
            });
        }

        // Recalculate distance after movement
        dx = player.position.x - model.position.x;
        dz = player.position.z - model.position.z;
        distance = Math.sqrt(dx * dx + dz * dz);

        // =================================
        // START ZOMBIE ATTACK
        // =================================

        if (
            distance < 4.5 &&
            monster.attackCooldown <= 0 &&
            !monster.isAttacking
        ) {

            monster.isAttacking = true;
            monster.attackElapsed = 0;
            monster.attackHit = false;

            monster.attackCooldown = 1.1;
        }

        // =================================
        // ATTACK ANIMATION
        // =================================

        if (monster.isAttacking) {

            monster.attackElapsed += delta;

            const progress = Math.min(
                monster.attackElapsed / 0.65,
                1
            );

            // Both arms swing forward
            const swing = Math.sin(progress * Math.PI) * 1.6;

            monster.armPivots[0].rotation.x = -swing;
            monster.armPivots[1].rotation.x = -swing;

            // Slight body movement during attack
            model.rotation.x = -Math.sin(progress * Math.PI) * 0.12;

            // =================================
            // DAMAGE WHEN THE ATTACK CONNECTS
            // =================================

            if (
                monster.attackElapsed >= 0.24 &&
                !monster.attackHit
            ) {

                monster.attackHit = true;

                // Check that the boy is still close
                const hitDx = player.position.x - model.position.x;
                const hitDz = player.position.z - model.position.z;

                const hitDistance = Math.sqrt(
                    hitDx * hitDx + hitDz * hitDz
                );

                if (hitDistance < 4.8) {

                    // Damage the boy
                    playerHealth = Math.max(0, playerHealth - 8);

                    // Push the boy slightly backwards
                    if (hitDistance > 0.01) {
                        player.position.x +=
                            (hitDx / hitDistance) * 0.7;

                        player.position.z +=
                            (hitDz / hitDistance) * 0.7;
                    }

                    updateHealth();

                    showMessage("A ZOMBIE HIT YOU!");

                    if (playerHealth <= 0) {
                        finishGame(false);
                    }
                }
            }

            // Finish attack animation
            if (monster.attackElapsed >= 0.65) {

                monster.isAttacking = false;

                monster.armPivots.forEach(arm => {
                    arm.rotation.x = 0;
                });

                model.rotation.x = 0;
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

    // Camera stays behind the boy's facing direction
    const distanceBehind = 17;
    const height = 9;

    const direction = new THREE.Vector3(
        Math.sin(player.rotation.y),
        0,
        Math.cos(player.rotation.y)
    );

    const target = player.position.clone().sub(
        direction.multiplyScalar(distanceBehind)
    );

    target.y += height;

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
