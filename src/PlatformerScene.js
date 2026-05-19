     1|class PlatformerScene extends Phaser.Scene {
     2|    constructor() {
     3|        super({ key: 'PlatformerScene' });
     4|    }
     5|
     6|    create() {
     7|        this.cameras.main.setBackgroundColor('#87CEEB');
     8|
     9|        const W = this.scale.width;   // 480
    10|        const H = this.scale.height;  // 800
    11|        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    12|
    13|        // World bounds - horizontal scrolling platformer
    14|        this.physics.world.setBounds(0, 0, 1600, 600);
    15|
    16|        // Platforms
    17|        this.platforms = this.physics.add.staticGroup();
    18|        this.createLevel();
    19|
    20|        // Cat player - 64x64 sprite at 1x scale = 64px tall (fits under platforms)
    21|        this.player = this.physics.add.sprite(100, 500, 'cat_idle');
    22|        this.player.setScale(1);
    23|        // Physics body matches the visible cat within the 64x64 sprite
    24|        this.player.body.setSize(32, 40);
    25|        this.player.body.setOffset(16, 12);
    26|        this.player.setBounce(0.1);
    27|        this.player.setCollideWorldBounds(true);
    28|        this.physics.add.collider(this.player, this.platforms);
    29|
    30|        // Switch to run texture when moving
    31|        this.playerRunTexture = false;
    32|
    33|        // Camera follow
    34|        this.cameras.main.startFollow(this.player);
    35|        this.cameras.main.setBounds(0, 0, 1600, 600);
    36|
    37|        // Collectibles
    38|        this.fishes = this.physics.add.group();
    39|        this.toys = this.physics.add.group();
    40|        this.spawnCollectibles();
    41|
    42|        this.physics.add.overlap(this.player, this.fishes, (p, f) => this.collectFish(p, f));
    43|        this.physics.add.overlap(this.player, this.toys, (p, t) => this.collectToy(p, t));
    44|
    45|        // Keyboard controls (desktop)
    46|        this.cursors = this.input.keyboard.createCursorKeys();
    47|
    48|        // Virtual joystick (mobile/touch)
    49|        this.createVirtualJoystick();
    50|
    51|        // Decorative clouds in the sky (parallax scrolling)
    52|        this.clouds = [];
    53|        for (let i = 0; i < 5; i++) {
    54|            const cloud = this.add.image(100 + i * 300, 60 + Math.random() * 80, 'cloud')
    55|                .setScale(0.7 + Math.random() * 0.5)
    56|                .setAlpha(0.5 + Math.random() * 0.3)
    57|                .setScrollFactor(0.3)
    58|                .setDepth(-5);
    59|            this.clouds.push({
    60|                sprite: cloud,
    61|                speed: 0.1 + Math.random() * 0.2
    62|            });
    63|        }
    64|
    65|        // Floating stars/sparkles
    66|        this.stars = this.add.group();
    67|        for (let i = 0; i < 8; i++) {
    68|            const star = this.add.image(Math.random() * 1600, Math.random() * 400, 'star')
    69|                .setScale(0.3 + Math.random() * 0.3)
    70|                .setAlpha(0.4 + Math.random() * 0.4);
    71|            this.stars.add(star);
    72|            this.tweens.add({
    73|                targets: star,
    74|                y: star.y - 10,
    75|                alpha: 0.1,
    76|                duration: 2000 + Math.random() * 2000,
    77|                yoyo: true,
    78|                repeat: -1,
    79|                ease: 'Sine.easeInOut'
    80|            });
    81|        }
    82|
    83|        // === UI ===
    84|        // Home button - top right
    85|        this.createButton(W - 60, 30, '\ud83c\udfe0 Home', () => {
    86|            this.scene.start('HomeScene');
    87|        });
    88|
    89|        // Inventory display - top left
    90|        this.fishText = this.add.text(10, 10, '\ud83d\udc1f: 0', {
    91|            fontSize: '15px',
    92|            color: '#ffffff',
    93|            fontFamily: 'Poppins',
    94|            stroke: '#000000',
    95|            strokeThickness: 3
    96|        }).setScrollFactor(0);
    97|
    98|        this.toyText = this.add.text(10, 32, '\ud83e\uddf6: 0', {
    99|            fontSize: '15px',
   100|            color: '#ffffff',
   101|            fontFamily: 'Poppins',
   102|            stroke: '#000000',
   103|            strokeThickness: 3
   104|        }).setScrollFactor(0);
   105|
   106|        // Hint text (shows on mobile, fades after 4s)
   107|        if (isMobile) {
   108|            this.hintText = this.add.text(W / 2, 70, '\ud83c\udfae Drag round controller to move & jump!', {
   109|                fontSize: '13px',
   110|                color: '#ffffff',
   111|                fontFamily: 'Poppins',
   112|                stroke: '#000000',
   113|                strokeThickness: 3
   114|            }).setOrigin(0.5).setScrollFactor(0);
   115|
   116|            this.time.delayedCall(4000, () => {
   117|                this.tweens.add({ targets: this.hintText, alpha: 0, duration: 1000 });
   118|            });
   119|        }
   120|
   121|        // Copyright watermark
   122|        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
   123|            fontSize: '10px',
   124|            color: '#887799',
   125|            fontFamily: 'Poppins'
   126|        }).setOrigin(0.5).setScrollFactor(0);
   127|
   128|        // Ground collision
   129|        this.physics.add.collider(this.fishes, this.platforms);
   130|        this.physics.add.collider(this.toys, this.platforms);
   131|    }
   132|
   133|    createVirtualJoystick() {
   134|        const W = this.scale.width;
   135|        const H = this.scale.height;
   136|        const maxDrag = 55;
   137|        const baseRadius = 70;
   138|        const nubRadius = 26;
   139|
   140|        this.joyActive = false;
   141|        this.joyBaseX = 0;
   142|        this.joyBaseY = 0;
   143|        this.joyX = 0;
   144|        this.joyY = 0;
   145|        this.joyJumpTriggered = false;
   146|
   147|        // Outer ring (base)
   148|        this.joyBase = this.add.circle(0, 0, baseRadius, 0x444466, 0.22)
   149|            .setStrokeStyle(3, 0xffffff, 0.35)
   150|            .setScrollFactor(0)
   151|            .setVisible(false)
   152|            .setDepth(100);
   153|
   154|        // Direction hint arrows
   155|        this.joyArrows = this.add.text(0, 0, '\u25c0  \u25b6\n\u25b2', {
   156|            fontSize: '18px',
   157|            color: '#ffffff',
   158|            align: 'center',
   159|            fontFamily: 'Poppins',
   160|            fontStyle: 'bold'
   161|        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(100).setAlpha(0.35);
   162|
   163|        // Inner nub (draggable thumb stick)
   164|        this.joyNub = this.add.circle(0, 0, nubRadius, 0x7777dd, 0.55)
   165|            .setStrokeStyle(2, 0xffffff, 0.5)
   166|            .setScrollFactor(0)
   167|            .setVisible(false)
   168|            .setDepth(101);
   169|
   170|        // Nub highlight
   171|        this.joyNubGlow = this.add.circle(0, 0, nubRadius * 0.55, 0xaaaaff, 0.35)
   172|            .setScrollFactor(0)
   173|            .setVisible(false)
   174|            .setDepth(101);
   175|
   176|        // Activate joystick when touching bottom half of screen
   177|        const joyZoneTop = H * 0.45;
   178|        this.input.on('pointerdown', (pointer) => {
   179|            if (pointer.y > joyZoneTop && !this.joyActive) {
   180|                this.joyActive = true;
   181|                this.joyBaseX = pointer.x;
   182|                this.joyBaseY = pointer.y;
   183|                this.joyX = 0;
   184|                this.joyY = 0;
   185|
   186|                this.joyBase.setPosition(this.joyBaseX, this.joyBaseY);
   187|                this.joyArrows.setPosition(this.joyBaseX, this.joyBaseY);
   188|                this.joyNub.setPosition(this.joyBaseX, this.joyBaseY);
   189|                this.joyNubGlow.setPosition(this.joyBaseX - 3, this.joyBaseY - 3);
   190|
   191|                this.joyBase.setVisible(true);
   192|                this.joyArrows.setVisible(true);
   193|                this.joyNub.setVisible(true);
   194|                this.joyNubGlow.setVisible(true);
   195|
   196|                this.joyBase.setScale(0.4);
   197|                this.joyNub.setScale(0.4);
   198|                this.joyArrows.setScale(0.4);
   199|                this.tweens.add({
   200|                    targets: [this.joyBase, this.joyNub, this.joyArrows],
   201|                    scaleX: 1,
   202|                    scaleY: 1,
   203|                    duration: 180,
   204|                    ease: 'Back.easeOut'
   205|                });
   206|            }
   207|        });
   208|
   209|        this.input.on('pointermove', (pointer) => {
   210|            if (this.joyActive && pointer.isDown) {
   211|                const dx = pointer.x - this.joyBaseX;
   212|                const dy = pointer.y - this.joyBaseY;
   213|                const dist = Math.sqrt(dx * dx + dy * dy);
   214|
   215|                let nubX, nubY;
   216|                if (dist > maxDrag) {
   217|                    const angle = Math.atan2(dy, dx);
   218|                    nubX = this.joyBaseX + Math.cos(angle) * maxDrag;
   219|                    nubY = this.joyBaseY + Math.sin(angle) * maxDrag;
   220|                } else {
   221|                    nubX = pointer.x;
   222|                    nubY = pointer.y;
   223|                }
   224|
   225|                this.joyNub.setPosition(nubX, nubY);
   226|                this.joyNubGlow.setPosition(nubX - 3, nubY - 3);
   227|
   228|                this.joyX = Phaser.Math.Clamp(dx / maxDrag, -1, 1);
   229|                this.joyY = Phaser.Math.Clamp(dy / maxDrag, -1, 1);
   230|            }
   231|        });
   232|
   233|        this.input.on('pointerup', () => {
   234|            if (this.joyActive) {
   235|                this.joyActive = false;
   236|                this.joyX = 0;
   237|                this.joyY = 0;
   238|                this.joyJumpTriggered = false;
   239|
   240|                this.tweens.add({
   241|                    targets: [this.joyBase, this.joyNub, this.joyArrows, this.joyNubGlow],
   242|                    scaleX: 0.3,
   243|                    scaleY: 0.3,
   244|                    alpha: 0,
   245|                    duration: 150,
   246|                    onComplete: () => {
   247|                        this.joyBase.setVisible(false).setAlpha(1).setScale(1);
   248|                        this.joyNub.setVisible(false).setAlpha(1).setScale(1);
   249|                        this.joyArrows.setVisible(false).setAlpha(1).setScale(1);
   250|                        this.joyNubGlow.setVisible(false).setAlpha(1).setScale(1);
   251|                    }
   252|                });
   253|            }
   254|        });
   255|    }
   256|
   257|    createLevel() {
   258|        for (let x = 0; x < 1700; x += 32) {
   259|            this.platforms.create(x, 568, 'ground').setScale(1).refreshBody();
   260|        }
   261|
   262|        this.platforms.create(200, 450, 'platform');
   263|        this.platforms.create(350, 380, 'platform');
   264|        this.platforms.create(500, 300, 'platform');
   265|        this.platforms.create(700, 400, 'platform');
   266|        this.platforms.create(850, 320, 'platform');
   267|        this.platforms.create(1000, 450, 'platform');
   268|        this.platforms.create(1200, 350, 'platform');
   269|        this.platforms.create(1350, 280, 'platform');
   270|        this.platforms.create(1500, 400, 'platform');
   271|    }
   272|
   273|    spawnCollectibles() {
   274|        const fishPositions = [
   275|            [250, 400], [400, 330], [550, 250],
   276|            [750, 350], [900, 270], [1050, 400],
   277|            [1250, 300], [1400, 230]
   278|        ];
   279|
   280|        const toyPositions = [
   281|            [320, 420], [620, 450], [820, 370],
   282|            [1120, 420], [1320, 320]
   283|        ];
   284|
   285|        fishPositions.forEach(([x, y]) => {
   286|            const fish = this.fishes.create(x, y, 'fish');
   287|            // Gentle bob animation
   288|            this.tweens.add({
   289|                targets: fish,
   290|                y: y - 5,
   291|                duration: 800 + Math.random() * 400,
   292|                yoyo: true,
   293|                repeat: -1,
   294|                ease: 'Sine.easeInOut'
   295|            });
   296|        });
   297|
   298|        toyPositions.forEach(([x, y]) => {
   299|            const yarn = this.toys.create(x, y, 'yarn');
   300|            // Gentle spin and bob
   301|            this.tweens.add({
   302|                targets: yarn,
   303|                y: y - 6,
   304|                angle: 10,
   305|                duration: 1000 + Math.random() * 500,
   306|                yoyo: true,
   307|                repeat: -1,
   308|                ease: 'Sine.easeInOut'
   309|            });
   310|        });
   311|    }
   312|
   313|    update() {
   314|        const stats = this.registry.get('stats');
   315|
   316|        // Drift clouds
   317|        for (const cloud of this.clouds) {
   318|            cloud.sprite.x += cloud.speed;
   319|            if (cloud.sprite.x > 1700) {
   320|                cloud.sprite.x = -100;
   321|            }
   322|        }
   323|
   324|        // Update inventory display
   325|        const inv = this.registry.get('inventory');
   326|        this.fishText.setText(`\ud83d\udc1f: ${inv.fish}`);
   327|        this.toyText.setText(`\ud83e\uddf6: ${inv.toys}`);
   328|
   329|        // Movement - keyboard OR joystick
   330|        let left = this.cursors.left.isDown;
   331|        let right = this.cursors.right.isDown;
   332|        let jump = this.cursors.up.isDown;
   333|
   334|        if (this.joyActive) {
   335|            if (Math.abs(this.joyX) > 0.15) {
   336|                if (this.joyX < 0) left = true;
   337|                else right = true;
   338|            }
   339|
   340|            if (this.joyY < -0.4 && !this.joyJumpTriggered) {
   341|                jump = true;
   342|                this.joyJumpTriggered = true;
   343|            }
   344|            if (this.joyY > -0.2) {
   345|                this.joyJumpTriggered = false;
   346|            }
   347|        }
   348|
   349|        let velocityX = 0;
   350|        if (left) {
   351|            velocityX = this.joyActive ? -200 * Math.abs(this.joyX) : -200;
   352|            this.player.setFlipX(false);  // face left (default sprite direction)
   353|        } else if (right) {
   354|            velocityX = this.joyActive ? 200 * Math.abs(this.joyX) : 200;
   355|            this.player.setFlipX(true);   // flip to face right
   356|        }
   357|        this.player.setVelocityX(velocityX);
   358|
   359|        // Switch texture based on movement
   360|        const isMoving = Math.abs(velocityX) > 10;
   361|        if (isMoving && !this.playerRunTexture) {
   362|            this.player.setTexture('cat_run');
   363|            this.playerRunTexture = true;
   364|        } else if (!isMoving && this.playerRunTexture) {
   365|            this.player.setTexture('cat_idle');
   366|            this.playerRunTexture = false;
   367|        }
   368|
   369|        if (jump && this.player.body.touching.down) {
   370|            this.player.setVelocityY(-400);
   371|            if (this.joyActive) {
   372|                this.tweens.add({
   373|                    targets: this.joyNub,
   374|                    scaleX: 1.35,
   375|                    scaleY: 1.35,
   376|                    duration: 100,
   377|                    yoyo: true
   378|                });
   379|            }
   380|        }
   381|
   382|        if (Math.abs(this.player.body.velocity.x) > 10) {
   383|            stats.energy = Math.max(0, stats.energy - 0.02);
   384|            this.registry.set('stats', stats);
   385|        }
   386|    }
   387|
   388|    collectFish(player, fish) {
   389|        const x = fish.x;
   390|        const y = fish.y;
   391|        fish.destroy();
   392|        const inv = this.registry.get('inventory');
   393|        inv.fish++;
   394|        this.registry.set('inventory', inv);
   395|        this.showFloatingText(player.x, player.y - 30, '\ud83d\udc1f +1');
   396|        this.spawnCollectEffect(x, y, 'heart');
   397|    }
   398|
   399|    collectToy(player, toy) {
   400|        const x = toy.x;
   401|        const y = toy.y;
   402|        toy.destroy();
   403|        const inv = this.registry.get('inventory');
   404|        inv.toys++;
   405|        this.registry.set('inventory', inv);
   406|        const stats = this.registry.get('stats');
   407|        stats.happiness = Math.min(100, stats.happiness + 5);
   408|        this.registry.set('stats', stats);
   409|        this.showFloatingText(player.x, player.y - 30, '\ud83e\uddf6 +1');
   410|        this.spawnCollectEffect(x, y, 'star');
   411|    }
   412|
   413|    spawnCollectEffect(x, y, textureKey) {
   414|        for (let i = 0; i < 4; i++) {
   415|            const p = this.add.image(x, y, textureKey)
   416|                .setScale(0.3 + Math.random() * 0.3)
   417|                .setAlpha(0.9);
   418|            const angle = Math.random() * Math.PI * 2;
   419|            const dist = 15 + Math.random() * 25;
   420|            this.tweens.add({
   421|                targets: p,
   422|                x: x + Math.cos(angle) * dist,
   423|                y: y + Math.sin(angle) * dist - 15,
   424|                alpha: 0,
   425|                scaleX: 0,
   426|                scaleY: 0,
   427|                duration: 500 + Math.random() * 300,
   428|                ease: 'Power2',
   429|                onComplete: () => p.destroy()
   430|            });
   431|        }
   432|    }
   433|
   434|    createButton(x, y, text, callback) {
   435|        const btn = this.add.rectangle(x, y, 100, 36, 0x5555aa)
   436|            .setInteractive({ useHandCursor: true })
   437|            .setScrollFactor(0);
   438|
   439|        const lbl = this.add.text(x, y, text, {
   440|            fontSize: '14px',
   441|            color: '#ffffff',
   442|            fontFamily: 'Poppins'
   443|        }).setOrigin(0.5).setScrollFactor(0);
   444|
   445|        btn.on('pointerover', () => btn.setFillStyle(0x7777cc));
   446|        btn.on('pointerout', () => btn.setFillStyle(0x5555aa));
   447|        btn.on('pointerdown', callback);
   448|    }
   449|
   450|    showFloatingText(x, y, text) {
   451|        const txt = this.add.text(x, y, text, {
   452|            fontSize: '18px',
   453|            color: '#ffff00',
   454|            fontFamily: 'Poppins',
   455|            stroke: '#000000',
   456|            strokeThickness: 3
   457|        }).setOrigin(0.5);
   458|
   459|        this.tweens.add({
   460|            targets: txt,
   461|            y: y - 40,
   462|            alpha: 0,
   463|            duration: 1000,
   464|            onComplete: () => txt.destroy()
   465|        });
   466|    }
   467|}
   468|