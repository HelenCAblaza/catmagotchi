class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
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
                        this.scene.start('HomeScene');
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
