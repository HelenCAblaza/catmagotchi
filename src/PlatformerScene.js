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
        
        // Touch / swipe state
        this.swipe = {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            jumpQueued: false
        };
        this.setupSwipeControls();

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

        // Hint text (shows on mobile only, fades after 4s)
        this.hintText = this.add.text(400, 520, '\ud83d\udc46 Swipe left/right to move  |  Swipe up to jump!', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(1);
        
        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: this.hintText,
                alpha: 0,
                duration: 1000
            });
        });

        // Copyright watermark
        this.add.text(400, 580, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '12px',
            color: '#555577'
        }).setOrigin(0.5).setScrollFactor(0);

        // Ground collision
        this.physics.add.collider(this.fishes, this.platforms);
        this.physics.add.collider(this.toys, this.platforms);
    }

    setupSwipeControls() {
        // Full-screen invisible zone for swipe detection
        // (cat area is excluded via pointerdown check)
        
        this.input.on('pointerdown', (pointer) => {
            // Don't capture if clicking UI buttons
            if (pointer.button !== 0) return;
            
            this.swipe.active = true;
            this.swipe.startX = pointer.x;
            this.swipe.startY = pointer.y;
            this.swipe.currentX = pointer.x;
            this.swipe.currentY = pointer.y;
            this.swipe.jumpQueued = false;
        });

        this.input.on('pointermove', (pointer) => {
            if (!this.swipe.active) return;
            this.swipe.currentX = pointer.x;
            this.swipe.currentY = pointer.y;
        });

        this.input.on('pointerup', (pointer) => {
            if (!this.swipe.active) return;
            
            const dx = pointer.x - this.swipe.startX;
            const dy = pointer.y - this.swipe.startY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Detect upward swipe for jump
            if (dy < -40 && Math.abs(dx) < Math.abs(dy)) {
                this.swipe.jumpQueued = true;
            }
            
            this.swipe.active = false;
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
        
        // Movement input sources
        const keyboardLeft = this.cursors.left.isDown;
        const keyboardRight = this.cursors.right.isDown;
        const keyboardJump = this.cursors.up.isDown;
        
        // Swipe movement: drag distance determines speed
        let targetVelocityX = 0;
        let jumpPressed = keyboardJump || this.swipe.jumpQueued;
        
        if (this.swipe.active) {
            const dx = this.swipe.currentX - this.swipe.startX;
            
            // Horizontal movement based on drag distance
            if (Math.abs(dx) > 10) {
                const sensitivity = 3; // speed multiplier
                targetVelocityX = Math.max(-220, Math.min(220, dx * sensitivity));
            }
            
            // Upward drag for jump (live while dragging up)
            const dy = this.swipe.currentY - this.swipe.startY;
            if (dy < -50 && Math.abs(dx) < 40) {
                jumpPressed = true;
            }
        }
        
        // Apply movement
        if (keyboardLeft) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
        } else if (keyboardRight) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
        } else if (this.swipe.active) {
            this.player.setVelocityX(targetVelocityX);
            this.player.setFlipX(targetVelocityX < 0);
        } else {
            this.player.setVelocityX(0);
        }

        // Jump
        if (jumpPressed && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
            this.swipe.jumpQueued = false; // consume the queued jump
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
