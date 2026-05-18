class PlatformerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlatformerScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        const W = this.scale.width;
        const H = this.scale.height;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.fontScale = Math.min(W / 800, H / 600);

        // World bounds
        this.physics.world.setBounds(0, 0, 1600, 600);

        // Platforms
        this.platforms = this.physics.add.staticGroup();
        this.createLevel();

        // Cat player
        this.player = this.physics.add.sprite(100, 450, 'cat_run');
        this.player.setScale(2);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

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

        // Home button - top-left with padding
        this.createButton(W * 0.08, H * 0.08, '\ud83c\udfe0 Home', () => {
            this.scene.start('HomeScene');
        });

        // Inventory display - below home button
        this.fishText = this.add.text(W * 0.02, H * 0.02, '\ud83d\udc1f: 0', {
            fontSize: `${Math.round(18 * this.fontScale)}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.toyText = this.add.text(W * 0.02, H * 0.02 + 25 * this.fontScale, '\ud83e\uddf6: 0', {
            fontSize: `${Math.round(18 * this.fontScale)}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        // Hint text (shows on mobile, fades after 4s)
        if (isMobile) {
            this.hintText = this.add.text(W / 2, H * 0.12, '\ud83c\udfae Drag the round controller to move & jump!', {
                fontSize: `${Math.round(16 * this.fontScale)}px`,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5).setScrollFactor(0);

            this.time.delayedCall(4000, () => {
                this.tweens.add({ targets: this.hintText, alpha: 0, duration: 1000 });
            });
        }

        // Copyright watermark
        this.add.text(W / 2, H - 20, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: `${Math.round(12 * this.fontScale)}px`,
            color: '#555577'
        }).setOrigin(0.5).setScrollFactor(0);

        // Ground collision
        this.physics.add.collider(this.fishes, this.platforms);
        this.physics.add.collider(this.toys, this.platforms);
    }

    createVirtualJoystick() {
        const W = this.scale.width;
        const H = this.scale.height;
        const maxDrag = 55 * this.fontScale;
        const baseRadius = 70 * this.fontScale;
        const nubRadius = 26 * this.fontScale;

        // Joystick state
        this.joyActive = false;
        this.joyBaseX = 0;
        this.joyBaseY = 0;
        this.joyX = 0;
        this.joyY = 0;
        this.joyJumpTriggered = false;

        // --- Visuals (hidden until active) ---
        // Outer ring (base) with subtle cross lines
        this.joyBase = this.add.circle(0, 0, baseRadius, 0x444466, 0.22)
            .setStrokeStyle(Math.max(2, Math.round(3 * this.fontScale)), 0xffffff, 0.35)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(100);

        // Direction hint arrows on the base
        this.joyArrows = this.add.text(0, 0, '\u25c0  \u25b6\n\u25b2', {
            fontSize: `${Math.round(18 * this.fontScale)}px`,
            color: '#ffffff',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(100).setAlpha(0.35);

        // Inner nub (the draggable thumb stick)
        this.joyNub = this.add.circle(0, 0, nubRadius, 0x7777dd, 0.55)
            .setStrokeStyle(Math.max(2, Math.round(2 * this.fontScale)), 0xffffff, 0.5)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(101);

        // Nub highlight for a subtle 3D effect
        this.joyNubGlow = this.add.circle(0, 0, nubRadius * 0.55, 0xaaaaff, 0.35)
            .setScrollFactor(0)
            .setVisible(false)
            .setDepth(101);

        // --- Input handling ---
        // Activate joystick when touching bottom half of screen (avoid UI top area)
        const joyZoneTop = H * 0.35;
        this.input.on('pointerdown', (pointer) => {
            if (pointer.y > joyZoneTop && !this.joyActive) {
                this.joyActive = true;
                this.joyBaseX = pointer.x;
                this.joyBaseY = pointer.y;
                this.joyX = 0;
                this.joyY = 0;

                // Position visuals
                this.joyBase.setPosition(this.joyBaseX, this.joyBaseY);
                this.joyArrows.setPosition(this.joyBaseX, this.joyBaseY);
                this.joyNub.setPosition(this.joyBaseX, this.joyBaseY);
                this.joyNubGlow.setPosition(this.joyBaseX - 3, this.joyBaseY - 3);

                // Show visuals
                this.joyBase.setVisible(true);
                this.joyArrows.setVisible(true);
                this.joyNub.setVisible(true);
                this.joyNubGlow.setVisible(true);

                // Pop-in animation
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

        // Update nub position during drag
        this.input.on('pointermove', (pointer) => {
            if (this.joyActive && pointer.isDown) {
                const dx = pointer.x - this.joyBaseX;
                const dy = pointer.y - this.joyBaseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Clamp nub to maxDrag radius
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

                // Normalize joystick values (-1 to 1)
                this.joyX = Phaser.Math.Clamp(dx / maxDrag, -1, 1);
                this.joyY = Phaser.Math.Clamp(dy / maxDrag, -1, 1);
            }
        });

        // Release
        this.input.on('pointerup', () => {
            if (this.joyActive) {
                this.joyActive = false;
                this.joyX = 0;
                this.joyY = 0;
                this.joyJumpTriggered = false;

                // Pop-out animation then hide
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
            this.fishes.create(x, y, 'fish');
        });

        toyPositions.forEach(([x, y]) => {
            this.toys.create(x, y, 'yarn');
        });
    }

    update() {
        const stats = this.registry.get('stats');
        const W = this.scale.width;
        const H = this.scale.height;

        // Update inventory display
        const inv = this.registry.get('inventory');
        this.fishText.setText(`\ud83d\udc1f: ${inv.fish}`);
        this.toyText.setText(`\ud83e\uddf6: ${inv.toys}`);
        // Keep inventory positioned correctly on resize
        this.fishText.setPosition(W * 0.02, H * 0.02);
        this.toyText.setPosition(W * 0.02, H * 0.02 + 25 * this.fontScale);

        // Movement - keyboard OR joystick
        let left = this.cursors.left.isDown;
        let right = this.cursors.right.isDown;
        let jump = this.cursors.up.isDown;

        // Add joystick input
        if (this.joyActive) {
            // Horizontal: use analog joystick value with a deadzone
            if (Math.abs(this.joyX) > 0.15) {
                if (this.joyX < 0) left = true;
                else right = true;
            }

            // Vertical: pull up to jump (threshold -0.4)
            if (this.joyY < -0.4 && !this.joyJumpTriggered) {
                jump = true;
                this.joyJumpTriggered = true;
            }
            // Reset jump trigger when pulling back down
            if (this.joyY > -0.2) {
                this.joyJumpTriggered = false;
            }
        }

        // Apply movement with analog speed when using joystick
        let velocityX = 0;
        if (left) {
            velocityX = this.joyActive ? -200 * Math.abs(this.joyX) : -200;
            this.player.setFlipX(true);
        } else if (right) {
            velocityX = this.joyActive ? 200 * Math.abs(this.joyX) : 200;
            this.player.setFlipX(false);
        }
        this.player.setVelocityX(velocityX);

        // Jump
        if (jump && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
            // Visual feedback on nub
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

        // Energy drain from running
        if (Math.abs(this.player.body.velocity.x) > 10) {
            stats.energy = Math.max(0, stats.energy - 0.02);
            this.registry.set('stats', stats);
        }
    }

    collectFish(player, fish) {
        fish.destroy();
        const inv = this.registry.get('inventory');
        inv.fish++;
        this.registry.set('inventory', inv);
        this.showFloatingText(player.x, player.y - 30, '\ud83d\udc1f +1');
    }

    collectToy(player, toy) {
        toy.destroy();
        const inv = this.registry.get('inventory');
        inv.toys++;
        this.registry.set('inventory', inv);
        const stats = this.registry.get('stats');
        stats.happiness = Math.min(100, stats.happiness + 5);
        this.registry.set('stats', stats);
        this.showFloatingText(player.x, player.y - 30, '\ud83e\uddf6 +1');
    }

    createButton(x, y, text, callback) {
        const w = Math.round(100 * this.fontScale);
        const h = Math.round(40 * this.fontScale);
        const btn = this.add.rectangle(x, y, w, h, 0x5555aa)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);

        const lbl = this.add.text(x, y, text, {
            fontSize: `${Math.round(16 * this.fontScale)}px`,
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);

        btn.on('pointerover', () => btn.setFillStyle(0x7777cc));
        btn.on('pointerout', () => btn.setFillStyle(0x5555aa));
        btn.on('pointerdown', callback);
    }

    showFloatingText(x, y, text) {
        const txt = this.add.text(x, y, text, {
            fontSize: `${Math.round(20 * this.fontScale)}px`,
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: txt,
            y: y - 40 * this.fontScale,
            alpha: 0,
            duration: 1000,
            onComplete: () => txt.destroy()
        });
    }
}
