class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // === Rich peach-pink 3D background ===
        const bg = this.add.graphics();

        // Soft gradient: warm peach at top to pink at bottom
        const canvas = this.textures.createCanvas('bg_gradient', W, H);
        const ctx = canvas.context;
        const grd = ctx.createLinearGradient(0, 0, 0, H);
        grd.addColorStop(0, '#fff5f0');
        grd.addColorStop(0.5, '#ffeeea');
        grd.addColorStop(1, '#ffe8e4');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
        canvas.refresh();
        this.add.image(W / 2, H / 2, 'bg_gradient').setDepth(-20);

        // Floating sparkle dots in background
        for (let i = 0; i < 20; i++) {
            const sx = 20 + Math.random() * (W - 40);
            const sy = 30 + Math.random() * (H * 0.9);
            const size = 1 + Math.random() * 2;
            const alpha = 0.3 + Math.random() * 0.4;
            bg.fillStyle(0xffffff, alpha);
            bg.fillCircle(sx, sy, size);
        }

        // Cute flower pots and tiny trees in corners
        // === Left flower pot ===
        const lpX = 30;
        const lpY = H * 0.78;
        // Pot shadow
        bg.fillStyle(0xcc9999, 0.3);
        bg.fillEllipse(lpX + 2, lpY + 2, 22, 8);
        // Pot body (terracotta)
        bg.fillStyle(0xdd8877, 1);
        bg.fillRoundedRect(lpX - 10, lpY - 14, 20, 18, 4);
        bg.fillStyle(0xcc7766, 1);
        bg.fillRoundedRect(lpX - 10, lpY - 14, 20, 6, { tl: 4, tr: 4, bl: 0, br: 0 });
        // Soil
        bg.fillStyle(0x665544, 1);
        bg.fillRect(lpX - 8, lpY - 16, 16, 4);
        // Stem
        bg.fillStyle(0x88bb88, 1);
        bg.fillRect(lpX - 1, lpY - 28, 2, 14);
        // Leaves
        bg.fillCircle(lpX - 4, lpY - 26, 3);
        bg.fillCircle(lpX + 4, lpY - 24, 3);
        // Pink flower
        bg.fillStyle(0xff99bb, 1);
        bg.fillCircle(lpX, lpY - 32, 4);
        bg.fillStyle(0xffeeaa, 1);
        bg.fillCircle(lpX, lpY - 32, 2);

        // === Left tiny tree ===
        const ltX = 58;
        const ltY = H * 0.82;
        // Pot
        bg.fillStyle(0xcc9999, 0.3);
        bg.fillEllipse(ltX + 2, ltY + 2, 18, 6);
        bg.fillStyle(0xbbaadd, 1);
        bg.fillRoundedRect(ltX - 8, ltY - 10, 16, 14, 3);
        // Trunk
        bg.fillStyle(0x997755, 1);
        bg.fillRect(ltX - 2, ltY - 24, 4, 16);
        // Tree top (round)
        bg.fillStyle(0x88cc88, 1);
        bg.fillCircle(ltX, ltY - 30, 10);
        bg.fillStyle(0xaaddaa, 1);
        bg.fillCircle(ltX - 3, ltY - 33, 5);
        bg.fillCircle(ltX + 4, ltY - 32, 4);
        // Tiny apple
        bg.fillStyle(0xff6666, 1);
        bg.fillCircle(ltX + 5, ltY - 28, 2);

        // === Right flower pot ===
        const rpX = W - 50;
        const rpY = H * 0.76;
        // Shadow
        bg.fillStyle(0xcc9999, 0.3);
        bg.fillEllipse(rpX + 2, rpY + 2, 24, 8);
        // Pot (mint green)
        bg.fillStyle(0x88ccaa, 1);
        bg.fillRoundedRect(rpX - 11, rpY - 14, 22, 18, 4);
        bg.fillStyle(0x77bb99, 1);
        bg.fillRoundedRect(rpX - 11, rpY - 14, 22, 6, { tl: 4, tr: 4, bl: 0, br: 0 });
        // Soil
        bg.fillStyle(0x665544, 1);
        bg.fillRect(rpX - 9, rpY - 16, 18, 4);
        // Stems
        bg.fillStyle(0x88bb88, 1);
        bg.fillRect(rpX - 3, rpY - 26, 2, 12);
        bg.fillRect(rpX + 2, rpY - 24, 2, 10);
        // Leaves
        bg.fillCircle(rpX - 6, rpY - 22, 3);
        bg.fillCircle(rpX + 5, rpY - 20, 3);
        // Lavender flowers
        bg.fillStyle(0xcc99ff, 1);
        bg.fillCircle(rpX - 3, rpY - 30, 3);
        bg.fillCircle(rpX + 2, rpY - 28, 3);
        bg.fillStyle(0xffeeff, 1);
        bg.fillCircle(rpX - 3, rpY - 30, 1);
        bg.fillCircle(rpX + 2, rpY - 28, 1);

        // === Right tiny tree ===
        const rtX = W - 24;
        const rtY = H * 0.80;
        // Pot
        bg.fillStyle(0xcc9999, 0.3);
        bg.fillEllipse(rtX + 2, rtY + 2, 16, 6);
        bg.fillStyle(0xffcc88, 1);
        bg.fillRoundedRect(rtX - 7, rtY - 10, 14, 14, 3);
        // Trunk
        bg.fillStyle(0x997755, 1);
        bg.fillRect(rtX - 2, rtY - 22, 4, 14);
        // Tree top (pointy/pine style)
        bg.fillStyle(0x66aa88, 1);
        bg.fillTriangle(rtX, rtY - 38, rtX - 10, rtY - 22, rtX + 10, rtY - 22);
        bg.fillStyle(0x88ccaa, 1);
        bg.fillTriangle(rtX, rtY - 34, rtX - 7, rtY - 24, rtX + 7, rtY - 24);

        // Decorative floating clouds
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.image(
                60 + Math.random() * (W - 120),
                40 + Math.random() * (H * 0.3),
                'cloud'
            )
                .setScale(0.5 + Math.random() * 0.6)
                .setAlpha(0.3 + Math.random() * 0.3)
                .setDepth(-1);

            this.tweens.add({
                targets: cloud,
                x: cloud.x + 20 + Math.random() * 30,
                duration: 3000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Title with glow
        this.add.text(W / 2, H * 0.22, '\u2728 Catmagotchi \u2728', {
            fontSize: '42px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            fontStyle: 'bold',
            stroke: '#ff88aa',
            strokeThickness: 3
        }).setOrigin(0.5).setShadow(0, 4, '#ff88aa88', 0, true, true);

        // Cat sprite (large, centered) - uses real pixel-art PNG!
        const cat = this.add.sprite(W / 2, H * 0.42, 'cat_idle')
            .setScale(3)
            .setOrigin(0.5);

        // Gentle bob animation
        this.tweens.add({
            targets: cat,
            y: H * 0.42 - 12,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Cat name
        this.add.text(W / 2, H * 0.58, '\u2606 Meet Mittens \u2606', {
            fontSize: '20px',
            color: '#dd6677',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Floating hearts around cat
        this.hearts = this.add.group();
        this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => this.spawnHeart()
        });

        // === 3D Start Button ===
        const btnW = 200;
        const btnH = 54;
        const btnDepth = 8;
        const btnY = H * 0.72;
        const btnX = W / 2;

        const btnShadow = this.add.graphics();
        const btnBg = this.add.graphics();
        const btnFace = this.add.graphics();

        // Draw full 3D button
        const draw3DButton = (bg, face, shadow, baseColor, hover) => {
            shadow.clear();
            bg.clear();
            face.clear();

            const r = btnH / 2;
            const lift = hover ? -3 : 0;
            const shadowAlpha = hover ? 0.2 : 0.35;

            // Drop shadow (offset down-right)
            shadow.fillStyle(0x884455, shadowAlpha);
            shadow.fillRoundedRect(btnX - btnW / 2 + 4, btnY - btnH / 2 + btnDepth + 4 + lift, btnW, btnH, r);

            // Button thickness (side face)
            const darker = 0xee6699;
            face.fillStyle(darker, 1);
            face.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2 + btnDepth + lift, btnW, btnH, r);
            // Cut off top half of thickness so only bottom edge shows
            face.fillStyle(baseColor, 1);
            face.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2 + lift, btnW, btnH - 2, r);

            // Main button face
            bg.fillStyle(baseColor, 1);
            bg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2 + lift, btnW, btnH, r);

            // Top highlight (glossy 3D feel)
            bg.fillStyle(0xffffff, 0.35);
            bg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2 + lift, btnW, r, { tl: r, tr: r, bl: 0, br: 0 });

            // Bottom shadow edge
            bg.fillStyle(0x000000, 0.08);
            bg.fillRoundedRect(btnX - btnW / 2, btnY + btnH / 2 - 6 + lift, btnW, 6, { tl: 0, tr: 0, bl: r, br: r });
        };

        draw3DButton(btnBg, btnFace, btnShadow, 0xff88bb, false);

        // Button text
        const btnText = this.add.text(btnX, btnY, '\ud83d\udc3e Start Game!', {
            fontSize: '22px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Invisible interactive hit area over the button
        const hitArea = this.add.rectangle(btnX, btnY, btnW + 20, btnH + btnDepth + 20, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        // Hover effect - lift up and brighten
        hitArea.on('pointerover', () => {
            draw3DButton(btnBg, btnFace, btnShadow, 0xffaacc, true);
            btnText.setScale(1.05);
            btnText.y = btnY - 3;
        });

        hitArea.on('pointerout', () => {
            draw3DButton(btnBg, btnFace, btnShadow, 0xff88bb, false);
            btnText.setScale(1);
            btnText.y = btnY;
        });

        hitArea.on('pointerdown', () => {
            // Press down effect
            draw3DButton(btnBg, btnFace, btnShadow, 0xff6699, false);
            btnText.setScale(0.95);
            btnText.y = btnY + 2;
            this.tweens.add({
                targets: [cat, btnText],
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.cameras.main.fadeOut(400, 245, 230, 255);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('HomeScene');
                    });
                }
            });
        });

        // Hint text
        this.add.text(W / 2, H - 40, 'Tap Start to begin your adventure \u2764\ufe0f', {
            fontSize: '13px',
            color: '#cc8899',
            fontFamily: 'Poppins'
        }).setOrigin(0.5);

        // Copyright
        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '10px',
            color: '#aa8899',
            fontFamily: 'Poppins'
        }).setOrigin(0.5);
    }

    update() {
        // Float hearts
        this.hearts.children.each((heart) => {
            heart.y -= heart.speedY;
            heart.alpha -= 0.006;
            if (heart.alpha <= 0) {
                heart.destroy();
            }
        });
    }

    spawnHeart() {
        const x = 80 + Math.random() * (this.scale.width - 160);
        const y = this.scale.height * 0.35 + Math.random() * 120;
        const heart = this.add.image(x, y, 'heart')
            .setScale(0.3 + Math.random() * 0.3)
            .setAlpha(0.7);
        heart.speedY = 0.3 + Math.random() * 0.5;
        this.hearts.add(heart);
    }

    drawPill(gfx, x, y, w, h, r) {
        gfx.fillRoundedRect(x, y, w, h, r);
    }

    drawCuteCube(gfx, x, y, size, color) {
        // 3D cube with top highlight and right shadow
        const topH = size * 0.35;
        const sideW = size * 0.3;

        // Top face (lightest)
        gfx.fillStyle(0xffffff, 0.6);
        gfx.fillRect(x - size / 2 + 2, y - size - topH + 2, size, topH);
        gfx.fillStyle(color, 1);
        gfx.fillRect(x - size / 2, y - size - topH, size, topH);
        // Top highlight
        gfx.fillStyle(0xffffff, 0.5);
        gfx.fillRect(x - size / 2, y - size - topH, size, 2);

        // Front face
        gfx.fillStyle(color, 1);
        gfx.fillRect(x - size / 2, y - size, size, size);
        // Front highlight (left edge)
        gfx.fillStyle(0xffffff, 0.3);
        gfx.fillRect(x - size / 2, y - size, 3, size);
        // Front shadow (right edge)
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        const darker = ((r * 0.8) << 16) | ((g * 0.8) << 8) | (b * 0.8);
        gfx.fillStyle(darker, 1);
        gfx.fillRect(x + size / 2 - 4, y - size, 4, size);

        // Right face (darker for depth)
        gfx.fillStyle(darker, 1);
        gfx.fillRect(x + size / 2, y - size + topH, sideW, size - topH);
    }
}
