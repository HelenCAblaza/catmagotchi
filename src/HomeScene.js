class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    create() {
        const W = this.scale.width;   // 480
        const H = this.scale.height;  // 800

        // Background
        const bg = this.add.image(W / 2, H / 2, 'bg_home');
        bg.setDisplaySize(W, H);

        // Floating clouds (decorative, slowly drifting)
        this.clouds = [];
        for (let i = 0; i < 3; i++) {
            const cloud = this.add.image(80 + i * 150, 60 + i * 30, 'cloud')
                .setScale(0.6 + Math.random() * 0.4)
                .setAlpha(0.5 + Math.random() * 0.3)
                .setDepth(-1);
            this.clouds.push({
                sprite: cloud,
                speed: 0.2 + Math.random() * 0.3
            });
        }

        // Floating hearts particles around the cat area
        this.hearts = this.add.group();
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => this.spawnHeart()
        });

        // Title at top center with a cute glow
        this.add.text(W / 2, 52, '\u2728 Catmagotchi \u2728', {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: '"Poppins", sans-serif',
            stroke: '#ff88cc',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Copyright watermark
        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '10px',
            color: '#cc99cc',
            fontFamily: '"Poppins", sans-serif'
        }).setOrigin(0.5);

        // Cat name above stats - smaller, left aligned, no stars, darker grey
        this.add.text(20, 92, 'Mittens', {
            fontSize: '18px',
            color: '#555555',
            fontFamily: '"Poppins", sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // === STATS AREA ===
        const statY1 = 120;
        const statY2 = 156;
        const barW = 110;
        const barH = 14;
        const labelX = 20;     // aligned with name
        const barX = 70;       // after labels

        this.createCapsuleStatBar(labelX, statY1, 'Hunger', 'hunger', 0xff7799, barX, barW, barH);
        this.createCapsuleStatBar(labelX, statY2, 'Energy', 'energy', 0x88dd88, barX, barW, barH);

        const rightLabelX = 260;
        const rightBarX = 300;
        this.createCapsuleStatBar(rightLabelX, statY1, 'Happy', 'happiness', 0xffcc66, rightBarX, barW, barH);
        this.createCapsuleStatBar(rightLabelX, statY2, 'Clean', 'hygiene', 0x77ccff, rightBarX, barW, barH);

        // Inventory - far right, aligned with stat rows
        this.fishText = this.add.text(W - 10, statY1, '\ud83d\udc1f: 0', {
            fontSize: '15px',
            color: '#cccccc',
            fontFamily: '"Poppins", sans-serif',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        this.toyText = this.add.text(W - 10, statY2, '\ud83e\uddf6: 0', {
            fontSize: '15px',
            color: '#cccccc',
            fontFamily: '"Poppins", sans-serif',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        // === CAT AREA ===
        const catY = H * 0.40;
        this.cat = this.add.sprite(W / 2, catY, 'cat_idle');
        this.cat.setScale(2);

        // Make cat clickable to clean!
        this.cat.setInteractive({ useHandCursor: true });
        this.cat.on('pointerdown', () => this.cleanCat());

        // Cooldown for cleaning
        this.canClean = true;

        // Hint text under cat
        this.add.text(W / 2, catY + 60, '\ud83d\udc46 Tap cat to clean!', {
            fontSize: '13px',
            color: '#8877aa',
            fontFamily: '"Poppins", sans-serif'
        }).setOrigin(0.5);

        // Decorative items around cat
        const decoY = catY + 20;
        this.add.image(W * 0.15, decoY, 'bed').setScale(1.8);
        this.add.image(W * 0.85, decoY, 'bowl').setScale(1.8);
        this.add.image(W / 2, decoY + 40, 'yarn').setScale(1.8);

        // === BUTTONS (bottom area) - rounded pill shape ===
        const btnY1 = H * 0.70;
        const btnY2 = btnY1 + 52;
        const btnY3 = btnY2 + 52;
        const btnW = 160;
        const btnH = 44;
        const btnRadius = 22;

        this.createPillButton(W * 0.25, btnY1, '\ud83d\udecf\ufe0f Sleep', () => this.sleep(), btnW, btnH, btnRadius, 0x9999dd);
        this.createPillButton(W * 0.75, btnY1, '\ud83c\udf57 Feed', () => this.feed(), btnW, btnH, btnRadius, 0xdd9999);
        this.createPillButton(W * 0.25, btnY2, '\ud83e\uddf6 Play', () => this.play(), btnW, btnH, btnRadius, 0xdd99dd);
        this.createPillButton(W * 0.75, btnY2, '\ud83d\udebf Bath', () => this.cleanCat(), btnW, btnH, btnRadius, 0x77bbdd);

        // === ADVENTURE BUTTON - round pastel world button at bottom right ===
        this.createAdventureButton(W - 55, H - 55);

        // Stats update loop
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => this.decayStats()
        });

        // Cat idle animation - gentle bob with a little squash
        this.tweens.add({
            targets: this.cat,
            y: catY - 8,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update() {
        // Drift clouds
        for (const cloud of this.clouds) {
            cloud.sprite.x += cloud.speed;
            if (cloud.sprite.x > this.scale.width + 50) {
                cloud.sprite.x = -50;
            }
        }

        // Float hearts
        this.hearts.children.each((heart) => {
            heart.y -= heart.speedY;
            heart.x += Math.sin(heart.time + heart.offset) * 0.5;
            heart.time += 0.05;
            heart.alpha -= 0.005;
            if (heart.alpha <= 0) {
                heart.destroy();
            }
        });

        const stats = this.registry.get('stats');
        this.updateBar('hunger', stats.hunger);
        this.updateBar('happiness', stats.happiness);
        this.updateBar('energy', stats.energy);
        this.updateBar('hygiene', stats.hygiene);

        const inv = this.registry.get('inventory');
        this.fishText.setText(`\ud83d\udc1f: ${inv.fish}`);
        this.toyText.setText(`\ud83e\uddf6: ${inv.toys}`);
    }

    spawnHeart() {
        const x = 80 + Math.random() * (this.scale.width - 160);
        const y = this.scale.height * 0.25 + Math.random() * 150;
        const heart = this.add.image(x, y, 'heart')
            .setScale(0.3 + Math.random() * 0.4)
            .setAlpha(0.7);
        heart.speedY = 0.3 + Math.random() * 0.5;
        heart.time = 0;
        heart.offset = Math.random() * 100;
        this.hearts.add(heart);
    }

    createCapsuleStatBar(labelX, labelY, label, key, color, barX, barWidth, barHeight) {
        const r = barHeight / 2;
        // Background capsule
        const bg = this.add.graphics();
        bg.fillStyle(0x333344, 1);
        this.drawCapsule(bg, barX, labelY - barHeight / 2, barWidth, barHeight, r);

        // Fill capsule
        const fill = this.add.graphics();
        fill.fillStyle(color, 1);
        this[`gfx_${key}`] = fill;
        this[`bar_${key}_x`] = barX;
        this[`bar_${key}_y`] = labelY;
        this[`bar_${key}_w`] = barWidth;
        this[`bar_${key}_h`] = barHeight;
        this[`bar_${key}_r`] = r;
        this[`bar_${key}_color`] = color;

        // Label
        this.add.text(labelX, labelY, label, {
            fontSize: '12px',
            color: '#777777',
            fontFamily: '"Poppins", sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
    }

    drawCapsule(gfx, x, y, w, h, r) {
        gfx.fillRoundedRect(x, y, w, h, r);
    }

    updateBar(key, value) {
        const fill = this[`gfx_${key}`];
        if (fill) {
            fill.clear();
            const x = this[`bar_${key}_x`];
            const y = this[`bar_${key}_y`];
            const w = this[`bar_${key}_w`];
            const h = this[`bar_${key}_h`];
            const r = this[`bar_${key}_r`];
            let color = this[`bar_${key}_color`];
            if (value < 30) color = 0xff4444;
            fill.fillStyle(color, 1);
            const fillW = Math.max(0, (value / 100) * w);
            if (fillW > 0) {
                fill.fillRoundedRect(x, y - h / 2, fillW, h, r);
            }
        }
    }

    createPillButton(x, y, text, callback, w, h, radius, color) {
        const btn = this.add.graphics();
        btn.fillStyle(color, 1);
        btn.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);
        btn.setInteractive(
            new Phaser.Geom.Rectangle(x - w / 2, y - h / 2, w, h),
            Phaser.Geom.Rectangle.Contains
        );
        btn.setScrollFactor(0);

        const lbl = this.add.text(x, y, text, {
            fontSize: '15px',
            color: '#ffffff',
            fontFamily: '"Poppins", sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Hover effect - brighten
        btn.on('pointerover', () => {
            btn.clear();
            const lighter = this.lightenColor(color, 0x222222);
            btn.fillStyle(lighter, 1);
            btn.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);
        });
        btn.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(color, 1);
            btn.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);
        });
        btn.on('pointerdown', callback);
    }

    lightenColor(color, amount) {
        const r = Math.min(255, ((color >> 16) & 0xFF) + ((amount >> 16) & 0xFF));
        const g = Math.min(255, ((color >> 8) & 0xFF) + ((amount >> 8) & 0xFF));
        const b = Math.min(255, (color & 0xFF) + (amount & 0xFF));
        return (r << 16) | (g << 8) | b;
    }

    createAdventureButton(x, y) {
        const radius = 45;

        // Main circle button
        const btn = this.add.circle(x, y, radius, 0xaaddcc, 1);
        btn.setStrokeStyle(3, 0xffffff, 0.5);
        btn.setInteractive(
            new Phaser.Geom.Circle(x, y, radius),
            Phaser.Geom.Circle.Contains
        );
        btn.setScrollFactor(0);

        // World icon
        const icon = this.add.text(x, y - 6, '\ud83c\udf0d', {
            fontSize: '22px',
            fontFamily: '"Poppins", sans-serif'
        }).setOrigin(0.5).setScrollFactor(0);

        // Adventure text below icon
        const lbl = this.add.text(x, y + 10, 'Adventure', {
            fontSize: '10px',
            color: '#ffffff',
            fontFamily: '"Poppins", sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);

        // Hover effect - brighten
        btn.on('pointerover', () => {
            btn.setFillStyle(0xbbeecc, 1);
        });
        btn.on('pointerout', () => {
            btn.setFillStyle(0xaaddcc, 1);
        });
        btn.on('pointerdown', () => {
            this.scene.start('PlatformerScene');
        });
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
            this.spawnBurst(this.cat.x, this.cat.y - 20, 'heart', 5);
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
            this.spawnBurst(this.cat.x, this.cat.y - 20, 'star', 6);

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
        this.spawnBurst(this.cat.x, this.cat.y - 30, 'star', 4);

        this.tweens.add({
            targets: this.cat,
            scaleX: this.cat.scaleX * 1.07,
            scaleY: this.cat.scaleY * 0.93,
            duration: 150,
            yoyo: true,
            repeat: 2
        });

        const sparkle = this.add.text(this.cat.x + 30, this.cat.y - 30, '\u2728', {
            fontSize: '22px',
            fontFamily: '"Poppins", sans-serif'
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

    spawnBurst(x, y, textureKey, count) {
        for (let i = 0; i < count; i++) {
            const p = this.add.image(x, y, textureKey)
                .setScale(0.4 + Math.random() * 0.3)
                .setAlpha(0.9);
            const angle = Math.random() * Math.PI * 2;
            const dist = 20 + Math.random() * 40;
            this.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist - 20,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: 600 + Math.random() * 400,
                ease: 'Power2',
                onComplete: () => p.destroy()
            });
        }
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
            fontFamily: '"Poppins", sans-serif',
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
