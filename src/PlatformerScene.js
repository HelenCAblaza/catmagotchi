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

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Touch input state
        this.touchInput = { left: false, right: false, jump: false };
        
        // Create mobile touch controls
        this.createMobileControls();

        // Home button
        this.createButton(100, 50, '\ud83c\udfe0 Home', () => {
            this.scene.start('HomeScene');
        });

        // Inventory display (directly in scene)
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

        // Instructions
        this.add.text(400, 50, '\u2190 \u2192 Move  |  \u2191 Jump  |  Collect \ud83d\udc1f and \ud83e\uddf6!', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        // Copyright watermark
        this.add.text(400, 580, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '12px',
            color: '#555577'
        }).setOrigin(0.5).setScrollFactor(0);

        // Ground collision
        this.physics.add.collider(this.fishes, this.platforms);
        this.physics.add.collider(this.toys, this.platforms);
    }

    createMobileControls() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isMobile) return; // Don't show on desktop

        const btnSize = 70;
        const btnAlpha = 0.5;
        const btnColor = 0x444466;
        const btnColorActive = 0x6666aa;
        const yPos = 520;

        // Left button
        this.leftBtn = this.add.rectangle(80, yPos, btnSize, btnSize, btnColor, btnAlpha)
            .setStrokeStyle(2, 0xffffff, 0.5)
            .setScrollFactor(0)
            .setInteractive();
        this.leftArrow = this.add.text(80, yPos, '\u25c0', {
            fontSize: '32px', color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);

        // Right button
        this.rightBtn = this.add.rectangle(170, yPos, btnSize, btnSize, btnColor, btnAlpha)
            .setStrokeStyle(2, 0xffffff, 0.5)
            .setScrollFactor(0)
            .setInteractive();
        this.rightArrow = this.add.text(170, yPos, '\u25b6', {
            fontSize: '32px', color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);

        // Jump button (big, roundish, bottom-right)
        this.jumpBtn = this.add.circle(720, yPos, 45, btnColor, btnAlpha)
            .setStrokeStyle(2, 0xffffff, 0.5)
            .setScrollFactor(0)
            .setInteractive();
        this.jumpText = this.add.text(720, yPos, '\u25b2', {
            fontSize: '36px', color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);

        // Touch events for Left
        this.leftBtn.on('pointerdown', () => {
            this.touchInput.left = true;
            this.leftBtn.setFillStyle(btnColorActive, 0.7);
        });
        this.leftBtn.on('pointerup', () => {
            this.touchInput.left = false;
            this.leftBtn.setFillStyle(btnColor, btnAlpha);
        });
        this.leftBtn.on('pointerout', () => {
            this.touchInput.left = false;
            this.leftBtn.setFillStyle(btnColor, btnAlpha);
        });

        // Touch events for Right
        this.rightBtn.on('pointerdown', () => {
            this.touchInput.right = true;
            this.rightBtn.setFillStyle(btnColorActive, 0.7);
        });
        this.rightBtn.on('pointerup', () => {
            this.touchInput.right = false;
            this.rightBtn.setFillStyle(btnColor, btnAlpha);
        });
        this.rightBtn.on('pointerout', () => {
            this.touchInput.right = false;
            this.rightBtn.setFillStyle(btnColor, btnAlpha);
        });

        // Touch events for Jump
        this.jumpBtn.on('pointerdown', () => {
            this.touchInput.jump = true;
            this.jumpBtn.setFillStyle(btnColorActive, 0.7);
        });
        this.jumpBtn.on('pointerup', () => {
            this.touchInput.jump = false;
            this.jumpBtn.setFillStyle(btnColor, btnAlpha);
        });
        this.jumpBtn.on('pointerout', () => {
            this.touchInput.jump = false;
            this.jumpBtn.setFillStyle(btnColor, btnAlpha);
        });
    }

    createLevel() {
        // Ground
        for (let x = 0; x < 1700; x += 32) {
            this.platforms.create(x, 568, 'ground').setScale(1).refreshBody();
        }
        
        // Platforms
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
        
        // Movement - keyboard OR touch
        const left = this.cursors.left.isDown || this.touchInput.left;
        const right = this.cursors.right.isDown || this.touchInput.right;
        const jump = this.cursors.up.isDown || this.touchInput.jump;
        
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
