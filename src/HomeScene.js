     1|class HomeScene extends Phaser.Scene {
     2|    constructor() {
     3|        super({ key: 'HomeScene' });
     4|    }
     5|
     6|    create() {
     7|        const W = this.scale.width;   // 480
     8|        const H = this.scale.height;  // 800
     9|
    10|        // Background
    11|        const bg = this.add.image(W / 2, H / 2, 'bg_home');
    12|        bg.setDisplaySize(W, H);
    13|
    14|        // Floating clouds (decorative, slowly drifting)
    15|        this.clouds = [];
    16|        for (let i = 0; i < 3; i++) {
    17|            const cloud = this.add.image(80 + i * 150, 60 + i * 30, 'cloud')
    18|                .setScale(0.6 + Math.random() * 0.4)
    19|                .setAlpha(0.5 + Math.random() * 0.3)
    20|                .setDepth(-1);
    21|            this.clouds.push({
    22|                sprite: cloud,
    23|                speed: 0.2 + Math.random() * 0.3
    24|            });
    25|        }
    26|
    27|        // Floating hearts particles around the cat area
    28|        this.hearts = this.add.group();
    29|        this.time.addEvent({
    30|            delay: 2000,
    31|            loop: true,
    32|            callback: () => this.spawnHeart()
    33|        });
    34|
    35|        // Title - matching StartScene style
    36|        this.add.text(W / 2, 52, '\u2728 Catmagotchi \u2728', {
    37|            fontSize: '42px',
    38|            color: '#ffffff',
    39|            fontFamily: 'Poppins',
    40|            fontStyle: 'bold',
    41|            stroke: '#ff88cc',
    42|            strokeThickness: 3
    43|        }).setOrigin(0.5).setShadow(0, 4, '#ff88cc88', 0, true, true);
    44|
    45|        // Copyright watermark
    46|        this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
    47|            fontSize: '10px',
    48|            color: '#887799',
    49|            fontFamily: 'Poppins'
    50|        }).setOrigin(0.5);
    51|
    52|        // Cat name above stats - smaller, left aligned, no stars, darker grey
    53|        this.add.text(40, 125, 'Mittens', {
    54|            fontSize: '18px',
    55|            color: '#555555',
    56|            fontFamily: 'Poppins',
    57|            fontStyle: 'bold'
    58|        }).setOrigin(0, 0.5);
    59|
    60|        // === STATS AREA ===
    61|        const statY1 = 155;
    62|        const statY2 = 191;
    63|        const barW = 110;
    64|        const barH = 14;
    65|        const labelX = 40;     // aligned with buttons left edge
    66|        const barX = 90;       // after labels
    67|
    68|        this.createCapsuleStatBar(labelX, statY1, 'Hunger', 'hunger', 0xff7799, barX, barW, barH);
    69|        this.createCapsuleStatBar(labelX, statY2, 'Energy', 'energy', 0x88dd88, barX, barW, barH);
    70|
    71|        const rightLabelX = 223;
    72|        const rightBarX = 265;
    73|        this.createCapsuleStatBar(rightLabelX - 2, statY1, 'Happy', 'happiness', 0xffcc66, rightBarX, barW, barH);
    74|        this.createCapsuleStatBar(rightLabelX, statY2, 'Clean', 'hygiene', 0x77ccff, rightBarX, barW, barH);
    75|
    76|        // Inventory - aligned right with buttons right edge
    77|        this.fishText = this.add.text(440, statY1, '\ud83d\udc1f: 0', {
    78|            fontSize: '15px',
    79|            color: '#cccccc',
    80|            fontFamily: 'Poppins',
    81|            stroke: '#000000',
    82|            strokeThickness: 3
    83|        }).setOrigin(1, 0.5);
    84|
    85|        this.toyText = this.add.text(440, statY2, '\ud83e\uddf6: 0', {
    86|            fontSize: '15px',
    87|            color: '#cccccc',
    88|            fontFamily: 'Poppins',
    89|            stroke: '#000000',
    90|            strokeThickness: 3
    91|        }).setOrigin(1, 0.5);
    92|
    93|        // === CAT AREA ===
    94|        const catY = H * 0.48;
    95|        this.cat = this.add.sprite(W / 2, catY, 'cat_idle');
    96|        this.cat.setScale(2.2);
    97|
    98|        // Cooldown for cleaning (via Bath button)
    99|        this.canClean = true;
   100|
   101|        // Decorative items around cat
   102|        const decoY = catY + 20;
   103|        this.add.image(W * 0.15, decoY, 'bed').setScale(1.8);
   104|        this.add.image(W * 0.85, decoY, 'bowl').setScale(1.8);
   105|        this.add.image(W / 2, decoY + 40, 'yarn').setScale(1.8);
   106|
   107|        // === BUTTONS (bottom area) - circle buttons in a single row ===
   108|        const btnY = H * 0.78;
   109|        const circleR = 32;
   110|        const btnX1 = W * 0.14;
   111|        const btnX2 = W * 0.38;
   112|        const btnX3 = W * 0.62;
   113|        const btnX4 = W * 0.86;
   114|
   115|        this.createCircleButton(btnX1, btnY, '🛏️', 'Sleep', () => this.sleep(), circleR, 0xaabbee);
   116|        this.createCircleButton(btnX2, btnY, '🍗', 'Feed', () => this.feed(), circleR, 0xdd9999);
   117|        this.createCircleButton(btnX3, btnY, '🧶', 'Play', () => this.play(), circleR, 0xdd99dd);
   118|        this.createCircleButton(btnX4, btnY, '🛁', 'Bath', () => this.cleanCat(), circleR, 0x77bbdd);
   119|
   120|        // === ADVENTURE BUTTON - round pastel world button at bottom right ===
   121|        this.createAdventureButton(W - 55, H - 55);
   122|
   123|        // Stats update loop
   124|        this.time.addEvent({
   125|            delay: 3000,
   126|            loop: true,
   127|            callback: () => this.decayStats()
   128|        });
   129|
   130|        // Cat idle animation - gentle bob with a little squash
   131|        this.tweens.add({
   132|            targets: this.cat,
   133|            y: catY - 8,
   134|            duration: 1000,
   135|            yoyo: true,
   136|            repeat: -1,
   137|            ease: 'Sine.easeInOut'
   138|        });
   139|    }
   140|
   141|    update() {
   142|        // Drift clouds
   143|        for (const cloud of this.clouds) {
   144|            cloud.sprite.x += cloud.speed;
   145|            if (cloud.sprite.x > this.scale.width + 50) {
   146|                cloud.sprite.x = -50;
   147|            }
   148|        }
   149|
   150|        // Float hearts
   151|        this.hearts.children.each((heart) => {
   152|            heart.y -= heart.speedY;
   153|            heart.x += Math.sin(heart.time + heart.offset) * 0.5;
   154|            heart.time += 0.05;
   155|            heart.alpha -= 0.005;
   156|            if (heart.alpha <= 0) {
   157|                heart.destroy();
   158|            }
   159|        });
   160|
   161|        const stats = this.registry.get('stats');
   162|        this.updateBar('hunger', stats.hunger);
   163|        this.updateBar('happiness', stats.happiness);
   164|        this.updateBar('energy', stats.energy);
   165|        this.updateBar('hygiene', stats.hygiene);
   166|
   167|        const inv = this.registry.get('inventory');
   168|        this.fishText.setText(`\ud83d\udc1f: ${inv.fish}`);
   169|        this.toyText.setText(`\ud83e\uddf6: ${inv.toys}`);
   170|    }
   171|
   172|    spawnHeart() {
   173|        const x = 80 + Math.random() * (this.scale.width - 160);
   174|        const y = this.scale.height * 0.25 + Math.random() * 150;
   175|        const heart = this.add.image(x, y, 'heart')
   176|            .setScale(0.3 + Math.random() * 0.4)
   177|            .setAlpha(0.7);
   178|        heart.speedY = 0.3 + Math.random() * 0.5;
   179|        heart.time = 0;
   180|        heart.offset = Math.random() * 100;
   181|        this.hearts.add(heart);
   182|    }
   183|
   184|    createCapsuleStatBar(labelX, labelY, label, key, color, barX, barWidth, barHeight) {
   185|        const r = barHeight / 2;
   186|        // Background capsule
   187|        const bg = this.add.graphics();
   188|        bg.fillStyle(0x333344, 1);
   189|        this.drawCapsule(bg, barX, labelY - barHeight / 2, barWidth, barHeight, r);
   190|
   191|        // Fill capsule
   192|        const fill = this.add.graphics();
   193|        fill.fillStyle(color, 1);
   194|        this[`gfx_${key}`] = fill;
   195|        this[`bar_${key}_x`] = barX;
   196|        this[`bar_${key}_y`] = labelY;
   197|        this[`bar_${key}_w`] = barWidth;
   198|        this[`bar_${key}_h`] = barHeight;
   199|        this[`bar_${key}_r`] = r;
   200|        this[`bar_${key}_color`] = color;
   201|
   202|        // Label
   203|        this.add.text(labelX, labelY, label, {
   204|            fontSize: '12px',
   205|            color: '#777777',
   206|            fontFamily: 'Poppins',
   207|            fontStyle: 'bold'
   208|        }).setOrigin(0, 0.5);
   209|    }
   210|
   211|    drawCapsule(gfx, x, y, w, h, r) {
   212|        gfx.fillRoundedRect(x, y, w, h, r);
   213|    }
   214|
   215|    updateBar(key, value) {
   216|        const fill = this[`gfx_${key}`];
   217|        if (fill) {
   218|            fill.clear();
   219|            const x = this[`bar_${key}_x`];
   220|            const y = this[`bar_${key}_y`];
   221|            const w = this[`bar_${key}_w`];
   222|            const h = this[`bar_${key}_h`];
   223|            const r = this[`bar_${key}_r`];
   224|            let color = this[`bar_${key}_color`];
   225|            if (value < 30) color = 0xff4444;
   226|            fill.fillStyle(color, 1);
   227|            const fillW = Math.max(0, (value / 100) * w);
   228|            if (fillW > 0) {
   229|                fill.fillRoundedRect(x, y - h / 2, fillW, h, r);
   230|            }
   231|        }
   232|    }
   233|
   234|    createCircleButton(x, y, icon, label, callback, radius, color) {
   235|        const border = 2;
   236|        const btn = this.add.graphics();
   237|        const borderColor = this.darkenColor(color, 0x222222);
   238|        // Crisp border using filled circle behind
   239|        btn.fillStyle(borderColor, 1);
   240|        btn.fillCircle(x, y, radius + border);
   241|        btn.fillStyle(color, 1);
   242|        btn.fillCircle(x, y, radius);
   243|        btn.setInteractive(
   244|            new Phaser.Geom.Circle(x, y, radius + border),
   245|            Phaser.Geom.Circle.Contains
   246|        );
   247|        btn.setScrollFactor(0);
   248|
   249|        // Emoji icon centered in circle
   250|        const iconText = this.add.text(x, y - 2, icon, {
   251|            fontSize: '24px',
   252|            fontFamily: 'Poppins',
   253|            stroke: '#000000',
   254|            strokeThickness: 2
   255|        }).setOrigin(0.5);
   256|
   257|        // Label below circle
   258|        this.add.text(x, y + radius + 10, label, {
   259|            fontSize: '11px',
   260|            color: '#8888aa',
   261|            fontFamily: 'Poppins',
   262|            fontStyle: 'bold'
   263|        }).setOrigin(0.5);
   264|
   265|        // Hover effect - brighten
   266|        btn.on('pointerover', () => {
   267|            btn.clear();
   268|            const lighter = this.lightenColor(color, 0x222222);
   269|            btn.fillStyle(borderColor, 1);
   270|            btn.fillCircle(x, y, radius + border);
   271|            btn.fillStyle(lighter, 1);
   272|            btn.fillCircle(x, y, radius);
   273|        });
   274|        btn.on('pointerout', () => {
   275|            btn.clear();
   276|            btn.fillStyle(borderColor, 1);
   277|            btn.fillCircle(x, y, radius + border);
   278|            btn.fillStyle(color, 1);
   279|            btn.fillCircle(x, y, radius);
   280|        });
   281|        btn.on('pointerdown', callback);
   282|    }
   283|
   284|    lightenColor(color, amount) {
   285|        const r = Math.min(255, ((color >> 16) & 0xFF) + ((amount >> 16) & 0xFF));
   286|        const g = Math.min(255, ((color >> 8) & 0xFF) + ((amount >> 8) & 0xFF));
   287|        const b = Math.min(255, (color & 0xFF) + (amount & 0xFF));
   288|        return (r << 16) | (g << 8) | b;
   289|    }
   290|
   291|    darkenColor(color, amount) {
   292|        const r = Math.max(0, ((color >> 16) & 0xFF) - ((amount >> 16) & 0xFF));
   293|        const g = Math.max(0, ((color >> 8) & 0xFF) - ((amount >> 8) & 0xFF));
   294|        const b = Math.max(0, (color & 0xFF) - (amount & 0xFF));
   295|        return (r << 16) | (g << 8) | b;
   296|    }
   297|
   298|    createAdventureButton(x, y) {
   299|        const radius = 45;
   300|        const size = radius * 2;
   301|        const color = 0xaaddcc;
   302|        const borderColor = this.darkenColor(color, 0x222222);
   303|        const border = 2;
   304|
   305|        const btn = this.add.graphics();
   306|        btn.fillStyle(borderColor, 1);
   307|        btn.fillCircle(0, 0, radius + border);
   308|        btn.fillStyle(color, 1);
   309|        btn.fillCircle(0, 0, radius);
   310|        btn.setPosition(x, y);
   311|        // Rectangle hit area that fully contains the circle
   312|        btn.setInteractive(
   313|            new Phaser.Geom.Rectangle(-radius - border, -radius - border, size + border * 2, size + border * 2),
   314|            Phaser.Geom.Rectangle.Contains
   315|        );
   316|        btn.setScrollFactor(0);
   317|
   318|        // World icon
   319|        const icon = this.add.text(x, y - 6, '\ud83c\udf0d', {
   320|            fontSize: '24px',
   321|            fontFamily: 'Poppins',
   322|            stroke: '#000000',
   323|            strokeThickness: 2
   324|        }).setOrigin(0.5).setScrollFactor(0);
   325|
   326|        // Adventure text below icon
   327|        const lbl = this.add.text(x, y + 14, 'Adventure', {
   328|            fontSize: '10px',
   329|            color: '#8888aa',
   330|            fontFamily: 'Poppins',
   331|            fontStyle: 'bold'
   332|        }).setOrigin(0.5).setScrollFactor(0);
   333|
   334|        // Hover effect - brighten (redraw)
   335|        btn.on('pointerover', () => {
   336|            btn.clear();
   337|            const lighter = this.lightenColor(color, 0x222222);
   338|            btn.fillStyle(borderColor, 1);
   339|            btn.fillCircle(0, 0, radius + border);
   340|            btn.fillStyle(lighter, 1);
   341|            btn.fillCircle(0, 0, radius);
   342|        });
   343|        btn.on('pointerout', () => {
   344|            btn.clear();
   345|            btn.fillStyle(borderColor, 1);
   346|            btn.fillCircle(0, 0, radius + border);
   347|            btn.fillStyle(color, 1);
   348|            btn.fillCircle(0, 0, radius);
   349|        });
   350|        btn.on('pointerdown', () => {
   351|            this.scene.start('PlatformerScene');
   352|        });
   353|    }
   354|
   355|    feed() {
   356|        const stats = this.registry.get('stats');
   357|        const inv = this.registry.get('inventory');
   358|
   359|        if (inv.fish > 0) {
   360|            stats.hunger = Math.min(100, stats.hunger + 20);
   361|            stats.energy = Math.min(100, stats.energy + 5);
   362|            stats.hygiene = Math.max(0, stats.hygiene - 10);
   363|            inv.fish--;
   364|            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude0b Yum!');
   365|            this.spawnBurst(this.cat.x, this.cat.y - 20, 'heart', 5);
   366|        } else {
   367|            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude3f No fish!');
   368|        }
   369|
   370|        this.registry.set('stats', stats);
   371|        this.registry.set('inventory', inv);
   372|    }
   373|
   374|    play() {
   375|        const stats = this.registry.get('stats');
   376|        const inv = this.registry.get('inventory');
   377|
   378|        if (stats.energy > 10) {
   379|            stats.happiness = Math.min(100, stats.happiness + 15);
   380|            stats.energy = Math.max(0, stats.energy - 10);
   381|            stats.hygiene = Math.max(0, stats.hygiene - 15);
   382|            inv.toys++;
   383|            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude38 Fun!');
   384|            this.spawnBurst(this.cat.x, this.cat.y - 20, 'star', 6);
   385|
   386|            this.tweens.add({
   387|                targets: this.cat,
   388|                y: this.cat.y - 70,
   389|                duration: 300,
   390|                yoyo: true
   391|            });
   392|        } else {
   393|            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude34 Too tired...');
   394|        }
   395|
   396|        this.registry.set('stats', stats);
   397|        this.registry.set('inventory', inv);
   398|    }
   399|
   400|    sleep() {
   401|        const stats = this.registry.get('stats');
   402|        stats.energy = Math.min(100, stats.energy + 30);
   403|        stats.hunger = Math.max(0, stats.hunger - 10);
   404|        this.registry.set('stats', stats);
   405|
   406|        this.cat.setTexture('cat_sleep');
   407|        this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\udca4 Zzz...');
   408|
   409|        this.time.delayedCall(2000, () => {
   410|            if (this.cat && this.cat.active) {
   411|                this.cat.setTexture('cat_idle');
   412|            }
   413|        });
   414|    }
   415|
   416|    cleanCat() {
   417|        if (!this.canClean) {
   418|            this.showFloatingText(this.cat.x, this.cat.y - 50, '\u23f3 Wait...');
   419|            return;
   420|        }
   421|
   422|        const stats = this.registry.get('stats');
   423|        if (stats.hygiene >= 100) {
   424|            this.showFloatingText(this.cat.x, this.cat.y - 50, '\u2728 Already clean!');
   425|            return;
   426|        }
   427|
   428|        stats.hygiene = Math.min(100, stats.hygiene + 25);
   429|        stats.happiness = Math.min(100, stats.happiness + 5);
   430|        this.registry.set('stats', stats);
   431|
   432|        this.showFloatingText(this.cat.x, this.cat.y - 50, '\ud83e\uddfc Clean!');
   433|        this.spawnBurst(this.cat.x, this.cat.y - 30, 'star', 4);
   434|
   435|        this.tweens.add({
   436|            targets: this.cat,
   437|            scaleX: this.cat.scaleX * 1.07,
   438|            scaleY: this.cat.scaleY * 0.93,
   439|            duration: 150,
   440|            yoyo: true,
   441|            repeat: 2
   442|        });
   443|
   444|        const sparkle = this.add.text(this.cat.x + 30, this.cat.y - 30, '\u2728', {
   445|            fontSize: '22px',
   446|            fontFamily: 'Poppins'
   447|        }).setOrigin(0.5);
   448|        this.tweens.add({
   449|            targets: sparkle,
   450|            y: sparkle.y - 30,
   451|            alpha: 0,
   452|            duration: 800,
   453|            onComplete: () => sparkle.destroy()
   454|        });
   455|
   456|        this.canClean = false;
   457|        this.time.delayedCall(3000, () => {
   458|            this.canClean = true;
   459|        });
   460|    }
   461|
   462|    spawnBurst(x, y, textureKey, count) {
   463|        for (let i = 0; i < count; i++) {
   464|            const p = this.add.image(x, y, textureKey)
   465|                .setScale(0.4 + Math.random() * 0.3)
   466|                .setAlpha(0.9);
   467|            const angle = Math.random() * Math.PI * 2;
   468|            const dist = 20 + Math.random() * 40;
   469|            this.tweens.add({
   470|                targets: p,
   471|                x: x + Math.cos(angle) * dist,
   472|                y: y + Math.sin(angle) * dist - 20,
   473|                alpha: 0,
   474|                scaleX: 0,
   475|                scaleY: 0,
   476|                duration: 600 + Math.random() * 400,
   477|                ease: 'Power2',
   478|                onComplete: () => p.destroy()
   479|            });
   480|        }
   481|    }
   482|
   483|    decayStats() {
   484|        const stats = this.registry.get('stats');
   485|        stats.hunger = Math.max(0, stats.hunger - 2);
   486|        stats.happiness = Math.max(0, stats.happiness - 1);
   487|        stats.energy = Math.max(0, stats.energy - 1);
   488|        stats.hygiene = Math.max(0, stats.hygiene - 0.5);
   489|        this.registry.set('stats', stats);
   490|    }
   491|
   492|    showFloatingText(x, y, text) {
   493|        const txt = this.add.text(x, y, text, {
   494|            fontSize: '16px',
   495|            color: '#ffffff',
   496|            fontFamily: 'Poppins',
   497|            stroke: '#000000',
   498|            strokeThickness: 3
   499|        }).setOrigin(0.5);
   500|
   501|