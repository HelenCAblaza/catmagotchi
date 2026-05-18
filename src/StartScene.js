class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Generate textures needed for start screen
        this.createCatTexture('cat_idle', '#ff8c42');
        this.createHeartTexture('heart');
        this.createCloudTexture('cloud');
    }

    createCatTexture(key, color) {
        const w = 32, h = 32;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        const baseColor = parseInt(color.replace('#', '0x'));

        gfx.fillStyle(baseColor, 1);
        gfx.fillRoundedRect(w * 0.2, h * 0.35, w * 0.6, h * 0.45, 8);
        gfx.fillCircle(w * 0.5, h * 0.28, w * 0.28);
        gfx.fillStyle(baseColor, 1);
        gfx.fillTriangle(w * 0.25, h * 0.15, w * 0.38, h * 0.30, w * 0.22, h * 0.32);
        gfx.fillTriangle(w * 0.75, h * 0.15, w * 0.62, h * 0.30, w * 0.78, h * 0.32);
        gfx.fillStyle(0xffaacc, 1);
        gfx.fillTriangle(w * 0.27, h * 0.18, w * 0.36, h * 0.28, w * 0.25, h * 0.30);
        gfx.fillTriangle(w * 0.73, h * 0.18, w * 0.64, h * 0.28, w * 0.75, h * 0.30);
        gfx.fillStyle(baseColor, 1);
        gfx.fillEllipse(w * 0.82, h * 0.55, w * 0.12, h * 0.35);
        gfx.fillStyle(0xffffff, 1);
        gfx.fillCircle(w * 0.40, h * 0.26, 5);
        gfx.fillCircle(w * 0.60, h * 0.26, 5);
        gfx.fillStyle(0x000000, 1);
        gfx.fillCircle(w * 0.41, h * 0.27, 3);
        gfx.fillCircle(w * 0.61, h * 0.27, 3);
        gfx.fillStyle(0xffffff, 1);
        gfx.fillCircle(w * 0.42, h * 0.25, 1.5);
        gfx.fillCircle(w * 0.62, h * 0.25, 1.5);
        gfx.fillStyle(0xff6699, 1);
        const nx = w * 0.5, ny = h * 0.32, s = 1.8;
        gfx.fillCircle(nx - s, ny, s);
        gfx.fillCircle(nx + s, ny, s);
        gfx.fillTriangle(nx - s * 2.2, ny + s * 0.3, nx + s * 2.2, ny + s * 0.3, nx, ny + s * 2.5);
        gfx.fillStyle(0xffaacc, 0.5);
        gfx.fillCircle(w * 0.30, h * 0.32, 3);
        gfx.fillCircle(w * 0.70, h * 0.32, 3);
        gfx.lineStyle(1, 0x000000, 0.5);
        gfx.beginPath();
        gfx.arc(w * 0.50, h * 0.35, 2, 0, Math.PI);
        gfx.strokePath();
        gfx.fillStyle(baseColor, 1);
        gfx.fillCircle(w * 0.30, h * 0.78, 3);
        gfx.fillCircle(w * 0.45, h * 0.78, 3);
        gfx.fillCircle(w * 0.55, h * 0.78, 3);
        gfx.fillCircle(w * 0.70, h * 0.78, 3);
        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    createHeartTexture(key) {
        const s = 16;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xff6699, 1);
        gfx.fillCircle(s * 0.25, s * 0.3, s * 0.25);
        gfx.fillCircle(s * 0.75, s * 0.3, s * 0.25);
        gfx.fillTriangle(s * 0.05, s * 0.35, s * 0.95, s * 0.35, s * 0.5, s * 0.95);
        gfx.fillStyle(0xffffff, 0.6);
        gfx.fillCircle(s * 0.2, s * 0.2, s * 0.08);
        gfx.generateTexture(key, s, s);
        gfx.destroy();
    }

    createCloudTexture(key) {
        const w = 64, h = 32;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xffffff, 0.8);
        gfx.fillCircle(w * 0.25, h * 0.55, h * 0.45);
        gfx.fillCircle(w * 0.50, h * 0.45, h * 0.55);
        gfx.fillCircle(w * 0.75, h * 0.55, h * 0.45);
        gfx.fillRect(w * 0.25, h * 0.35, w * 0.5, h * 0.4);
        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // Soft pastel background
        this.cameras.main.setBackgroundColor('#f5e6ff');

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
            fontFamily: '"Poppins", sans-serif',
            fontStyle: 'bold',
            stroke: '#ff88cc',
            strokeThickness: 3
        }).setOrigin(0.5).setShadow(0, 4, '#ff88cc88', 0, true, true);

        // Cat sprite (large, centered)
        const cat = this.add.sprite(W / 2, H * 0.42, 'cat_idle')
            .setScale(5)
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
            color: '#aa77cc',
            fontFamily: '"Poppins", sans-serif',
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
            fontFamily: '"Poppins", sans-serif',
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
                        this.scene.start('BootScene');
                    });
                }
            });
        });

        // Hint text
        this.add.text(W / 2, H - 40, 'Tap Start to begin your adventure \u2764\ufe0f', {
            fontSize: '13px',
            color: '#bb99cc',
            fontFamily: '"Poppins", sans-serif'
        }).setOrigin(0.5);

        // Copyright
        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '10px',
            color: '#ccbbdd',
            fontFamily: '"Poppins", sans-serif'
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
}
