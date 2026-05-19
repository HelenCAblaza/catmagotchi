     1|class StartScene extends Phaser.Scene {
     2|    constructor() {
     3|        super({ key: 'StartScene' });
     4|    }
     5|
     6|    create() {
     7|        const W = this.scale.width;
     8|        const H = this.scale.height;
     9|
    10|        // Soft pastel background
    11|        this.cameras.main.setBackgroundColor('#f5e6ff');
    12|
    13|        // Decorative floating clouds
    14|        for (let i = 0; i < 5; i++) {
    15|            const cloud = this.add.image(
    16|                60 + Math.random() * (W - 120),
    17|                40 + Math.random() * (H * 0.3),
    18|                'cloud'
    19|            )
    20|                .setScale(0.5 + Math.random() * 0.6)
    21|                .setAlpha(0.3 + Math.random() * 0.3)
    22|                .setDepth(-1);
    23|
    24|            this.tweens.add({
    25|                targets: cloud,
    26|                x: cloud.x + 20 + Math.random() * 30,
    27|                duration: 3000 + Math.random() * 2000,
    28|                yoyo: true,
    29|                repeat: -1,
    30|                ease: 'Sine.easeInOut'
    31|            });
    32|        }
    33|
    34|        // Title with glow
    35|        this.add.text(W / 2, H * 0.22, '\u2728 Catmagotchi \u2728', {
    36|            fontSize: '42px',
    37|            color: '#ffffff',
    38|            fontFamily: 'Poppins',
    39|            fontStyle: 'bold',
    40|            stroke: '#ff88cc',
    41|            strokeThickness: 3
    42|        }).setOrigin(0.5).setShadow(0, 4, '#ff88cc88', 0, true, true);
    43|
    44|        // Cat sprite (large, centered) - uses real pixel-art PNG!
    45|        const cat = this.add.sprite(W / 2, H * 0.42, 'cat_idle')
    46|            .setScale(3)
    47|            .setOrigin(0.5);
    48|
    49|        // Gentle bob animation
    50|        this.tweens.add({
    51|            targets: cat,
    52|            y: H * 0.42 - 12,
    53|            duration: 1200,
    54|            yoyo: true,
    55|            repeat: -1,
    56|            ease: 'Sine.easeInOut'
    57|        });
    58|
    59|        // Cat name
    60|        this.add.text(W / 2, H * 0.58, '\u2606 Meet Mittens \u2606', {
    61|            fontSize: '20px',
    62|            color: '#aa77cc',
    63|            fontFamily: 'Poppins',
    64|            fontStyle: 'bold'
    65|        }).setOrigin(0.5);
    66|
    67|        // Floating hearts around cat
    68|        this.hearts = this.add.group();
    69|        this.time.addEvent({
    70|            delay: 1500,
    71|            loop: true,
    72|            callback: () => this.spawnHeart()
    73|        });
    74|
    75|        // Cute Start button (pill shape)
    76|        const btnW = 200;
    77|        const btnH = 56;
    78|        const btnY = H * 0.72;
    79|
    80|        const btnBg = this.add.graphics();
    81|        btnBg.fillStyle(0xff88cc, 1);
    82|        this.drawPill(btnBg, W / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, btnH / 2);
    83|
    84|        // Button text
    85|        const btnText = this.add.text(W / 2, btnY, '\ud83d\udc3e Start Game!', {
    86|            fontSize: '22px',
    87|            color: '#ffffff',
    88|            fontFamily: 'Poppins',
    89|            fontStyle: 'bold'
    90|        }).setOrigin(0.5);
    91|
    92|        // Invisible interactive hit area over the button
    93|        const hitArea = this.add.rectangle(W / 2, btnY, btnW + 20, btnH + 20, 0x000000, 0)
    94|            .setInteractive({ useHandCursor: true });
    95|
    96|        // Hover effect
    97|        hitArea.on('pointerover', () => {
    98|            btnBg.clear();
    99|            btnBg.fillStyle(0xffaadd, 1);
   100|            this.drawPill(btnBg, W / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, btnH / 2);
   101|            btnText.setScale(1.05);
   102|        });
   103|
   104|        hitArea.on('pointerout', () => {
   105|            btnBg.clear();
   106|            btnBg.fillStyle(0xff88cc, 1);
   107|            this.drawPill(btnBg, W / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, btnH / 2);
   108|            btnText.setScale(1);
   109|        });
   110|
   111|        hitArea.on('pointerdown', () => {
   112|            this.tweens.add({
   113|                targets: [cat, btnText],
   114|                scaleX: 0.9,
   115|                scaleY: 0.9,
   116|                duration: 100,
   117|                yoyo: true,
   118|                onComplete: () => {
   119|                    this.cameras.main.fadeOut(400, 245, 230, 255);
   120|                    this.cameras.main.once('camerafadeoutcomplete', () => {
   121|                        this.scene.start('HomeScene');
   122|                    });
   123|                }
   124|            });
   125|        });
   126|
   127|        // Hint text
   128|        this.add.text(W / 2, H - 40, 'Tap Start to begin your adventure \u2764\ufe0f', {
   129|            fontSize: '13px',
   130|            color: '#bb99cc',
   131|            fontFamily: 'Poppins'
   132|        }).setOrigin(0.5);
   133|
   134|        // Copyright
   135|        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
   136|            fontSize: '10px',
   137|            color: '#887799',
   138|            fontFamily: 'Poppins'
   139|        }).setOrigin(0.5);
   140|    }
   141|
   142|    update() {
   143|        // Float hearts
   144|        this.hearts.children.each((heart) => {
   145|            heart.y -= heart.speedY;
   146|            heart.alpha -= 0.006;
   147|            if (heart.alpha <= 0) {
   148|                heart.destroy();
   149|            }
   150|        });
   151|    }
   152|
   153|    spawnHeart() {
   154|        const x = 80 + Math.random() * (this.scale.width - 160);
   155|        const y = this.scale.height * 0.35 + Math.random() * 120;
   156|        const heart = this.add.image(x, y, 'heart')
   157|            .setScale(0.3 + Math.random() * 0.3)
   158|            .setAlpha(0.7);
   159|        heart.speedY = 0.3 + Math.random() * 0.5;
   160|        this.hearts.add(heart);
   161|    }
   162|
   163|    drawPill(gfx, x, y, w, h, r) {
   164|        gfx.fillRoundedRect(x, y, w, h, r);
   165|    }
   166|}
   167|