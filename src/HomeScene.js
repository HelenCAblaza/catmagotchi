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

        // Cozy room overlay: warm walls, wood floor, window, picture, and rug
        const room = this.add.graphics();
        room.setDepth(-1);
        room.fillStyle(0xfff6eb, 1);
        room.fillRect(0, 0, W, H * 0.67);
        room.fillStyle(0xf0d2b3, 1);
        room.fillRect(0, H * 0.67, W, H * 0.33);
        room.fillStyle(0xe4bb93, 1);
        room.fillRect(0, H * 0.665, W, 6);

        // Window
        room.fillStyle(0xbfe8ff, 1);
        room.fillRoundedRect(W * 0.66, 92, 126, 150, 12);
        room.fillStyle(0xeaf9ff, 0.85);
        room.fillRoundedRect(W * 0.66 + 8, 100, 110, 134, 10);
        room.fillStyle(0xffffff, 0.5);
        room.fillRect(W * 0.66 + 61, 100, 4, 134);
        room.fillRect(W * 0.66 + 8, 165, 110, 4);
        room.fillStyle(0xffd7c2, 1);
        room.fillRoundedRect(W * 0.64, 86, 20, 162, 8);
        room.fillRoundedRect(W * 0.80, 86, 20, 162, 8);

        // Picture frame on the wall
        room.fillStyle(0xd9b38c, 1);
        room.fillRoundedRect(54, 86, 92, 70, 10);
        room.fillStyle(0xffffff, 1);
        room.fillRoundedRect(60, 92, 80, 58, 8);
        room.fillStyle(0xffb8cc, 1);
        room.fillCircle(92, 120, 11);
        room.fillCircle(108, 114, 6);
        room.fillCircle(116, 125, 5);

        // Rug under the cat
        room.fillStyle(0xffe0d6, 0.95);
        room.fillEllipse(W / 2, H * 0.68 + 90, 260, 74);
        room.fillStyle(0xffc7d6, 0.45);
        room.fillEllipse(W / 2, H * 0.68 + 90, 170, 48);

        this.roomGlow = this.add.ellipse(W * 0.73, H * 0.43, 170, 170, 0xffe7bf, 0.20)
            .setDepth(-0.5);

        this.clouds = []; // kept for update() compatibility, but no clouds in the room

        // Floating hearts particles around the cat area
        this.hearts = this.add.group();
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => this.spawnHeart()
        });

        // Title - matching StartScene style
        this.add.text(W / 2, 52, 'Catmagotchi', {
            fontSize: '42px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            fontStyle: 'bold',
            stroke: '#ff88cc',
            strokeThickness: 3
        }).setOrigin(0.5).setShadow(0, 4, '#ff88cc88', 0, true, true);

        // Copyright watermark
        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '10px',
            color: '#887799',
            fontFamily: 'Poppins'
        }).setOrigin(0.5);

        // Cat name above stats - smaller, left aligned, no stars, darker grey
        this.add.text(40, 125, 'Mittens', {
            fontSize: '18px',
            color: '#555555',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // === STATS AREA ===
        const statY1 = 155;
        const statY2 = 191;
        const barW = 110;
        const barH = 14;
        const labelX = 40;     // aligned with buttons left edge
        const barX = 90;       // after labels

        this.createCapsuleStatBar(labelX, statY1, 'Hunger', 'hunger', 0xff7799, barX, barW, barH);
        this.createCapsuleStatBar(labelX, statY2, 'Energy', 'energy', 0x88dd88, barX, barW, barH);

        const rightLabelX = 223;
        const rightBarX = 265;
        this.createCapsuleStatBar(rightLabelX - 2, statY1, 'Happy', 'happiness', 0xffcc66, rightBarX, barW, barH);
        this.createCapsuleStatBar(rightLabelX, statY2, 'Clean', 'hygiene', 0x77ccff, rightBarX, barW, barH);

        // Inventory - aligned right with buttons right edge
        this.fishText = this.add.text(440, statY1, '\ud83d\udc1f: 0', {
            fontSize: '15px',
            color: '#cccccc',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        this.toyText = this.add.text(440, statY2, '\ud83e\uddf6: 0', {
            fontSize: '15px',
            color: '#cccccc',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        // === CAT AREA ===
        const catY = H * 0.53;
        this.cat = this.add.sprite(W / 2, catY, 'cat_idle');
        this.cat.setScale(3.0);

        // Cooldown for cleaning (via Bath button)
        this.canClean = true;

        // Decorative items around cat - separate movable sprites from PNG files
        this.catBed = this.add.image(W * 0.20, H * 0.66, 'cat_bed').setScale(1.35).setDepth(1);
        this.yarnToy = this.add.image(W * 0.80, H * 0.63, 'yarn_toy').setScale(1.15).setDepth(1);
        this.foodTray = this.add.image(W * 0.50, H * 0.59, 'food_tray').setScale(1.10).setDepth(1);

        // === BUTTONS (bottom area) - circle buttons in a single row ===
        const btnY = H * 0.78;
        const circleR = 32;
        const btnX1 = W * 0.14;
        const btnX2 = W * 0.38;
        const btnX3 = W * 0.62;
        const btnX4 = W * 0.86;

        this.createCircleButton(btnX1, btnY, '🛏️', 'Sleep', () => this.sleep(), circleR, 0xaabbee);
        this.createCircleButton(btnX2, btnY, '🍗', 'Feed', () => this.feed(), circleR, 0xdd9999);
        this.createCircleButton(btnX3, btnY, '🧶', 'Play', () => this.play(), circleR, 0xdd99dd);
        this.createCircleButton(btnX4, btnY, '🛁', 'Bath', () => this.cleanCat(), circleR, 0x77bbdd);

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
            fontFamily: 'Poppins',
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

    createCircleButton(x, y, icon, label, callback, radius, color) {
        const border = 2;
        const btn = this.add.graphics();
        const borderColor = this.darkenColor(color, 0x222222);
        // Crisp border using filled circle behind
        btn.fillStyle(borderColor, 1);
        btn.fillCircle(x, y, radius + border);
        btn.fillStyle(color, 1);
        btn.fillCircle(x, y, radius);
        btn.setInteractive(
            new Phaser.Geom.Circle(x, y, radius + border),
            Phaser.Geom.Circle.Contains
        );
        btn.setScrollFactor(0);

        // Emoji icon centered in circle
        const iconText = this.add.text(x, y - 2, icon, {
            fontSize: '24px',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Label below circle
        this.add.text(x, y + radius + 10, label, {
            fontSize: '11px',
            color: '#8888aa',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Hover effect - brighten
        btn.on('pointerover', () => {
            btn.clear();
            const lighter = this.lightenColor(color, 0x222222);
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(x, y, radius + border);
            btn.fillStyle(lighter, 1);
            btn.fillCircle(x, y, radius);
        });
        btn.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(x, y, radius + border);
            btn.fillStyle(color, 1);
            btn.fillCircle(x, y, radius);
        });
        btn.on('pointerdown', callback);
    }

    lightenColor(color, amount) {
        const r = Math.min(255, ((color >> 16) & 0xFF) + ((amount >> 16) & 0xFF));
        const g = Math.min(255, ((color >> 8) & 0xFF) + ((amount >> 8) & 0xFF));
        const b = Math.min(255, (color & 0xFF) + (amount & 0xFF));
        return (r << 16) | (g << 8) | b;
    }

    darkenColor(color, amount) {
        const r = Math.max(0, ((color >> 16) & 0xFF) - ((amount >> 16) & 0xFF));
        const g = Math.max(0, ((color >> 8) & 0xFF) - ((amount >> 8) & 0xFF));
        const b = Math.max(0, (color & 0xFF) - (amount & 0xFF));
        return (r << 16) | (g << 8) | b;
    }

    createAdventureButton(x, y) {
        const radius = 45;
        const size = radius * 2;
        const color = 0xaaddcc;
        const borderColor = this.darkenColor(color, 0x222222);
        const border = 2;

        const btn = this.add.graphics();
        btn.fillStyle(borderColor, 1);
        btn.fillCircle(0, 0, radius + border);
        btn.fillStyle(color, 1);
        btn.fillCircle(0, 0, radius);
        btn.setPosition(x, y);
        // Rectangle hit area that fully contains the circle
        btn.setInteractive(
            new Phaser.Geom.Rectangle(-radius - border, -radius - border, size + border * 2, size + border * 2),
            Phaser.Geom.Rectangle.Contains
        );
        btn.setScrollFactor(0);

        // World icon
        const icon = this.add.text(x, y - 6, '🌍', {
            fontSize: '24px',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0);

        // Adventure label - fresh text with Poppins
        this.add.text(x, y + 14, 'Adventure', {
            fontSize: '11px',
            color: '#8888aa',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);

        // Hover effect - brighten (redraw)
        btn.on('pointerover', () => {
            btn.clear();
            const lighter = this.lightenColor(color, 0x222222);
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(0, 0, radius + border);
            btn.fillStyle(lighter, 1);
            btn.fillCircle(0, 0, radius);
        });
        btn.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(0, 0, radius + border);
            btn.fillStyle(color, 1);
            btn.fillCircle(0, 0, radius);
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

        this.showFloatingText(this.cat.x, this.cat.y - 50, '\ud83e\uddfc Clean!');
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
            fontFamily: 'Poppins'
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
