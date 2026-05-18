class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const fontScale = Math.min(W / 800, H / 600);

        // Background - scaled to fill
        const bg = this.add.image(W / 2, H / 2, 'bg_home');
        bg.setDisplaySize(W, H);

        // Title
        this.add.text(W / 2, H * 0.05, '🐱 Catmagotchi 🐱', {
            fontSize: `${Math.round(36 * fontScale)}px`,
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Copyright watermark
        this.add.text(W / 2, H - 20, '© 2025 Helen C. All Rights Reserved.', {
            fontSize: `${Math.round(12 * fontScale)}px`,
            color: '#555577'
        }).setOrigin(0.5);

        // Cat - positioned center
        this.cat = this.add.sprite(W / 2, H * 0.45, 'cat_idle');
        this.cat.setScale(3 * fontScale);

        // Make cat clickable to clean!
        this.cat.setInteractive({ useHandCursor: true });
        this.cat.on('pointerdown', () => this.cleanCat());

        // Cooldown for cleaning
        this.canClean = true;

        // Cat name
        this.add.text(W / 2, H * 0.35, 'Mittens', {
            fontSize: `${Math.round(24 * fontScale)}px`,
            color: '#ffcc88'
        }).setOrigin(0.5);

        // Hint text under cat
        this.add.text(W / 2, H * 0.55, '👆 Tap cat to clean!', {
            fontSize: `${Math.round(14 * fontScale)}px`,
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Home items (bed, bowl, yarn) - positioned around cat
        const itemY = H * 0.62;
        this.add.image(W * 0.25, itemY, 'bed').setScale(2 * fontScale);
        this.add.text(W * 0.25, itemY - 30 * fontScale, '🛏️ Sleep', {
            fontSize: `${Math.round(14 * fontScale)}px`, color: '#fff'
        }).setOrigin(0.5);

        this.add.image(W * 0.5, itemY + 30 * fontScale, 'bowl').setScale(2 * fontScale);
        this.add.text(W * 0.5, itemY + 5 * fontScale, '🍽️ Food', {
            fontSize: `${Math.round(14 * fontScale)}px`, color: '#fff'
        }).setOrigin(0.5);

        this.add.image(W * 0.75, itemY, 'yarn').setScale(2 * fontScale);
        this.add.text(W * 0.75, itemY - 30 * fontScale, '🧶 Play', {
            fontSize: `${Math.round(14 * fontScale)}px`, color: '#fff'
        }).setOrigin(0.5);

        // Stats bars - left side
        const statX = isMobile ? W * 0.08 : W * 0.15;
        const barW = isMobile ? 120 : 200;
        this.createStatBar(statX, H * 0.12, 'Hunger', 'hunger', 0xff5555, barW, fontScale);
        this.createStatBar(statX, H * 0.17, 'Happy', 'happiness', 0xffcc00, barW, fontScale);
        this.createStatBar(statX, H * 0.22, 'Energy', 'energy', 0x55ff55, barW, fontScale);
        this.createStatBar(statX, H * 0.27, 'Clean', 'hygiene', 0x55ccff, barW, fontScale);

        // Inventory display - right side
        const invX = isMobile ? W * 0.85 : W * 0.78;
        this.fishText = this.add.text(invX, H * 0.12, '🐟: 0', {
            fontSize: `${Math.round(18 * fontScale)}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        this.toyText = this.add.text(invX, H * 0.17, '🧶: 0', {
            fontSize: `${Math.round(18 * fontScale)}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        // Action buttons - bottom row, evenly spaced
        const btnY = H * 0.82;
        const btnW = isMobile ? 90 : 140;
        const btnH = isMobile ? 36 : 40;
        const btnFont = `${Math.round(14 * fontScale)}px`;

        this.createButton(W * 0.2, btnY, '🛏️ Sleep', () => this.sleep(), btnW, btnH, btnFont);
        this.createButton(W * 0.5, btnY, '🍗 Feed', () => this.feed(), btnW, btnH, btnFont);
        this.createButton(W * 0.8, btnY, '🧶 Play', () => this.play(), btnW, btnH, btnFont);

        // Adventure button (go to platformer)
        this.createButton(W / 2, H * 0.9, '🌍 Go Adventure!', () => {
            this.scene.start('PlatformerScene');
        }, isMobile ? 200 : 280, btnH, btnFont, 0x00cc88);

        // Stats update loop
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => this.decayStats()
        });

        // Cat idle animation
        this.tweens.add({
            targets: this.cat,
            y: H * 0.45 - 10 * fontScale,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    createStatBar(x, y, label, key, color, barWidth, fontScale) {
        const barH = Math.round(16 * fontScale);
        const labelW = Math.round(60 * fontScale);
        const bg = this.add.rectangle(x + labelW, y, barWidth, barH, 0x333344).setOrigin(0, 0.5);
        const bar = this.add.rectangle(x + labelW, y, barWidth * 0.8, barH * 0.8, color).setOrigin(0, 0.5);

        this.add.text(x, y, label, {
            fontSize: `${Math.round(14 * fontScale)}px`,
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
            bar.width = Math.max(0, value * (bar.parentContainer ? 2 : 2)); // scale width to percentage
            // Recalculate based on the bar's original max width
            const maxW = bar.originalMaxWidth || 160;
            bar.width = Math.max(0, (value / 100) * maxW);
            if (value < 30) bar.setFillStyle(0xff0000);
        }
    }

    createButton(x, y, text, callback, w = 140, h = 40, fontSize = '16px', color = 0x5555aa) {
        const btn = this.add.rectangle(x, y, w, h, color)
            .setInteractive({ useHandCursor: true });

        const lbl = this.add.text(x, y, text, {
            fontSize: fontSize,
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
            stats.hygiene = Math.max(0, stats.hygiene - 10); // Eating makes cat messy!
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
            stats.hygiene = Math.max(0, stats.hygiene - 15); // Playing gets cat dirty!
            inv.toys++;
            this.showFloatingText(this.cat.x, this.cat.y - 40, '😸 Fun!');

            this.tweens.add({
                targets: this.cat,
                y: this.cat.y - 70,
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

    cleanCat() {
        if (!this.canClean) {
            this.showFloatingText(this.cat.x, this.cat.y - 50, '⏳ Wait...');
            return;
        }

        const stats = this.registry.get('stats');
        if (stats.hygiene >= 100) {
            this.showFloatingText(this.cat.x, this.cat.y - 50, '✨ Already clean!');
            return;
        }

        // Increase hygiene
        stats.hygiene = Math.min(100, stats.hygiene + 25);
        stats.happiness = Math.min(100, stats.happiness + 5);
        this.registry.set('stats', stats);

        // Visual feedback
        this.showFloatingText(this.cat.x, this.cat.y - 50, '👅 Clean!');

        // Licking animation - little scale wobble
        this.tweens.add({
            targets: this.cat,
            scaleX: this.cat.scaleX * 1.07,
            scaleY: this.cat.scaleY * 0.93,
            duration: 150,
            yoyo: true,
            repeat: 2
        });

        // Sparkle effect
        const sparkle = this.add.text(this.cat.x + 30, this.cat.y - 30, '✨', {
            fontSize: `${Math.round(24 * Math.min(this.scale.width / 800, this.scale.height / 600))}px`
        }).setOrigin(0.5);
        this.tweens.add({
            targets: sparkle,
            y: sparkle.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => sparkle.destroy()
        });

        // Cooldown
        this.canClean = false;
        this.time.delayedCall(3000, () => {
            this.canClean = true;
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
        const fontScale = Math.min(this.scale.width / 800, this.scale.height / 600);
        const txt = this.add.text(x, y, text, {
            fontSize: `${Math.round(18 * fontScale)}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: txt,
            y: y - 50 * fontScale,
            alpha: 0,
            duration: 1000,
            onComplete: () => txt.destroy()
        });
    }
}
