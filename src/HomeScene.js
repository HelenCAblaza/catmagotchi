class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    create() {
        const W = this.scale.width;   // 480
        const H = this.scale.height;  // 800
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Background
        const bg = this.add.image(W / 2, H / 2, 'bg_home');
        bg.setDisplaySize(W, H);

        // Title at top center
        this.add.text(W / 2, 30, '\ud83d\udc31 Catmagotchi \ud83d\udc31', {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Copyright watermark
        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '10px',
            color: '#555577'
        }).setOrigin(0.5);

        // === STATS AREA (top section, y=60 to y=140) ===
        // Layout: 2 columns of stats, inventory tucked on far right
        const statY1 = 62;
        const statY2 = 102;
        const barW = 110;   // bar width
        const barH = 14;
        const labelX = 55;  // label right-edge (text origin 1,0.5 extends left)
        const barX = 60;    // bar starts here

        // Left column: Hunger & Energy
        this.createStatBar(labelX, statY1, 'Hunger', 'hunger', 0xff5555, barX, barW, barH);
        this.createStatBar(labelX, statY2, 'Energy', 'energy', 0x55ff55, barX, barW, barH);

        // Right column: Happy & Clean
        const rightLabelX = 245;
        const rightBarX = 250;
        this.createStatBar(rightLabelX, statY1, 'Happy', 'happiness', 0xffcc00, rightBarX, barW, barH);
        this.createStatBar(rightLabelX, statY2, 'Clean', 'hygiene', 0x55ccff, rightBarX, barW, barH);

        // Inventory - far right, aligned with stat rows
        this.fishText = this.add.text(W - 10, statY1, '\ud83d\udc1f: 0', {
            fontSize: '15px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        this.toyText = this.add.text(W - 10, statY2, '\ud83e\uddf6: 0', {
            fontSize: '15px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        // === CAT AREA (center) ===
        const catY = H * 0.40;
        this.cat = this.add.sprite(W / 2, catY, 'cat_idle');
        this.cat.setScale(3.5);

        // Make cat clickable to clean!
        this.cat.setInteractive({ useHandCursor: true });
        this.cat.on('pointerdown', () => this.cleanCat());

        // Cooldown for cleaning
        this.canClean = true;

        // Cat name
        this.add.text(W / 2, catY - 60, 'Mittens', {
            fontSize: '22px',
            color: '#ffcc88'
        }).setOrigin(0.5);

        // Hint text under cat
        this.add.text(W / 2, catY + 60, '\ud83d\udc46 Tap cat to clean!', {
            fontSize: '13px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Decorative items around cat
        const decoY = catY + 20;
        this.add.image(W * 0.15, decoY, 'bed').setScale(1.8);
        this.add.image(W * 0.85, decoY, 'bowl').setScale(1.8);
        this.add.image(W / 2, decoY + 40, 'yarn').setScale(1.8);

        // === BUTTONS (bottom area) ===
        const btnY1 = H * 0.72;
        const btnY2 = btnY1 + 60;
        const btnW = 160;
        const btnH = 42;

        this.createButton(W * 0.25, btnY1, '\ud83d\udecf\ufe0f Sleep', () => this.sleep(), btnW, btnH);
        this.createButton(W * 0.75, btnY1, '\ud83c\udf57 Feed', () => this.feed(), btnW, btnH);
        this.createButton(W * 0.25, btnY2, '\ud83e\uddf6 Play', () => this.play(), btnW, btnH);
        this.createButton(W * 0.75, btnY2, '\ud83c\udf0d Adventure', () => {
            this.scene.start('PlatformerScene');
        }, btnW, btnH, 0x00cc88);

        // Stats update loop
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => this.decayStats()
        });

        // Cat idle animation - gentle bob
        this.tweens.add({
            targets: this.cat,
            y: catY - 8,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    createStatBar(labelX, labelY, label, key, color, barX, barWidth, barHeight) {
        // Label - right-aligned so it extends left from labelX
        this.add.text(labelX, labelY, label, {
            fontSize: '12px',
            color: '#ffffff'
        }).setOrigin(1, 0.5);

        // Bar background
        const bg = this.add.rectangle(barX, labelY, barWidth, barHeight, 0x333344).setOrigin(0, 0.5);
        // Bar fill
        const bar = this.add.rectangle(barX, labelY, barWidth * 0.8, barHeight * 0.75, color).setOrigin(0, 0.5);

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
            const maxW = 110;  // full background width
            bar.width = Math.max(0, (value / 100) * maxW);
            if (value < 30) bar.setFillStyle(0xff0000);
        }
    }

    createButton(x, y, text, callback, w = 160, h = 42, color = 0x5555aa) {
        const btn = this.add.rectangle(x, y, w, h, color)
            .setInteractive({ useHandCursor: true });

        const lbl = this.add.text(x, y, text, {
            fontSize: '15px',
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
            fontSize: '22px'
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
        const txt = this.add.text(x, y, text, {
            fontSize: '16px',
            color: '#ffffff',
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
