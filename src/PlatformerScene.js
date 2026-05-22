class PlatformerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlatformerScene' });
    }

    create() {
        const W = this.scale.width;   // 480
        const H = this.scale.height;  // 800
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // === ENDLESS WORLD SETUP ===
        // Allow walking far in both directions
        this.physics.world.setBounds(-1000000, 0, 2000000, 600);

        this.bgWidth = 5760;
        this.chunkSize = 2000;
        this.spawnedChunks = new Set();
        this.chunkData = new Map();
        this.bgSegments = [];
        this.lastBgIndex = -1;
        this.firstBgIndex = 0;   // track lowest bg index for leftward spawning
        this.lastPondTypes = [];
        this.pondPositions = [];

        // Spawn initial background segment (unflipped)
        this.spawnBgSegment(0);

        // === FOREGROUND: initial chunks ===
        this.platforms = this.physics.add.staticGroup();
        this.fishes = this.physics.add.group();
        this.toys = this.physics.add.group();
        this.spawnChunk(-1); // trees to the left of spawn
        this.spawnChunk(0);
        this.spawnChunk(1);

        // Cat player
        this.player = this.physics.add.sprite(100, 500, 'cat_idle');
        this.player.setDepth(50); // Mitten always on top of scenery
        this.player.setScale(1);
        this.player.body.setSize(32, 40);
        this.player.body.setOffset(16, 12);
        this.player.setBounce(0.1);
        this.physics.add.collider(this.player, this.platforms);

        this.playerRunTexture = false;

        // === FLOATING CLOUDS ===
        this.clouds = [];
        this.cloudKeys = ['cloud1', 'cloud2', 'cloud3'];
        this.targetCloudCount = 90;
        for (let i = 0; i < this.targetCloudCount; i++) {
            this.spawnCloud(this.player.x + (Math.random() - 0.5) * 24000, 60 + Math.random() * 280);
        }

        // Camera follow — wide horizontal bounds for left/right, full height to prevent black space
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(-1000000, 0, 2000000, 800);

        // Collectibles
        this.physics.add.overlap(this.player, this.fishes, (p, f) => this.collectFish(p, f));
        this.physics.add.overlap(this.player, this.toys, (p, t) => this.collectToy(p, t));

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createVirtualJoystick();

        // === UI ===
        this.createRoundButton(W - 55, H - 55, () => {
            this.scene.start('HomeScene');
        });

        this.fishText = this.add.text(W / 2 - 35, H * 0.82, '\ud83d\udc1f: 0', {
            fontSize: '15px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);

        this.toyText = this.add.text(W / 2 + 35, H * 0.82, '\ud83e\uddf6: 0', {
            fontSize: '15px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);

        if (isMobile) {
            this.hintText = this.add.text(W / 2, 70, '\ud83c\udfae Drag round controller to move & jump!', {
                fontSize: '13px',
                color: '#ffffff',
                fontFamily: 'Poppins',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5).setScrollFactor(0);

            this.time.delayedCall(4000, () => {
                this.tweens.add({ targets: this.hintText, alpha: 0, duration: 1000 });
            });
        }

        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '10px',
            color: '#887799',
            fontFamily: 'Poppins'
        }).setOrigin(0.5).setScrollFactor(0);

        this.physics.add.collider(this.fishes, this.platforms);
        this.physics.add.collider(this.toys, this.platforms);
    }

    // === BACKGROUND SEGMENTS (unflipped -> flipped -> unflipped...) ===
    spawnBgSegment(index) {
        if (this.bgSegments.some(s => s.index === index)) return;
        const x = index * this.bgWidth;
        const flipped = (index % 2) !== 0;
        const bg = this.add.image(x, this.scale.height / 2, 'adventure_bg')
            .setOrigin(0, 0.5)
            .setDisplaySize(this.bgWidth, 800)
            .setDepth(-20)
            .setScrollFactor(1);
        if (flipped) bg.setFlipX(true);

        // Background trees: distant forest silhouettes
        const bgTrees = [];
        const treeKeys = ['tree1', 'tree2', 'tree3'];
        let seed = index * 12345 + 42;
        const rand = () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };
        const treeCount = 12 + Math.floor(rand() * 10); // 12-22 per bg segment
        for (let i = 0; i < treeCount; i++) {
            const tx = x + rand() * this.bgWidth;
            const key = treeKeys[Math.floor(rand() * 3)];
            const scale = 0.3 + rand() * 0.3; // smaller, distant
            const y = 500 + rand() * 60; // sitting on the hills
            const tree = this.add.image(tx, y, key)
                .setOrigin(0.5, 1)
                .setScale(scale)
                .setDepth(-10)
                .setScrollFactor(1)
                .setTint(0x557755); // dark silhouette
            bgTrees.push(tree);
        }

        this.bgSegments.push({ image: bg, index: index, trees: bgTrees });
        this.lastBgIndex = Math.max(this.lastBgIndex, index);
        this.firstBgIndex = Math.min(this.firstBgIndex, index);
    }

    removeBgSegment(index) {
        const idx = this.bgSegments.findIndex(s => s.index === index);
        if (idx >= 0) {
            this.bgSegments[idx].image.destroy();
            this.bgSegments[idx].trees.forEach(t => t.destroy());
            this.bgSegments.splice(idx, 1);
        }
    }

    // === WORLD CHUNKS (ground + decors + collectibles) ===
    spawnChunk(chunkIndex) {
        if (this.spawnedChunks.has(chunkIndex)) return;
        this.spawnedChunks.add(chunkIndex);

        const startX = chunkIndex * this.chunkSize;
        const objects = { ground: [], decors: [], fish: [], toys: [] };

        // Seeded random for deterministic decoration — offset negative chunks so seed stays positive
        let seed = chunkIndex * 16807 + 12345 + (chunkIndex < 0 ? 2147483647 : 0);
        const rand = () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };

        // Ground tiles
        for (let x = startX; x < startX + this.chunkSize; x += 32) {
            const tile = this.platforms.create(x, 592, 'ground').setScale(1).setDepth(1).refreshBody();
            objects.ground.push(tile);
        }

        // === DECORATIVE PLACEMENT TRACKERS ===
        // Trees and ponds can be close/overlap, but tree can't be at pond center
        const placedTrees = [];
        const placedPonds = [];
        const placedDecors = []; // for flowers, bushes, rocks to avoid everything

        const treeKeys = ['tree1', 'tree2', 'tree3'];

        const tryPlaceTree = (tx) => {
            // Trees must not overlap other trees
            for (const x of placedTrees) {
                if (Math.abs(tx - x) < 70) return false;
            }
            // Tree cannot be at the exact center of a pond
            for (const p of placedPonds) {
                if (Math.abs(tx - p.x) < 25) return false;
            }
            placedTrees.push(tx);
            placedDecors.push({ x: tx, radius: 40 });
            const key = treeKeys[Math.floor(rand() * 3)];
            const tree = this.add.image(tx, 560, key)
                .setOrigin(0.5, 1).setScale(2.5).setDepth(15).setScrollFactor(1);
            objects.decors.push(tree);
            return true;
        };

        const tryPlaceDecor = (x, radius) => {
            for (const d of placedDecors) {
                if (Math.abs(x - d.x) < (radius + d.radius)) return false;
            }
            placedDecors.push({ x, radius });
            return true;
        };

        // Starter trees for chunk 0 — more trees since they can coexist with ponds
        if (chunkIndex === 0) {
            const starters = [20, 200, 400, 600, 800];
            for (const sx of starters) {
                tryPlaceTree(sx);
            }
        }

        // Random trees in slots (more trees + ponds now!)
        const treeCount = chunkIndex === 0 ? 7 + Math.floor(rand() * 4) : 10 + Math.floor(rand() * 5);
        const slotWidth = (this.chunkSize - 60) / treeCount;
        for (let i = 0; i < treeCount; i++) {
            const slotStart = startX + 30 + i * slotWidth;
            let placed = false;
            for (let attempt = 0; attempt < 5; attempt++) {
                const tx = slotStart + rand() * (slotWidth - 40);
                if (tryPlaceTree(tx)) {
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                const tx = slotStart + slotWidth / 2;
                tryPlaceTree(tx);
            }
        }

        // === PONDS: evenly spaced with slot-based placement + global tracker ===
        const pondTypes = ['pond1', 'pond2', 'pond3', 'pond4'];
        const pondCount = chunkIndex === 0 ? 4 + Math.floor(rand() * 2) : 5 + Math.floor(rand() * 2); // 4-5 chunk0, 5-6 others
        const pondMinSpacing = 220; // minimum pixels between pond centers
        const pondSlotWidth = (this.chunkSize - 200) / pondCount;

        for (let i = 0; i < pondCount; i++) {
            const slotStart = startX + 100 + i * pondSlotWidth;
            let placed = false;
            for (let attempt = 0; attempt < 8; attempt++) {
                const px = slotStart + rand() * pondSlotWidth;
                // Check against ALL ponds in this chunk
                let tooClose = false;
                for (const p of placedPonds) {
                    if (Math.abs(px - p.x) < pondMinSpacing) { tooClose = true; break; }
                }
                if (tooClose) continue;
                // Check against ponds in OTHER chunks (scene-level tracker)
                for (const globalX of this.pondPositions) {
                    if (Math.abs(px - globalX) < pondMinSpacing) { tooClose = true; break; }
                }
                if (tooClose) continue;
                // Check not too close to tree centers
                let onTree = false;
                for (const tx of placedTrees) {
                    if (Math.abs(px - tx) < 30) { onTree = true; break; }
                }
                if (onTree) continue;

                // Success! Place the pond
                placedPonds.push({ x: px });
                placedDecors.push({ x: px, radius: 50 });
                this.pondPositions.push(px);

                // Anti-repeat: don't use the last 2 pond types
                const recent = this.lastPondTypes.slice(-2);
                let available = pondTypes.filter(t => !recent.includes(t));
                if (available.length === 0) available = pondTypes;
                const pondType = available[Math.floor(rand() * available.length)];
                this.lastPondTypes.push(pondType);

                const pond = this.add.image(px, 558, pondType)
                    .setOrigin(0.5, 0).setScale(2.5).setDepth(15).setScrollFactor(1);
                objects.decors.push(pond);
                placed = true;
                break;
            }
        }

        // === FLOWERS: 4-8 per chunk ===
        const flowerCount = 4 + Math.floor(rand() * 5); // 4-8 flowers
        for (let i = 0; i < flowerCount; i++) {
            let placed = false;
            for (let attempt = 0; attempt < 10; attempt++) {
                const fx = startX + 50 + Math.floor(rand() * (this.chunkSize - 100));
                if (tryPlaceDecor(fx, 20)) { // flower radius ~20
                    const fy = 558 + rand() * 10;
                    const tint = [0xffffff, 0xffaabb, 0xffdd88, 0xff88aa][Math.floor(rand() * 4)];
                    const flower = this.add.image(fx, fy, 'flower')
                        .setOrigin(0.5, 1).setScale(0.6 + rand() * 0.3).setDepth(16)
                        .setScrollFactor(1).setTint(tint);
                    objects.decors.push(flower);
                    placed = true;
                    break;
                }
            }
        }

        // === BUSHES: 3-5 per chunk ===
        const bushCount = 3 + Math.floor(rand() * 3); // 3-5 bushes
        for (let i = 0; i < bushCount; i++) {
            let placed = false;
            for (let attempt = 0; attempt < 10; attempt++) {
                const bx = startX + 100 + Math.floor(rand() * (this.chunkSize - 200));
                if (tryPlaceDecor(bx, 30)) { // bush radius ~30
                    const bush = this.add.image(bx, 560, 'bush')
                        .setOrigin(0.5, 1).setScale(0.5).setDepth(15).setScrollFactor(1);
                    objects.decors.push(bush);
                    placed = true;
                    break;
                }
            }
        }

        // === ROCKS: 1-3 per chunk ===
        const rockCount = 1 + Math.floor(rand() * 3);
        for (let i = 0; i < rockCount; i++) {
            let placed = false;
            for (let attempt = 0; attempt < 10; attempt++) {
                const rx = startX + 150 + Math.floor(rand() * (this.chunkSize - 300));
                if (tryPlaceDecor(rx, 25)) { // rock radius ~25
                    const rock = this.add.image(rx, 560, 'rock')
                        .setOrigin(0.5, 1).setScale(0.5).setDepth(15).setScrollFactor(1);
                    objects.decors.push(rock);
                    placed = true;
                    break;
                }
            }
        }

        // Fish: 1-2 per chunk
        const fishCount = 1 + Math.floor(rand() * 2);
        for (let i = 0; i < fishCount; i++) {
            const fx = startX + 300 + Math.floor(rand() * (this.chunkSize - 600));
            const fy = 250 + Math.floor(rand() * 200);
            const fish = this.fishes.create(fx, fy, 'fish');
            this.tweens.add({
                targets: fish, y: fy - 5,
                duration: 800 + rand() * 400,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
            objects.fish.push(fish);
        }

        // Toys: ~70% chance per chunk
        if (rand() > 0.3) {
            const tx = startX + 300 + Math.floor(rand() * (this.chunkSize - 600));
            const ty = 300 + Math.floor(rand() * 150);
            const toy = this.toys.create(tx, ty, 'yarn');
            this.tweens.add({
                targets: toy, y: ty - 6, angle: 10,
                duration: 1000 + rand() * 500,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
            objects.toys.push(toy);
        }

        this.chunkData.set(chunkIndex, objects);
    }

    removeChunk(chunkIndex) {
        if (!this.chunkData.has(chunkIndex)) return;
        const objects = this.chunkData.get(chunkIndex);
        objects.ground.forEach(tile => tile.destroy());
        objects.decors.forEach(d => d.destroy());
        objects.fish.forEach(f => f.destroy());
        objects.toys.forEach(t => t.destroy());
        this.chunkData.delete(chunkIndex);
        this.spawnedChunks.delete(chunkIndex);
    }

    spawnCloud(x, y) {
        const key = this.cloudKeys[Math.floor(Math.random() * this.cloudKeys.length)];
        const scale = 0.5 + Math.random() * 0.9;
        const speed = (8 + Math.random() * 18) * (Math.random() > 0.5 ? 1 : -1);
        const sprite = this.add.image(x, y, key)
            .setOrigin(0.5, 0.5)
            .setScale(scale)
            .setDepth(-15)
            .setScrollFactor(1)
            .setAlpha(0.25 + Math.random() * 0.35);
        this.clouds.push({ sprite, speed });
    }

    createVirtualJoystick() {
        const W = this.scale.width;
        const H = this.scale.height;
        const maxDrag = 55;
        const baseRadius = 70;
        const nubRadius = 26;

        this.joyActive = false;
        this.joyBaseX = 0;
        this.joyBaseY = 0;
        this.joyX = 0;
        this.joyY = 0;
        this.joyJumpTriggered = false;

        this.joyBase = this.add.circle(0, 0, baseRadius, 0x444466, 0.22)
            .setStrokeStyle(3, 0xffffff, 0.35)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(100);

        this.joyArrows = this.add.text(0, 0, '\u25c0  \u25b6\n\u25b2', {
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(100).setAlpha(0.35);

        this.joyNub = this.add.circle(0, 0, nubRadius, 0x7777dd, 0.55)
            .setStrokeStyle(2, 0xffffff, 0.5)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(101);

        this.joyNubGlow = this.add.circle(0, 0, nubRadius * 0.55, 0xaaaaff, 0.35)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(101);

        const joyZoneTop = H * 0.45;
        this.input.on('pointerdown', (pointer) => {
            if (pointer.y > joyZoneTop && !this.joyActive) {
                this.joyActive = true;
                this.joyBaseX = pointer.x;
                this.joyBaseY = pointer.y;
                this.joyX = 0;
                this.joyY = 0;

                this.joyBase.setPosition(this.joyBaseX, this.joyBaseY);
                this.joyArrows.setPosition(this.joyBaseX, this.joyBaseY);
                this.joyNub.setPosition(this.joyBaseX, this.joyBaseY);
                this.joyNubGlow.setPosition(this.joyBaseX - 3, this.joyBaseY - 3);

                this.joyBase.setVisible(true);
                this.joyArrows.setVisible(true);
                this.joyNub.setVisible(true);
                this.joyNubGlow.setVisible(true);

                this.joyBase.setScale(0.4);
                this.joyNub.setScale(0.4);
                this.joyArrows.setScale(0.4);
                this.tweens.add({
                    targets: [this.joyBase, this.joyNub, this.joyArrows],
                    scaleX: 1,
                    scaleY: 1,
                    duration: 180,
                    ease: 'Back.easeOut'
                });
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (this.joyActive && pointer.isDown) {
                const dx = pointer.x - this.joyBaseX;
                const dy = pointer.y - this.joyBaseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let nubX, nubY;
                if (dist > maxDrag) {
                    const angle = Math.atan2(dy, dx);
                    nubX = this.joyBaseX + Math.cos(angle) * maxDrag;
                    nubY = this.joyBaseY + Math.sin(angle) * maxDrag;
                } else {
                    nubX = pointer.x;
                    nubY = pointer.y;
                }

                this.joyNub.setPosition(nubX, nubY);
                this.joyNubGlow.setPosition(nubX - 3, nubY - 3);

                this.joyX = Phaser.Math.Clamp(dx / maxDrag, -1, 1);
                this.joyY = Phaser.Math.Clamp(dy / maxDrag, -1, 1);
            }
        });

        this.input.on('pointerup', () => {
            if (this.joyActive) {
                this.joyActive = false;
                this.joyX = 0;
                this.joyY = 0;
                this.joyJumpTriggered = false;

                this.tweens.add({
                    targets: [this.joyBase, this.joyNub, this.joyArrows, this.joyNubGlow],
                    scaleX: 0.3,
                    scaleY: 0.3,
                    alpha: 0,
                    duration: 150,
                    onComplete: () => {
                        this.joyBase.setVisible(false).setAlpha(1).setScale(1);
                        this.joyNub.setVisible(false).setAlpha(1).setScale(1);
                        this.joyArrows.setVisible(false).setAlpha(1).setScale(1);
                        this.joyNubGlow.setVisible(false).setAlpha(1).setScale(1);
                    }
                });
            }
        });
    }

    update() {
        const stats = this.registry.get('stats');

        // Update inventory display
        const inv = this.registry.get('inventory');
        this.fishText.setText(`\ud83d\udc1f: ${inv.fish}`);
        this.toyText.setText(`\ud83e\uddf6: ${inv.toys}`);

        // Movement
        let left = this.cursors.left.isDown;
        let right = this.cursors.right.isDown;
        let jump = this.cursors.up.isDown;

        if (this.joyActive) {
            if (Math.abs(this.joyX) > 0.15) {
                if (this.joyX < 0) left = true;
                else right = true;
            }
            if (this.joyY < -0.4 && !this.joyJumpTriggered) {
                jump = true;
                this.joyJumpTriggered = true;
            }
            if (this.joyY > -0.2) {
                this.joyJumpTriggered = false;
            }
        }

        let velocityX = 0;
        if (left) {
            velocityX = this.joyActive ? -130 * Math.abs(this.joyX) : -130;
            this.player.setFlipX(false);
        } else if (right) {
            velocityX = this.joyActive ? 130 * Math.abs(this.joyX) : 130;
            this.player.setFlipX(true);
        }
        this.player.setVelocityX(velocityX);

        // Switch texture based on movement
        const isMoving = Math.abs(velocityX) > 10;
        if (isMoving && !this.playerRunTexture) {
            this.player.setTexture('cat_run');
            this.playerRunTexture = true;
        } else if (!isMoving && this.playerRunTexture) {
            this.player.setTexture('cat_idle');
            this.playerRunTexture = false;
        }

        if (jump && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
            if (this.joyActive) {
                this.tweens.add({
                    targets: this.joyNub,
                    scaleX: 1.35,
                    scaleY: 1.35,
                    duration: 100,
                    yoyo: true
                });
            }
        }

        if (Math.abs(this.player.body.velocity.x) > 10) {
            stats.energy = Math.max(0, stats.energy - 0.02);
            this.registry.set('stats', stats);
        }

        // === FLOATING CLOUDS ===
        const px = this.player.x;
        const dt = this.game.loop.delta / 1000;
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            const c = this.clouds[i];
            c.sprite.x += c.speed * dt;
            if (Math.abs(c.sprite.x - px) > 12000) {
                c.sprite.destroy();
                this.clouds.splice(i, 1);
            }
        }

        // Evenly-spawn logic: fill the largest gap instead of clustering
        while (this.clouds.length < this.targetCloudCount) {
            let minCloudX = Infinity, maxCloudX = -Infinity;
            for (const c of this.clouds) {
                if (c.sprite.x < minCloudX) minCloudX = c.sprite.x;
                if (c.sprite.x > maxCloudX) maxCloudX = c.sprite.x;
            }

            if (this.clouds.length === 0) {
                // No clouds at all — spawn around player
                this.spawnCloud(px + (Math.random() - 0.5) * 2000, 60 + Math.random() * 280);
                continue;
            }

            // Sort by x to find gaps
            const sorted = [...this.clouds].sort((a, b) => a.sprite.x - b.sprite.x);

            // Find the biggest gap between consecutive clouds
            let biggestGap = 0;
            let gapCenter = px;
            for (let i = 0; i < sorted.length - 1; i++) {
                const gap = sorted[i + 1].sprite.x - sorted[i].sprite.x;
                if (gap > biggestGap) {
                    biggestGap = gap;
                    gapCenter = sorted[i].sprite.x + gap / 2;
                }
            }

            // Also consider gaps beyond the extremes (extend outward)
            const leftGap = minCloudX - (px - 12000);
            const rightGap = (px + 12000) - maxCloudX;
            if (leftGap > biggestGap) {
                biggestGap = leftGap;
                gapCenter = minCloudX - leftGap / 2;
            }
            if (rightGap > biggestGap) {
                biggestGap = rightGap;
                gapCenter = maxCloudX + rightGap / 2;
            }

            // Spawn a single cloud in the middle of the biggest gap (±jitter for organic feel)
            const x = gapCenter + (Math.random() - 0.5) * 200;
            const y = 60 + Math.random() * 280;
            this.spawnCloud(x, y);
        }

        // === ENDLESS SPAWNING / CLEANUP ===
        // px already declared above in cloud section

        // Background segments: spawn to the right
        const lastBgEnd = (this.lastBgIndex + 1) * this.bgWidth;
        if (px > lastBgEnd - this.bgWidth) {
            this.spawnBgSegment(this.lastBgIndex + 1);
        }
        // Background segments: spawn to the left
        const firstBgStart = this.firstBgIndex * this.bgWidth;
        if (px < firstBgStart + this.bgWidth) {
            this.spawnBgSegment(this.firstBgIndex - 1);
        }
        // Remove bg segments far behind (left) or far ahead (right)
        this.bgSegments = this.bgSegments.filter(seg => {
            const segStart = seg.index * this.bgWidth;
            const segEnd = (seg.index + 1) * this.bgWidth;
            if (px > segEnd + this.bgWidth * 2) {
                seg.image.destroy();
                seg.trees.forEach(t => t.destroy());
                return false;
            }
            if (px < segStart - this.bgWidth * 2) {
                seg.image.destroy();
                seg.trees.forEach(t => t.destroy());
                return false;
            }
            return true;
        });
        // Update tracking indices after cleanup
        if (this.bgSegments.length > 0) {
            this.firstBgIndex = Math.min(...this.bgSegments.map(s => s.index));
            this.lastBgIndex = Math.max(...this.bgSegments.map(s => s.index));
        }

        // World chunks: spawn around player (bidirectional)
        const currentChunk = Math.floor(px / this.chunkSize);
        for (let i = currentChunk - 2; i <= currentChunk + 3; i++) {
            this.spawnChunk(i);
        }
        // Remove chunks too far in either direction
        for (const idx of Array.from(this.spawnedChunks)) {
            if (idx < currentChunk - 5 || idx > currentChunk + 5) {
                this.removeChunk(idx);
            }
        }
    }

    collectFish(player, fish) {
        const x = fish.x;
        const y = fish.y;
        fish.destroy();
        const inv = this.registry.get('inventory');
        inv.fish++;
        this.registry.set('inventory', inv);
        this.showFloatingText(player.x, player.y - 30, '\ud83d\udc1f +1');
        this.spawnCollectEffect(x, y, 'heart');
    }

    collectToy(player, toy) {
        const x = toy.x;
        const y = toy.y;
        toy.destroy();
        const inv = this.registry.get('inventory');
        inv.toys++;
        this.registry.set('inventory', inv);
        const stats = this.registry.get('stats');
        stats.happiness = Math.min(100, stats.happiness + 5);
        this.registry.set('stats', stats);
        this.showFloatingText(player.x, player.y - 30, '\ud83e\uddf6 +1');
        this.spawnCollectEffect(x, y, 'star');
    }

    spawnCollectEffect(x, y, textureKey) {
        for (let i = 0; i < 4; i++) {
            const p = this.add.image(x, y, textureKey)
                .setScale(0.3 + Math.random() * 0.3)
                .setAlpha(0.9);
            const angle = Math.random() * Math.PI * 2;
            const dist = 15 + Math.random() * 25;
            this.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist - 15,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: 500 + Math.random() * 300,
                ease: 'Power2',
                onComplete: () => p.destroy()
            });
        }
    }

    createRoundButton(x, y, callback) {
        const radius = 45;
        const size = radius * 2;
        const color = 0xd4c4e0;
        const borderColor = 0xb8a8cc;
        const border = 2;

        const btn = this.add.graphics();
        btn.fillStyle(borderColor, 1);
        btn.fillCircle(0, 0, radius + border);
        btn.fillStyle(color, 1);
        btn.fillCircle(0, 0, radius);
        btn.setPosition(x, y);
        btn.setInteractive(
            new Phaser.Geom.Rectangle(-radius - border, -radius - border, size + border * 2, size + border * 2),
            Phaser.Geom.Rectangle.Contains
        );
        btn.setScrollFactor(0);
        btn.setDepth(50);

        const icon = this.add.text(x, y - 6, '\ud83c\udfe0', {
            fontSize: '24px',
            fontFamily: 'Poppins'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(51);

        this.add.text(x, y + 14, 'Home', {
            fontSize: '11px',
            color: '#8888aa',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(51);

        btn.on('pointerover', () => {
            btn.clear();
            const lighter = 0xe0d0ec;
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(0, 0, radius + border);
            btn.fillStyle(lighter, 1);
            btn.fillCircle(0, 0, radius);
        });
        btn.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(0, 0, radius + border);
            btn.fillStyle(color, 1);
            btn.fillCircle(0, 0, radius);
        });
        btn.on('pointerdown', () => callback());
    }

    showFloatingText(x, y, text) {
        const txt = this.add.text(x, y, text, {
            fontSize: '18px',
            color: '#ffff00',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: txt,
            y: y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => txt.destroy()
        });
    }
}
