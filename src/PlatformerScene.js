class PlatformerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlatformerScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        
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
        
        // Touch state
        this.touchLeft = false;
        this.touchRight = false;
        this.touchJump = false;

        // Mobile touch zones (large, semi-transparent)
        this.createTouchZones();

        // Home button
        this.createButton(100, 50, '\ud83c\udfe0 Home', () => {
            this.scene.start('HomeScene');
        });

        // Inventory display
        this.fishText = this.add.text(10, 10, '\ud83d\udc1f: 0', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);
        
        this.toyText = this.add.text(10, 35, '\ud83e\uddf6: 0', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        // Hint text (shows on mobile, fades after 4s)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            this.hintText = this.add.text(400, 100, '\ud83d\udc46 Touch bottom zones to move & jump!', {
                fontSize: '16px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5).setScrollFactor(0);
            
            this.time.delayedCall(4000, () => {
                this.tweens.add({ targets: this.hintText, alpha: 0, duration: 1000 });
            });
        }

        // Copyright watermark
        this.add.text(400, 580, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '12px',
            color: '#555577'
        }).setOrigin(0.5).setScrollFactor(0);

        // Ground collision
        this.physics.add.collider(this.fishes, this.platforms);
        this.physics.add.collider(this.toys, this.platforms);
    }

    createTouchZones() {
        const btnAlpha = 0.35;
        const btnAlphaActive = 0.65;
        const btnColor = 0x444466;
        const btnColorActive = 0x6666cc;
        const yPos = 535;

        // Left zone
        this.zoneLeft = this.add.rectangle(90, yPos, 140, 75, btnColor, btnAlpha)
            .setStrokeStyle(2, 0xffffff, 0.3)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });
        this.txtLeft = this.add.text(90, yPos, '\u25c0', {
            fontSize: '36px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0.7);

        // Right zone
        this.zoneRight = this.add.rectangle(710, yPos, 140, 75, btnColor, btnAlpha)
            .setStrokeStyle(2, 0xffffff, 0.3)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });
        this.txtRight = this.add.text(710, yPos, '\u25b6', {
            fontSize: '36px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0.7);

        // Jump zone (circle, bottom center-right)
        this.zoneJump = this.add.circle(400, yPos, 42, btnColor, btnAlpha)
            .setStrokeStyle(2, 0xffffff, 0.3)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });
        this.txtJump = this.add.text(400, yPos, '\u25b2', {
            fontSize: '36px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0.7);

        // --- Left zone events ---
        this.zoneLeft.on('pointerdown', () => {
            this.touchLeft = true;
            this.zoneLeft.setAlpha(btnAlphaActive);
            this.zoneLeft.setFillStyle(btnColorActive);
        });
        this.zoneLeft.on('pointerup', () => {
            this.touchLeft = false;
            this.zoneLeft.setAlpha(btnAlpha);
            this.zoneLeft.setFillStyle(btnColor);
        });
        this.zoneLeft.on('pointerout', () => {
            this.touchLeft = false;
            this.zoneLeft.setAlpha(btnAlpha);
            this.zoneLeft.setFillStyle(btnColor);
        });

        // --- Right zone events ---
        this.zoneRight.on('pointerdown', () => {
            this.touchRight = true;
            this.zoneRight.setAlpha(btnAlphaActive);
            this.zoneRight.setFillStyle(btnColorActive);
        });
        this.zoneRight.on('pointerup', () => {
            this.touchRight = false;
            this.zoneRight.setAlpha(btnAlpha);
            this.zoneRight.setFillStyle(btnColor);
        });
        this.zoneRight.on('pointerout', () => {
            this.touchRight = false;
            this.zoneRight.setAlpha(btnAlpha);
            this.zoneRight.setFillStyle(btnColor);
        });

        // --- Jump zone events ---
        this.zoneJump.on('pointerdown', () => {
            this.touchJump = true;
            this.zoneJump.setAlpha(btnAlphaActive);
            this.zoneJump.setFillStyle(btnColorActive);
            // Visual feedback - pulse the jump text
            this.tweens.add({
                targets: this.txtJump,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 100,
                yoyo: true
            });
        });
        this.zoneJump.on('pointerup', () => {
            this.touchJump = false;
            this.zoneJump.setAlpha(btnAlpha);
            this.zoneJump.setFillStyle(btnColor);
        });
        this.zoneJump.on('pointerout', () => {
            this.touchJump = false;
            this.zoneJump.setAlpha(btnAlpha);
            this.zoneJump.setFillStyle(btnColor);
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
        
        // Update inventory display
        const inv = this.registry.get('inventory');
        this.fishText.setText(`\ud83d\udc1f: ${inv.fish}`);
        this.toyText.setText(`\ud83e\uddf6: ${inv.toys}`);
        
        // Movement - keyboard OR touch zones
        const left = this.cursors.left.isDown || this.touchLeft;
        const right = this.cursors.right.isDown || this.touchRight;
        const jump = this.cursors.up.isDown || this.touchJump;
        
        if (left) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
        } else if (right) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }

        // Jump
        if (jump && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
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
        const btn = this.add.rectangle(x, y, 100, 40, 0x5555aa)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);
        
        const lbl = this.add.text(x, y, text, {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);

        btn.on('pointerover', () => btn.setFillStyle(0x7777cc));
        btn.on('pointerout', () => btn.setFillStyle(0x5555aa));
        btn.on('pointerdown', callback);
    }

    showFloatingText(x, y, text) {
        const txt = this.add.text(x, y, text, {
            fontSize: '20px',
            color: '#ffff00',
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
