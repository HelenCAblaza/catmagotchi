class PlatformerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlatformerScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        const W = this.scale.width;   // 480
        const H = this.scale.height;  // 800
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Adventure mode: collect items to add to your home inventory

        // World bounds - horizontal scrolling platformer
        this.physics.world.setBounds(0, 0, 1600, 600);

        // Platforms
        this.platforms = this.physics.add.staticGroup();
        this.createLevel();

        // Cat player - uses front-facing idle when still, side run when moving
        this.player = this.physics.add.sprite(100, 500, 'cat_idle');
        this.player.setScale(1);
        // Physics body matches the visible cat within the 64x64 sprite
        this.player.body.setSize(32, 40);
        this.player.body.setOffset(16, 12);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        // Switch to run texture when moving
        this.playerRunTexture = false;

        // Camera follow
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 1600, 600);

        // Collectibles
        this.fishes = this.physics.add.group();
        this.toys = this.physics.add.group();
        this.spawnCollectibles();

        this.physics.add.overlap(this.player, this.fishes, (p, f) => this.collectFish(p, f));
        this.physics.add.overlap(this.player, this.toys, (p, t) => this.collectToy(p, t));

        // Keyboard controls (desktop)
        this.cursors = this.input.keyboard.createCursorKeys();

        // Virtual joystick (mobile/touch)
        this.createVirtualJoystick();

        // Decorative clouds in the sky (parallax scrolling)
        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.image(100 + i * 300, 60 + Math.random() * 80, 'cloud')
                .setScale(0.7 + Math.random() * 0.5)
                .setAlpha(0.5 + Math.random() * 0.3)
                .setScrollFactor(0.3)
                .setDepth(-5);
            this.clouds.push({
                sprite: cloud,
                speed: 0.1 + Math.random() * 0.2
            });
        }

        // Floating stars/sparkles
        this.stars = this.add.group();
        for (let i = 0; i < 8; i++) {
            const star = this.add.image(Math.random() * 1600, Math.random() * 400, 'star')
                .setScale(0.3 + Math.random() * 0.3)
                .setAlpha(0.4 + Math.random() * 0.4);
            this.stars.add(star);
            this.tweens.add({
                targets: star,
                y: star.y - 10,
                alpha: 0.1,
                duration: 2000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // === UI ===
        // Home button - bottom right, round pastel
        this.createRoundButton(W - 45, H - 45, '\ud83c\udfe0', () => {
            this.scene.start('HomeScene');
        });

        // Inventory display - top left
        this.fishText = this.add.text(10, 10, '\ud83d\udc1f: 0', {
            fontSize: '15px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.toyText = this.add.text(10, 32, '\ud83e\uddf6: 0', {
            fontSize: '15px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        // Hint text (shows on mobile, fades after 4s)
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

        // Copyright watermark
        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '10px',
            color: '#887799',
            fontFamily: 'Poppins'
        }).setOrigin(0.5).setScrollFactor(0);

        // Ground collision
        this.physics.add.collider(this.fishes, this.platforms);
        this.physics.add.collider(this.toys, this.platforms);
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

        // Outer ring (base)
        this.joyBase = this.add.circle(0, 0, baseRadius, 0x444466, 0.22)
            .setStrokeStyle(3, 0xffffff, 0.35)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(100);

        // Direction hint arrows
        this.joyArrows = this.add.text(0, 0, '\u25c0  \u25b6\n\u25b2', {
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(100).setAlpha(0.35);

        // Inner nub (draggable thumb stick)
        this.joyNub = this.add.circle(0, 0, nubRadius, 0x7777dd, 0.55)
            .setStrokeStyle(2, 0xffffff, 0.5)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(101);

        // Nub highlight
        this.joyNubGlow = this.add.circle(0, 0, nubRadius * 0.55, 0xaaaaff, 0.35)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(101);

        // Activate joystick when touching bottom half of screen
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

    createLevel() {
        for (let x = 0; x < 1700; x += 32) {
            this.platforms.create(x, 568, 'ground').setScale(1).refreshBody();
        }

        this.platforms.create(200, 450, 'platform');
        this.platforms.create(350, 380, 'platform');
        this.platforms.create(500, 300, 'platform');
        this.platforms.create(700, 400, 'platform');
        this.platforms.create(850, 320, 'platform');
        this.platforms.create(1000, 450, 'platform');
        this.platforms.create(1200, 350, 'platform');
        this.platforms.create(1350, 280, 'platform');
        this.platforms.create(1500, 400, 'platform');
    }

    spawnCollectibles() {
        const fishPositions = [
            [250, 400], [400, 330], [550, 250],
            [750, 350], [900, 270], [1050, 400],
            [1250, 300], [1400, 230]
        ];

        const toyPositions = [
            [320, 420], [620, 450], [820, 370],
            [1120, 420], [1320, 320]
        ];

        fishPositions.forEach(([x, y]) => {
            const fish = this.fishes.create(x, y, 'fish');
            // Gentle bob animation
            this.tweens.add({
                targets: fish,
                y: y - 5,
                duration: 800 + Math.random() * 400,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        toyPositions.forEach(([x, y]) => {
            const yarn = this.toys.create(x, y, 'yarn');
            // Gentle spin and bob
            this.tweens.add({
                targets: yarn,
                y: y - 6,
                angle: 10,
                duration: 1000 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    update() {
        const stats = this.registry.get('stats');

        // Drift clouds
        for (const cloud of this.clouds) {
            cloud.sprite.x += cloud.speed;
            if (cloud.sprite.x > 1700) {
                cloud.sprite.x = -100;
            }
        }

        // Update inventory display
        const inv = this.registry.get('inventory');
        this.fishText.setText(`\ud83d\udc1f: ${inv.fish}`);
        this.toyText.setText(`\ud83e\uddf6: ${inv.toys}`);

        // Movement - keyboard OR joystick
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
            velocityX = this.joyActive ? -200 * Math.abs(this.joyX) : -200;
            this.player.setFlipX(false);  // face left (default sprite direction)
        } else if (right) {
            velocityX = this.joyActive ? 200 * Math.abs(this.joyX) : 200;
            this.player.setFlipX(true);   // flip to face right
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

    createRoundButton(x, y, text, callback) {
        // Round pastel button with matching outline
        const btn = this.add.container(x, y);
        btn.setScrollFactor(0).setDepth(50);

        // Background circle - soft pastel lavender
        const bg = this.add.circle(0, 0, 32, 0xd4c4e0)
            .setStrokeStyle(3, 0xb8a8cc, 1);  // slightly darker lavender outline
        btn.add(bg);

        // Emoji/text label centered
        const lbl = this.add.text(0, 1, text, {
            fontSize: '24px',
            fontFamily: 'Poppins'
        }).setOrigin(0.5);
        btn.add(lbl);

        // Make circle interactive
        bg.setInteractive({ useHandCursor: true, hitArea: new Phaser.Geom.Circle(0, 0, 32), hitAreaCallback: Phaser.Geom.Circle.Contains });

        const onOver = () => {
            bg.setFillStyle(0xe0d0ec);
            bg.setStrokeStyle(3, 0xc4b4d8, 1);
        };
        const onOut = () => {
            bg.setFillStyle(0xd4c4e0);
            bg.setStrokeStyle(3, 0xb8a8cc, 1);
        };
        const onClick = () => callback();

        bg.on('pointerover', onOver);
        bg.on('pointerout', onOut);
        bg.on('pointerdown', onClick);
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
