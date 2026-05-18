class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    create() {
        const W = this.scale.width;   // 480
        const H = this.scale.height;  // 800
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const fontScale = Math.min(W / 480, H / 800);

        // Background - scaled to fill
        const bg = this.add.image(W / 2, H / 2, 'bg_home');
        bg.setDisplaySize(W, H);

        // Title at top
        this.add.text(W / 2, H * 0.04, '\ud83d\udc31 Catmagotchi \ud83d\udc31', {
            fontSize: `${Math.round(32 * fontScale)}px`,
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Copyright watermark
        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: `${Math.round(10 * fontScale)}px`,
            color: '#555577'
        }).setOrigin(0.5);

        // Stats bars - top section, two columns
        const statY = H * 0.10;
        const statGap = H * 0.045;
        const barW = W * 0.35;
        const barH = Math.max(10, Math.round(14 * fontScale));

        this.createStatBar(W * 0.05, statY, 'Hunger', 'hunger', 0xff5555, barW, barH, fontScale);
        this.createStatBar(W * 0.55, statY, 'Happy', 'happiness', 0xffcc00, barW, barH, fontScale);
        this.createStatBar(W * 0.05, statY + statGap, 'Energy', 'energy', 0x55ff55, barW, barH, fontScale);
        this.createStatBar(W * 0.55, statY + statGap, 'Clean', 'hygiene', 0x55ccff, barW, barH, fontScale);

        // Inventory display - right of stats
        this.fishText = this.add.text(W * 0.92, statY, '\ud83d\udc1f: 0', {
            fontSize: `${Math.round(16 * fontScale)}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        this.toyText = this.add.text(W * 0.92, statY + statGap, '\ud83e\uddf6: 0', {
            fontSize: `${Math.round(16 * fontScale)}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        // Cat - centered vertically in the middle of the screen
        const catY = H * 0.40;
        this.cat = this.add.sprite(W / 2, catY, 'cat_idle');
        this.cat.setScale(3.5 * fontScale);

        // Make cat clickable to clean!
        this.cat.setInteractive({ useHandCursor: true });
        this.cat.on('pointerdown', () => this.cleanCat());

        // Cooldown for cleaning
        this.canClean = true;

        // Cat name
        this.add.text(W / 2, catY - 55 * fontScale, 'Mittens', {
            fontSize: `${Math.round(24 * fontScale)}px`,
            color: '#ffcc88'
        }).setOrigin(0.5);

        // Hint text under cat
        this.add.text(W / 2, catY + 55 * fontScale, '\ud83d\udc46 Tap cat to clean!', {
            fontSize: `${Math.round(14 * fontScale)}px`,
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Home items - decorative, around cat
        const decoY = catY + 20 * fontScale;
        this.add.image(W * 0.15, decoY, 'bed').setScale(1.8 * fontScale);
        this.add.image(W * 0.85, decoY, 'bowl').setScale(1.8 * fontScale);
        this.add.image(W * 0.5, decoY + 35 * fontScale, 'yarn').setScale(1.8 * fontScale);

        // Action buttons - bottom area, stacked or in a compact row
        const btnY = H * 0.72;
        const btnGap = H * 0.065;
        const btnW = W * 0.38;
        const btnH = Math.max(36, Math.round(42 * fontScale));
        const btnFont = `${Math.round(15 * fontScale)}px`;

        this.createButton(W * 0.25, btnY, '\ud83d\udecf\ufe0f Sleep', () => this.sleep(), btnW, btnH, btnFont);
        this.createButton(W * 0.75, btnY, '\ud83c\udf57 Feed', () => this.feed(), btnW, btnH, btnFont);
        this.createButton(W * 0.25, btnY + btnGap, '\ud83e\uddf6 Play', () => this.play(), btnW, btnH, btnFont);
        this.createButton(W * 0.75, btnY + btnGap, '\ud83c\udf0d Adventure', () => {
            this.scene.start('PlatformerScene');
        }, btnW, btnH, btnFont, 0x00cc88);

        // Stats update loop
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => this.decayStats()
        });

        // Cat idle animation - gentle bob
        this.tweens.add({
            targets: this.cat,
            y: catY - 8 * fontScale,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    createStatBar(x, y, label, key, color, barWidth, barHeight, fontScale) {
        const labelW = Math.round(50 * fontScale);
        const bg = this.add.rectangle(x + labelW, y, barWidth, barHeight, 0x333344).setOrigin(0, 0.5);
        const bar = this.add.rectangle(x + labelW, y, barWidth * 0.8, barHeight * 0.75, color).setOrigin(0, 0.5);

        this.add.text(x, y, label, {
            fontSize: `${Math.round(12 * fontScale)}px`,
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
        this.fishText.setText(`\ud83d\udc1f: ${inv.fish}`);
        this.toyText.setText(`\ud83e\uddf6: ${inv.toys}`);
    }

    updateBar(key, value) {
        const bar = this[`bar_${key}`];
        if (bar) {
            bar.width = Math.max(0, (value / 100) * bar.parent?.width * 0.8 || 120);
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
            stats.hygiene = Math.max(0, stats.hygiene - 10);
            inv.fish--;
            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude0b Yum!');
        } else {
            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude3f No fish!');
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
            stats.hygiene = Math.max(0, stats.hygiene - 15);
            inv.toys++;
            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude38 Fun!');

            this.tweens.add({
                targets: this.cat,
                y: this.cat.y - 70,
                duration: 300,
                yoyo: true
            });
        } else {
            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude34 Too tired...');
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
        this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\udca4 Zzz...');

        this.time.delayedCall(2000, () => {
            if (this.cat && this.cat.active) {
                this.cat.setTexture('cat_idle');
            }
        });
    }

    cleanCat() {
        if (!this.canClean) {
            this.showFloatingText(this.cat.x, this.cat.y - 50, '\u23f3 Wait...');
            return;
        }

        const stats = this.registry.get('stats');
        if (stats.hygiene >= 100) {
            this.showFloatingText(this.cat.x, this.cat.y - 50, '\u2728 Already clean!');
            return;
        }

        stats.hygiene = Math.min(100, stats.hygiene + 25);
        stats.happiness = Math.min(100, stats.happiness + 5);
        this.registry.set('stats', stats);

        this.showFloatingText(this.cat.x, this.cat.y - 50, '\ud83d\udc45 Clean!');

        this.tweens.add({
            targets: this.cat,
            scaleX: this.cat.scaleX * 1.07,
            scaleY: this.cat.scaleY * 0.93,
            duration: 150,
            yoyo: true,
            repeat: 2
        });

        const sparkle = this.add.text(this.cat.x + 30, this.cat.y - 30, '\u2728', {
            fontSize: `${Math.round(24 * Math.min(this.scale.width / 480, this.scale.height / 800))}px`
        }).setOrigin(0.5);
        this.tweens.add({
            targets: sparkle,
            y: sparkle.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => sparkle.destroy()
        });

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
        const fontScale = Math.min(this.scale.width / 480, this.scale.height / 800);
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
