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
        grd.addColorStop(0, '#ffe8e0');
        grd.addColorStop(0.5, '#ffd4cc');
        grd.addColorStop(1, '#ffc4c4');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
        canvas.refresh();
        this.add.image(W / 2, H / 2, 'bg_gradient').setDepth(-20);

        // 3D stage floor (cute platform for cat)
        const stageW = 240;
        const stageH = 40;
        const stageX = W / 2 - stageW / 2;
        const stageY = H * 0.52;

        // Stage shadow (depth)
        bg.fillStyle(0xcc9999, 0.3);
        bg.fillRoundedRect(stageX + 8, stageY + 6, stageW, stageH, 12);
        // Stage top (lit surface)
        bg.fillStyle(0xffeeee, 1);
        bg.fillRoundedRect(stageX, stageY, stageW, stageH, 12);
        // Stage highlight edge
        bg.fillStyle(0xffffff, 0.6);
        bg.fillRoundedRect(stageX, stageY, stageW, 6, { tl: 12, tr: 12, bl: 0, br: 0 });
        // Stage front face (3D thickness)
        bg.fillStyle(0xffcccc, 1);
        bg.fillRoundedRect(stageX, stageY + stageH - 8, stageW, 10, { tl: 0, tr: 0, bl: 12, br: 12 });

        // Decorative archway frame (cute border around the stage area)
        const archX = W / 2 - 130;
        const archY = H * 0.12;
        const archW = 260;
        const archH = 340;
        const archThick = 8;

        // Outer arch shadow
        bg.fillStyle(0xe0b0a8, 0.5);
        bg.fillRoundedRect(archX + 4, archY + 4, archW, archH, archThick);
        // Inner arch (peach-white)
        bg.fillStyle(0xfff5f0, 0.85);
        bg.fillRoundedRect(archX, archY, archW, archH, archThick);
        // Arch highlight
        bg.fillStyle(0xffffff, 0.7);
        bg.fillRoundedRect(archX, archY, archW, 6, { tl: archThick, tr: archThick, bl: 0, br: 0 });

        // Tiny decorative flowers along the arch bottom
        const flowerColors = [0xff88aa, 0xffaa88, 0xffccaa, 0xffaacc];
        for (let i = 0; i < 5; i++) {
            const fx = archX + 30 + i * 50;
            const fy = archY + archH - 12;
            bg.fillStyle(0x88cc88, 1);
            bg.fillRect(fx - 1, fy - 6, 2, 8);
            bg.fillStyle(flowerColors[i % flowerColors.length], 1);
            bg.fillCircle(fx, fy - 8, 4);
            bg.fillStyle(0xffeeaa, 1);
            bg.fillCircle(fx, fy - 8, 2);
        }

        // Floating sparkle dots in background
        for (let i = 0; i < 20; i++) {
            const sx = 20 + Math.random() * (W - 40);
            const sy = 30 + Math.random() * (H * 0.9);
            const size = 1 + Math.random() * 2;
            const alpha = 0.3 + Math.random() * 0.4;
            bg.fillStyle(0xffffff, alpha);
            bg.fillCircle(sx, sy, size);
        }

        // Small 3D cubes (decorative blocks) in corners
        // Left cube
        this.drawCuteCube(bg, 35, H * 0.78, 18, 0xffb8c8);
        this.drawCuteCube(bg, 60, H * 0.82, 14, 0xffd0b8);
        // Right cube
        this.drawCuteCube(bg, W - 50, H * 0.76, 20, 0xffc8d0);
        this.drawCuteCube(bg, W - 25, H * 0.80, 15, 0xffd8c8);

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

        // Cute Start button (pill shape)
        const btnW = 200;
        const btnH = 56;
        const btnY = H * 0.72;

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0xff88cc, 1);
        this.drawPill(btnBg, W / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, btnH / 2);

        // Button text
        const btnText = this.add.text(W / 2, btnY, '\ud83d\udc3e Start Game!', {
            fontSize: '22px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Invisible interactive hit area over the button
        const hitArea = this.add.rectangle(W / 2, btnY, btnW + 20, btnH + 20, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        // Hover effect
        hitArea.on('pointerover', () => {
            btnBg.clear();
            btnBg.fillStyle(0xffaadd, 1);
            this.drawPill(btnBg, W / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, btnH / 2);
            btnText.setScale(1.05);
        });

        hitArea.on('pointerout', () => {
            btnBg.clear();
            btnBg.fillStyle(0xff88cc, 1);
            this.drawPill(btnBg, W / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, btnH / 2);
            btnText.setScale(1);
        });

        hitArea.on('pointerdown', () => {
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
