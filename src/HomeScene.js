class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    create() {
        // Background
        this.add.image(400, 300, 'bg_home');
        
        // Title
        this.add.text(400, 30, '🐱 Catmagotchi 🐱', {
            fontSize: '36px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Copyright watermark
        this.add.text(400, 580, '© 2025 Helen C. All Rights Reserved.', {
            fontSize: '12px',
            color: '#555577'
        }).setOrigin(0.5);

        // Cat
        this.cat = this.add.sprite(400, 320, 'cat_idle');
        this.cat.setScale(3);
        
        // Cat name
        this.add.text(400, 240, 'Mittens', {
            fontSize: '24px',
            color: '#ffcc88'
        }).setOrigin(0.5);

        // Home items
        this.add.image(200, 400, 'bed').setScale(2);
        this.add.text(200, 370, '🛏️ Sleep', { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
        
        this.add.image(400, 450, 'bowl').setScale(2);
        this.add.text(400, 430, '🍽️ Food', { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
        
        this.add.image(600, 400, 'yarn').setScale(2);
        this.add.text(600, 370, '🧶 Play', { fontSize: '14px', color: '#fff' }).setOrigin(0.5);

        // Stats bars background
        this.createStatBar(150, 100, 'Hunger', 'hunger', 0xff5555);
        this.createStatBar(150, 140, 'Happy', 'happiness', 0xffcc00);
        this.createStatBar(150, 180, 'Energy', 'energy', 0x55ff55);
        this.createStatBar(150, 220, 'Clean', 'hygiene', 0x55ccff);

        // Inventory display
        this.fishText = this.add.text(650, 100, '🐟: 0', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        
        this.toyText = this.add.text(650, 125, '🧶: 0', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Action buttons
        this.createButton(200, 520, '🛏️ Sleep', () => this.sleep());
        this.createButton(400, 520, '🍗 Feed', () => this.feed());
        this.createButton(600, 520, '🧶 Play', () => this.play());

        // Adventure button (go to platformer)
        this.createButton(400, 570, '🌍 Go Adventure!', () => {
            this.scene.start('PlatformerScene');
        }, 0x00cc88);

        // Stats update loop
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => this.decayStats()
        });

        // Cat idle animation
        this.tweens.add({
            targets: this.cat,
            y: 310,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    createStatBar(x, y, label, key, color) {
        const bg = this.add.rectangle(x + 100, y, 200, 20, 0x333344).setOrigin(0, 0.5);
        const bar = this.add.rectangle(x + 100, y, 160, 16, color).setOrigin(0, 0.5);
        
        this.add.text(x, y, label, {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(1, 0.5);

        this[`bar_${key}`] = bar;
    }

    update() {
        const stats = this.registry.get('stats');
        this.updateBar('hunger', stats.hunger);
        this.updateBar('happiness', stats.happiness);
        this.updateBar('energy', stats.energy);
        this.updateBar('hygiene', stats.hygiene);

        // Update inventory display
        const inv = this.registry.get('inventory');
        this.fishText.setText(`🐟: ${inv.fish}`);
        this.toyText.setText(`🧶: ${inv.toys}`);
    }

    updateBar(key, value) {
        const bar = this[`bar_${key}`];
        if (bar) {
            bar.width = Math.max(0, value * 2);
            if (value < 30) bar.setFillStyle(0xff0000);
        }
    }

    createButton(x, y, text, callback, color = 0x5555aa) {
        const btn = this.add.rectangle(x, y, 140, 40, color)
            .setInteractive({ useHandCursor: true });
        
        const lbl = this.add.text(x, y, text, {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        btn.on('pointerover', () => btn.setFillStyle(color + 0x222222));
        btn.on('pointerout', () => btn.setFillStyle(color));
        btn.on('pointerdown', callback);
    }

    feed() {
        const stats = this.registry.get('stats');
        const inv = this.registry.get('inventory');
        
        if (inv.fish > 0) {
            stats.hunger = Math.min(100, stats.hunger + 20);
            stats.energy = Math.min(100, stats.energy + 5);
            inv.fish--;
            this.showFloatingText(this.cat.x, this.cat.y - 40, '😋 Yum!');
        } else {
            this.showFloatingText(this.cat.x, this.cat.y - 40, '😿 No fish!');
        }
        
        this.registry.set('stats', stats);
        this.registry.set('inventory', inv);
    }

    play() {
        const stats = this.registry.get('stats');
        const inv = this.registry.get('inventory');
        
        if (stats.energy > 10) {
            stats.happiness = Math.min(100, stats.happiness + 15);
            stats.energy = Math.max(0, stats.energy - 10);
            inv.toys++;
            this.showFloatingText(this.cat.x, this.cat.y - 40, '😸 Fun!');
            
            this.tweens.add({
                targets: this.cat,
                y: 250,
                duration: 300,
                yoyo: true
            });
        } else {
            this.showFloatingText(this.cat.x, this.cat.y - 40, '😴 Too tired...');
        }
        
        this.registry.set('stats', stats);
        this.registry.set('inventory', inv);
    }

    sleep() {
        const stats = this.registry.get('stats');
        stats.energy = Math.min(100, stats.energy + 30);
        stats.hunger = Math.max(0, stats.hunger - 10);
        this.registry.set('stats', stats);
        
        this.cat.setTexture('cat_sleep');
        this.showFloatingText(this.cat.x, this.cat.y - 40, '💤 Zzz...');
        
        // Use Phaser timer so it auto-cancels if scene stops
        this.time.delayedCall(2000, () => {
            if (this.cat && this.cat.active) {
                this.cat.setTexture('cat_idle');
            }
        });
    }

    decayStats() {
        const stats = this.registry.get('stats');
        stats.hunger = Math.max(0, stats.hunger - 2);
        stats.happiness = Math.max(0, stats.happiness - 1);
        stats.energy = Math.max(0, stats.energy - 1);
        stats.hygiene = Math.max(0, stats.hygiene - 0.5);
        this.registry.set('stats', stats);
    }

    showFloatingText(x, y, text) {
        const txt = this.add.text(x, y, text, {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: txt,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => txt.destroy()
        });
    }
}
