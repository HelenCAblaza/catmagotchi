class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // === Rich peach-pink 3D background ===
        const bg = this.add.graphics();

        // Soft gradient: warm peach at top to pink at bottom (ombre, not too bright)
        const canvas = this.textures.createCanvas('bg_gradient', W, H);
        const ctx = canvas.context;
        const grd = ctx.createLinearGradient(0, 0, 0, H);
        grd.addColorStop(0, '#ffeae4');
        grd.addColorStop(0.5, '#ffdcd4');
        grd.addColorStop(1, '#ffcec4');
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

        // === Helper: draw 3D flower pot ===
        const drawFlowerPot = (gfx, x, y, potColor, flowerColor, size = 1) => {
            const pw = 22 * size;  // narrower pot
            const ph = 16 * size;  // shorter pot
            const pr = 4 * size;
            const rimH = 5 * size;
            // darker shade for 3D
            const r = (potColor >> 16) & 0xff;
            const g = (potColor >> 8) & 0xff;
            const b = potColor & 0xff;
            const darker = ((Math.floor(r * 0.75)) << 16) | ((Math.floor(g * 0.75)) << 8) | (Math.floor(b * 0.75));
            const lighter = ((Math.min(255, Math.floor(r * 1.2))) << 16) | ((Math.min(255, Math.floor(g * 1.2))) << 8) | (Math.min(255, Math.floor(b * 1.2)));

            // Shadow
            gfx.fillStyle(0xcc9999, 0.35);
            gfx.fillEllipse(x + 3, y + 3, pw + 4, 8 * size);

            // Pot body (front face)
            gfx.fillStyle(potColor, 1);
            gfx.fillRoundedRect(x - pw / 2, y - ph, pw, ph, pr);
            // Left highlight
            gfx.fillStyle(lighter, 0.5);
            gfx.fillRoundedRect(x - pw / 2, y - ph, 4 * size, ph, { tl: pr, tr: 0, bl: pr, br: 0 });
            // Right shadow edge
            gfx.fillStyle(darker, 0.6);
            gfx.fillRoundedRect(x + pw / 2 - 4 * size, y - ph, 4 * size, ph, { tl: 0, tr: pr, bl: 0, br: pr });

            // Pot rim (top, slightly wider)
            gfx.fillStyle(lighter, 1);
            gfx.fillRoundedRect(x - pw / 2 - 2 * size, y - ph - rimH, pw + 4 * size, rimH, 3 * size);
            gfx.fillStyle(potColor, 1);
            gfx.fillRoundedRect(x - pw / 2 - 2 * size, y - ph - rimH + 2 * size, pw + 4 * size, rimH - 2 * size, 3 * size);

            // Soil
            gfx.fillStyle(0x5a4a3a, 1);
            gfx.fillRoundedRect(x - pw / 2 + 3 * size, y - ph - 2 * size, pw - 6 * size, 4 * size, 2 * size);

            // Stem (taller since pot is shorter)
            gfx.fillStyle(0x77aa77, 1);
            gfx.fillRect(x - 1.5 * size, y - ph - 22 * size, 3 * size, 24 * size);

            // Leaves
            gfx.fillStyle(0x88bb88, 1);
            gfx.fillCircle(x - 6 * size, y - ph - 14 * size, 4 * size);
            gfx.fillCircle(x + 6 * size, y - ph - 12 * size, 4 * size);
            gfx.fillStyle(0x99cc99, 1);
            gfx.fillCircle(x - 5 * size, y - ph - 15 * size, 2 * size);
            gfx.fillCircle(x + 7 * size, y - ph - 13 * size, 2 * size);

            // Flower bloom (higher up since pot is shorter)
            gfx.fillStyle(flowerColor, 1);
            gfx.fillCircle(x, y - ph - 28 * size, 6 * size);
            gfx.fillCircle(x - 5 * size, y - ph - 26 * size, 4 * size);
            gfx.fillCircle(x + 5 * size, y - ph - 26 * size, 4 * size);
            gfx.fillCircle(x - 3 * size, y - ph - 32 * size, 4 * size);
            gfx.fillCircle(x + 3 * size, y - ph - 32 * size, 4 * size);
            // Center
            gfx.fillStyle(0xffeeaa, 1);
            gfx.fillCircle(x, y - ph - 28 * size, 3 * size);
        };

        // === Helper: draw 3D tree in pot ===
        const drawTreePot = (gfx, x, y, potColor, treeType = 'round', size = 1) => {
            const pw = 26 * size;
            const ph = 20 * size;
            const pr = 4 * size;
            const rimH = 5 * size;
            const r = (potColor >> 16) & 0xff;
            const g = (potColor >> 8) & 0xff;
            const b = potColor & 0xff;
            const darker = ((Math.floor(r * 0.75)) << 16) | ((Math.floor(g * 0.75)) << 8) | (Math.floor(b * 0.75));
            const lighter = ((Math.min(255, Math.floor(r * 1.2))) << 16) | ((Math.min(255, Math.floor(g * 1.2))) << 8) | (Math.min(255, Math.floor(b * 1.2)));

            // Shadow
            gfx.fillStyle(0xcc9999, 0.35);
            gfx.fillEllipse(x + 3, y + 3, pw + 4, 9 * size);

            // Pot body
            gfx.fillStyle(potColor, 1);
            gfx.fillRoundedRect(x - pw / 2, y - ph, pw, ph, pr);
            gfx.fillStyle(lighter, 0.5);
            gfx.fillRoundedRect(x - pw / 2, y - ph, 4 * size, ph, { tl: pr, tr: 0, bl: pr, br: 0 });
            gfx.fillStyle(darker, 0.6);
            gfx.fillRoundedRect(x + pw / 2 - 4 * size, y - ph, 4 * size, ph, { tl: 0, tr: pr, bl: 0, br: pr });

            // Rim
            gfx.fillStyle(lighter, 1);
            gfx.fillRoundedRect(x - pw / 2 - 2 * size, y - ph - rimH, pw + 4 * size, rimH, 3 * size);
            gfx.fillStyle(potColor, 1);
            gfx.fillRoundedRect(x - pw / 2 - 2 * size, y - ph - rimH + 2 * size, pw + 4 * size, rimH - 2 * size, 3 * size);

            // Soil
            gfx.fillStyle(0x5a4a3a, 1);
            gfx.fillRoundedRect(x - pw / 2 + 3 * size, y - ph - 2 * size, pw - 6 * size, 5 * size, 2 * size);

            // Trunk
            gfx.fillStyle(0x8a6e4b, 1);
            gfx.fillRect(x - 2.5 * size, y - ph - 18 * size, 5 * size, 20 * size);
            gfx.fillStyle(0x997755, 1);
            gfx.fillRect(x - 1.5 * size, y - ph - 18 * size, 2 * size, 20 * size);

            if (treeType === 'round') {
                // Round leafy canopy
                gfx.fillStyle(0x66aa77, 1);
                gfx.fillCircle(x, y - ph - 30 * size, 14 * size);
                gfx.fillStyle(0x88cc99, 1);
                gfx.fillCircle(x - 5 * size, y - ph - 34 * size, 8 * size);
                gfx.fillCircle(x + 6 * size, y - ph - 32 * size, 7 * size);
                gfx.fillStyle(0xaaddaa, 1);
                gfx.fillCircle(x - 2 * size, y - ph - 38 * size, 5 * size);
                // Tiny fruit
                gfx.fillStyle(0xff8888, 1);
                gfx.fillCircle(x + 8 * size, y - ph - 28 * size, 3 * size);
                gfx.fillStyle(0xffcccc, 1);
                gfx.fillCircle(x + 8 * size, y - ph - 28 * size, 1.5 * size);
            } else if (treeType === 'pine') {
                // Fluffy pine tree — rounded, organic layers instead of sharp triangles
                const topY = y - ph - 46 * size;
                const baseY = y - ph - 18 * size;

                // Wide bottom layer (dark)
                gfx.fillStyle(0x448866, 1);
                gfx.fillCircle(x, baseY, 14 * size);
                gfx.fillCircle(x - 10 * size, baseY - 2 * size, 10 * size);
                gfx.fillCircle(x + 10 * size, baseY - 2 * size, 10 * size);
                gfx.fillCircle(x - 6 * size, baseY - 8 * size, 9 * size);
                gfx.fillCircle(x + 6 * size, baseY - 8 * size, 9 * size);

                // Middle layer (medium)
                gfx.fillStyle(0x66aa88, 1);
                gfx.fillCircle(x, baseY - 12 * size, 12 * size);
                gfx.fillCircle(x - 8 * size, baseY - 16 * size, 9 * size);
                gfx.fillCircle(x + 8 * size, baseY - 16 * size, 9 * size);
                gfx.fillCircle(x - 4 * size, baseY - 20 * size, 8 * size);
                gfx.fillCircle(x + 4 * size, baseY - 20 * size, 8 * size);

                // Top layer (light)
                gfx.fillStyle(0x88ccaa, 1);
                gfx.fillCircle(x, baseY - 24 * size, 10 * size);
                gfx.fillCircle(x - 6 * size, baseY - 28 * size, 7 * size);
                gfx.fillCircle(x + 6 * size, baseY - 28 * size, 7 * size);
                gfx.fillCircle(x, baseY - 32 * size, 7 * size);

                // Tiny tip
                gfx.fillStyle(0xaaddbb, 1);
                gfx.fillCircle(x, topY + 6 * size, 5 * size);
            } else if (treeType === 'bush') {
                // Bushy round tree
                gfx.fillStyle(0x559977, 1);
                gfx.fillCircle(x, y - ph - 28 * size, 12 * size);
                gfx.fillCircle(x - 8 * size, y - ph - 26 * size, 9 * size);
                gfx.fillCircle(x + 8 * size, y - ph - 26 * size, 9 * size);
                gfx.fillStyle(0x77bb99, 1);
                gfx.fillCircle(x - 4 * size, y - ph - 32 * size, 6 * size);
                gfx.fillCircle(x + 5 * size, y - ph - 30 * size, 5 * size);
            }
        };

        // === Place decorations around the scene ===
        // Left side cluster
        drawFlowerPot(bg, 34, H * 0.75, 0xdd8877, 0xff99bb, 1.7);
        drawTreePot(bg, 82, H * 0.82, 0xbbaadd, 'round', 0.9);
        drawTreePot(bg, 22, H * 0.88, 0x88ccaa, 'pine', 0.9);

        // Far left small accent
        drawFlowerPot(bg, 58, H * 0.92, 0xffcc88, 0xffaa88, 0.8);

        // Right side cluster
        drawTreePot(bg, W - 30, H * 0.74, 0xffcc88, 'pine', 1.2);
        drawFlowerPot(bg, W - 65, H * 0.79, 0x88ccaa, 0xcc99ff, 1.1);
        drawTreePot(bg, W - 18, H * 0.86, 0xbbaadd, 'bush', 0.9);

        // Far right small accent
        drawFlowerPot(bg, W - 48, H * 0.92, 0xffaacc, 0xffdd88, 0.8);

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
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            fontStyle: 'bold',
            stroke: '#ee5588',
            strokeThickness: 5,
            padding: { top: 6, bottom: 18, left: 6, right: 6 }
        }).setOrigin(0.5).setShadow(0, 5, '#dd6688aa', 2, true, true);

        // Cat sprite (large, centered) - uses real pixel-art PNG!
        const cat = this.add.sprite(W / 2, H * 0.52, 'cat_idle')
            .setScale(3.15)
            .setOrigin(0.5);

        // Gentle bob animation
        this.tweens.add({
            targets: cat,
            y: H * 0.52 - 12,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Cat name
        this.add.text(W / 2, H * 0.70, 'Meet Mitten', {
            fontSize: '20px',
            color: '#ee8899',
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

        // === 3D Ombre Start Button ===
        const btnW = 200;
        const btnH = 56;
        const btnDepth = 10;
        const btnY = H * 0.78;
        const btnX = W / 2;
        const btnR = btnH / 2;

        // Create ombre gradient textures
        const createOmbreBtn = (key, topColor, botColor) => {
            const canvas = this.textures.createCanvas(key, btnW, btnH);
            const ctx = canvas.context;
            const grd = ctx.createLinearGradient(0, 0, 0, btnH);
            grd.addColorStop(0, topColor);
            grd.addColorStop(1, botColor);
            ctx.fillStyle = grd;
            const r = btnR;
            ctx.beginPath();
            ctx.moveTo(r, 0);
            ctx.lineTo(btnW - r, 0);
            ctx.arcTo(btnW, 0, btnW, r, r);
            ctx.lineTo(btnW, btnH - r);
            ctx.arcTo(btnW, btnH, btnW - r, btnH, r);
            ctx.lineTo(r, btnH);
            ctx.arcTo(0, btnH, 0, btnH - r, r);
            ctx.lineTo(0, r);
            ctx.arcTo(0, 0, r, 0, r);
            ctx.closePath();
            ctx.fill();
            canvas.refresh();
        };

        createOmbreBtn('btn_normal', '#ffccdd', '#ff6699');
        createOmbreBtn('btn_hover', '#ffddee', '#ff88bb');
        createOmbreBtn('btn_press', '#ff99bb', '#ff4488');

        const btnShadow = this.add.graphics();
        const btnBevel = this.add.graphics();

        const btnFaceNormal = this.add.image(btnX, btnY, 'btn_normal').setOrigin(0.5);
        const btnFaceHover = this.add.image(btnX, btnY, 'btn_hover').setOrigin(0.5).setVisible(false);
        const btnFacePress = this.add.image(btnX, btnY, 'btn_press').setOrigin(0.5).setVisible(false);
        const btnFaces = [btnFaceNormal, btnFaceHover, btnFacePress];

        const drawButtonEffects = (lift, shadowAlpha, state) => {
            btnShadow.clear();
            btnBevel.clear();

            btnFaceNormal.setVisible(state === 'normal');
            btnFaceHover.setVisible(state === 'hover');
            btnFacePress.setVisible(state === 'press');

            for (const face of btnFaces) {
                face.y = btnY + lift;
            }

            // Soft drop shadow
            btnShadow.fillStyle(0xddaaaa, shadowAlpha);
            btnShadow.fillRoundedRect(btnX - btnW / 2 + 6, btnY - btnH / 2 + btnDepth + 6 + lift, btnW, btnH, btnR);
            btnShadow.fillStyle(0xddaaaa, shadowAlpha * 0.5);
            btnShadow.fillRoundedRect(btnX - btnW / 2 + 10, btnY - btnH / 2 + btnDepth + 10 + lift, btnW, btnH, btnR);

            // Bottom thickness face
            btnShadow.fillStyle(0xff99bb, 1);
            btnShadow.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2 + btnDepth + lift, btnW, btnH, btnR);

            // Bevel highlight
            btnBevel.fillStyle(0xffffff, 0.45);
            btnBevel.fillRoundedRect(btnX - btnW / 2 + 2, btnY - btnH / 2 + lift + 2, btnW - 4, btnR - 2, { tl: btnR - 2, tr: btnR - 2, bl: 0, br: 0 });

            // Bottom shadow bevel
            btnBevel.fillStyle(0x000000, 0.12);
            btnBevel.fillRoundedRect(btnX - btnW / 2 + 2, btnY + btnH / 2 - btnR + 2 + lift, btnW - 4, btnR - 2, { tl: 0, tr: 0, bl: btnR - 2, br: btnR - 2 });

            // Specular spot
            btnBevel.fillStyle(0xffffff, 0.25);
            btnBevel.fillEllipse(btnX - btnW / 2 + 30, btnY - btnH / 2 + lift + 10, 40, 12);
        };

        drawButtonEffects(0, 0.4, 'normal');

        // Button text - no paw emoji, clear with stroke
        const btnText = this.add.text(btnX, btnY, 'Start Game!', {
            fontSize: '22px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            fontStyle: 'bold',
            stroke: '#cc4466',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Invisible interactive hit area
        const hitArea = this.add.rectangle(btnX, btnY, btnW + 20, btnH + btnDepth + 20, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            drawButtonEffects(-4, 0.15, 'hover');
            btnText.setScale(1.05);
            btnText.y = btnY - 4;
        });

        hitArea.on('pointerout', () => {
            drawButtonEffects(0, 0.4, 'normal');
            btnText.setScale(1);
            btnText.y = btnY;
        });

        hitArea.on('pointerdown', () => {
            drawButtonEffects(0, 0.4, 'press');
            btnText.setScale(0.95);
            btnText.y = btnY + 3;
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

        // === Floating tiny star pixels around button ===
        this.starPixels = this.add.group();
        this.time.addEvent({
            delay: 600,
            loop: true,
            callback: () => {
                const sx = btnX - 80 + Math.random() * 160;
                const sy = btnY - 30 - Math.random() * 20;
                const size = 1 + Math.random() * 1.5;
                const alpha = 0.5 + Math.random() * 0.5;

                const star = this.add.graphics();
                const col = Math.random() > 0.5 ? 0xffffff : 0xffeecc;
                star.fillStyle(col, 1);
                // Tiny 4-point star centered at origin
                star.fillRect(-size, -size, size * 2, size * 2);
                star.fillRect(-size * 2, -size * 0.5, size * 4, size);
                star.fillRect(-size * 0.5, -size * 2, size, size * 4);

                star.setPosition(sx, sy);
                star.setAlpha(alpha);
                star.speedY = 0.4 + Math.random() * 0.6;
                star.wobble = Math.random() * Math.PI * 2;
                star.baseX = sx;
                this.starPixels.add(star);
            }
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

        // Float tiny star pixels from button
        this.starPixels.children.each((star) => {
            star.y -= star.speedY;
            const offsetX = Math.sin(star.wobble) * 0.5;
            star.x = star.baseX + offsetX;
            star.wobble += 0.05;
            star.alpha -= 0.008;
            if (star.alpha <= 0) {
                star.destroy();
            }
        });
    }

    spawnHeart() {
        const x = 80 + Math.random() * (this.scale.width - 160);
        const y = this.scale.height * 0.45 + Math.random() * 120;
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
