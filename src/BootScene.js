class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load real pixel-art sprites!
        this.load.image('cat_idle', 'assets/cat-idle.png?v=306');
        this.load.image('cat_run', 'assets/cat-run.png?v=326');
        this.load.image('cat_sleep', 'assets/cat-sleep.png?v=306');
        this.load.image('cat_bed', 'assets/cat-bed.png?v=12');
        this.load.image('yarn_toy', 'assets/yarn-toy.png?v=2');
        this.load.image('food_tray', 'assets/food-tray.png?v=7');
        this.load.image('scenery', 'assets/scenery.png?v=2');
        // Mobile-safe background slices: keep each texture under common iOS/Android max texture sizes.
        this.load.image('adventure_bg_0', 'assets/adventure-bg-0.png?v=1');
        this.load.image('adventure_bg_1', 'assets/adventure-bg-1.png?v=1');
        this.load.image('adventure_bg_2', 'assets/adventure-bg-2.png?v=1');
        this.load.image('pond1', 'assets/pond1.png?v=1');
        this.load.image('pond2', 'assets/pond2.png?v=1');
        this.load.image('pond3', 'assets/pond3.png?v=2');
        this.load.image('pond4', 'assets/pond4.png?v=1');
        this.load.image('tree1', 'assets/tree1.png?v=3');
        this.load.image('tree2', 'assets/tree2.png?v=6');
        this.load.image('tree3', 'assets/tree3.png?v=3');
        this.load.image('flower', 'assets/flower.png?v=1');
        this.load.image('bush', 'assets/bush.png?v=1');
        this.load.image('rock', 'assets/rock.png?v=1');

        // Generate other textures programmatically
        this.createTexture('platform', '#8b7355', 32, 32, 'rect');
        this.createCuteFishTexture('fish');
        this.createCuteYarnTexture('yarn');
        this.createTexture('box', '#c4956a', 80, 60, 'rect');
        this.createHomeBgTexture('bg_home');
        this.createPlatformerBgTexture('bg_platformer');
        this.load.image('ground', 'assets/ground.png?v=9');
        this.createCloudTexture('cloud1');
        this.createCloudTexture('cloud2');
        this.createCloudTexture('cloud3');
        this.createBirdTexture('bird');
        this.createHeartTexture('heart');
        this.createStarTexture('star');

        // Hide loading screen safely
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }

    createCuteFishTexture(key) {
        const w = 20, h = 14;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });

        // Fish body (cuter ellipse)
        gfx.fillStyle(0xff7799, 1);
        gfx.fillEllipse(w * 0.45, h * 0.5, w * 0.65, h * 0.55);

        // Tail (heart-shaped-ish)
        gfx.fillStyle(0xff5577, 1);
        gfx.fillTriangle(w * 0.82, h * 0.5, w * 0.65, h * 0.2, w * 0.65, h * 0.8);

        // Dorsal fin
        gfx.fillStyle(0xff5577, 0.8);
        gfx.fillTriangle(w * 0.35, h * 0.15, w * 0.50, h * 0.35, w * 0.25, h * 0.35);

        // Big eye
        gfx.fillStyle(0xffffff, 1);
        gfx.fillCircle(w * 0.30, h * 0.40, 3);
        gfx.fillStyle(0x000000, 1);
        gfx.fillCircle(w * 0.31, h * 0.42, 1.5);
        gfx.fillStyle(0xffffff, 1);
        gfx.fillCircle(w * 0.32, h * 0.38, 0.8);

        // Sparkle
        gfx.fillStyle(0xffffff, 0.8);
        gfx.fillCircle(w * 0.15, h * 0.20, 1);
        gfx.fillCircle(w * 0.70, h * 0.25, 0.8);

        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    createCuteYarnTexture(key) {
        const w = 20, h = 20;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });

        // Yarn ball (swirly)
        gfx.fillStyle(0xff99cc, 1);
        gfx.fillCircle(w * 0.5, h * 0.5, w * 0.4);

        // Swirl lines
        gfx.lineStyle(1.5, 0xff66aa, 0.7);
        gfx.beginPath();
        gfx.arc(w * 0.5, h * 0.5, w * 0.25, 0, Math.PI * 1.5);
        gfx.strokePath();
        gfx.beginPath();
        gfx.arc(w * 0.5, h * 0.5, w * 0.15, 0.5, Math.PI * 1.8);
        gfx.strokePath();

        // Loose string
        gfx.lineStyle(1, 0xff66aa, 0.6);
        gfx.beginPath();
        gfx.moveTo(w * 0.65, h * 0.55);
        gfx.lineTo(w * 0.85, h * 0.75);
        gfx.strokePath();

        // Shine dot
        gfx.fillStyle(0xffffff, 0.7);
        gfx.fillCircle(w * 0.35, h * 0.35, 1.5);

        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    createBowlTexture(key) {
        const w = 24, h = 14;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });

        // Bowl body
        gfx.fillStyle(0x8899ee, 1);
        gfx.fillEllipse(w * 0.5, h * 0.65, w * 0.8, h * 0.6);

        // Bowl rim
        gfx.fillStyle(0xaabbff, 1);
        gfx.fillEllipse(w * 0.5, h * 0.35, w * 0.75, h * 0.35);

        // Water/food inside
        gfx.fillStyle(0x66aaff, 0.6);
        gfx.fillEllipse(w * 0.5, h * 0.40, w * 0.55, h * 0.22);

        // Shine
        gfx.fillStyle(0xffffff, 0.5);
        gfx.fillEllipse(w * 0.35, h * 0.30, w * 0.15, h * 0.08);

        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    createBedTexture(key) {
        const w = 48, h = 32;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });

        // Bed base
        gfx.fillStyle(0xffbbaa, 1);
        gfx.fillRoundedRect(w * 0.1, h * 0.4, w * 0.8, h * 0.5, 6);

        // Mattress (lighter)
        gfx.fillStyle(0xffddcc, 1);
        gfx.fillRoundedRect(w * 0.12, h * 0.42, w * 0.76, h * 0.4, 5);

        // Pillow
        gfx.fillStyle(0xffffff, 0.9);
        gfx.fillEllipse(w * 0.25, h * 0.45, w * 0.25, h * 0.2);

        // Blanket (folded at bottom)
        gfx.fillStyle(0xff99aa, 0.8);
        gfx.fillRoundedRect(w * 0.15, h * 0.55, w * 0.7, h * 0.3, 4);

        // Little heart on blanket
        gfx.fillStyle(0xff5577, 0.7);
        const hx = w * 0.5, hy = h * 0.72, hs = 2;
        gfx.fillCircle(hx - hs, hy, hs);
        gfx.fillCircle(hx + hs, hy, hs);
        gfx.fillTriangle(hx - hs * 2.2, hy + hs * 0.3, hx + hs * 2.2, hy + hs * 0.3, hx, hy + hs * 2.5);

        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    createHomeBgTexture(key) {
        const w = 480, h = 800;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });

        // Warm cozy room backdrop
        gfx.fillStyle(0xfff7ec, 1);
        gfx.fillRect(0, 0, w, h);

        // Wall and floor split
        gfx.fillStyle(0xf8ddd5, 1);
        gfx.fillRect(0, 0, w, h * 0.54);
        gfx.fillStyle(0xf0d8d0, 1);
        gfx.fillRect(0, h * 0.54, w, h * 0.46);
        gfx.fillStyle(0xe0c4b8, 1);
        gfx.fillRect(0, h * 0.535, w, 3);

        // Wood floor planks for cozy detail
        gfx.fillStyle(0xead0c8, 1);
        const floorStart = h * 0.54;
        const plankGap = 28;
        for (let py = floorStart + plankGap; py < h; py += plankGap) {
            gfx.fillRect(0, py, w, 2);
        }
        gfx.fillStyle(0xe4ccc4, 0.35);
        for (let py = floorStart + plankGap * 2; py < h; py += plankGap * 2) {
            gfx.fillRect(0, py - plankGap + 2, w, plankGap - 2);
        }

        // Cute wall detail: tiny floating shelf with a succulent plant
        const shelfX = 185;
        const shelfY = 118;
        gfx.fillStyle(0xe0ccc4, 1);
        gfx.fillRect(shelfX - 2, shelfY + 3, 36, 4);
        gfx.fillStyle(0xc4a498, 1);
        gfx.fillRect(shelfX - 2, shelfY, 36, 4);
        gfx.fillStyle(0xd8b0a0, 1);
        gfx.fillRect(shelfX - 2, shelfY - 1, 36, 2);
        gfx.fillStyle(0xd68a7a, 1);
        gfx.fillRect(shelfX + 6, shelfY - 8, 14, 9);
        gfx.fillStyle(0xe8a8a0, 1);
        gfx.fillRect(shelfX + 8, shelfY - 10, 10, 3);
        gfx.fillStyle(0x88cc88, 1);
        gfx.fillCircle(shelfX + 13, shelfY - 14, 4);
        gfx.fillCircle(shelfX + 10, shelfY - 11, 3);
        gfx.fillCircle(shelfX + 16, shelfY - 11, 3);
        gfx.fillStyle(0xaaddaa, 1);
        gfx.fillCircle(shelfX + 13, shelfY - 16, 2);
        gfx.fillCircle(shelfX + 11, shelfY - 13, 2);
        gfx.fillCircle(shelfX + 15, shelfY - 13, 2);

        // Window glow
        const winX = w * 0.65;
        const winY = 88;
        const winW = 138;
        const winH = 160;
        const ft = 8;

        // Outer wall shadow
        gfx.fillStyle(0xc4a882, 1);
        gfx.fillRoundedRect(winX - 6, winY - 6, winW + 12, winH + 12, 14);
        // Outer frame (dark wood)
        gfx.fillStyle(0x8a6e4b, 1);
        gfx.fillRoundedRect(winX, winY, winW, winH, 12);
        // Inner frame (lighter wood)
        gfx.fillStyle(0xbc9466, 1);
        gfx.fillRoundedRect(winX + 3, winY + 3, winW - 6, winH - 6, 10);
        // Glass pane
        gfx.fillStyle(0xb8e8ff, 1);
        gfx.fillRoundedRect(winX + ft, winY + ft, winW - ft * 2, winH - ft * 2, 6);
        // Sky gradient hint
        gfx.fillStyle(0xe0f4ff, 0.6);
        gfx.fillRoundedRect(winX + ft + 4, winY + ft + 4, winW - ft * 2 - 8, 50, 4);
        // Cross bars
        const barColor = 0xf5efe6;
        gfx.fillStyle(barColor, 1);
        gfx.fillRect(winX + ft, winY + winH / 2 - 3, winW - ft * 2, 6);
        gfx.fillRect(winX + winW / 2 - 3, winY + ft, 6, winH - ft * 2);
        // Sill
        gfx.fillStyle(0x9c7a52, 1);
        gfx.fillRect(winX - 10, winY + winH - 6, winW + 20, 14);
        gfx.fillStyle(0xb08d64, 1);
        gfx.fillRect(winX - 8, winY + winH - 8, winW + 16, 6);
        gfx.fillStyle(0xd8b0a0, 1);
        gfx.fillRect(winX - 6, winY + winH - 8, winW + 12, 2);
        // Reflection
        gfx.fillStyle(0xffffff, 0.35);
        gfx.fillRect(winX + ft + 10, winY + ft + 12, 18, 3);
        gfx.fillRect(winX + ft + 14, winY + ft + 18, 10, 2);

        // Picture frame
        gfx.fillStyle(0xd8b18a, 1);
        gfx.fillRoundedRect(48, 86, 98, 74, 10);
        gfx.fillStyle(0xffffff, 1);
        gfx.fillRoundedRect(54, 92, 86, 62, 8);
        gfx.fillStyle(0xffb8cc, 1);
        gfx.fillCircle(90, 120, 11);
        gfx.fillCircle(110, 115, 6);
        gfx.fillCircle(118, 126, 5);

        // Little rug
        gfx.fillStyle(0xffe0d6, 0.92);
        gfx.fillEllipse(w * 0.5, h * 0.79, 250, 74);
        gfx.fillStyle(0xffc7d6, 0.45);
        gfx.fillEllipse(w * 0.5, h * 0.79, 170, 48);

        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    createPlatformerBgTexture(key) {
        const w = 480, h = 800;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });

        // Sky blue
        gfx.fillStyle(0xaaddff, 1);
        gfx.fillRect(0, 0, w, h);

        // Soft clouds
        gfx.fillStyle(0xffffff, 0.5);
        for (let i = 0; i < 8; i++) {
            const cx = (i * 70 + 20) % w;
            const cy = (i * 50 + 30) % (h * 0.35);
            gfx.fillCircle(cx, cy, 22);
            gfx.fillCircle(cx + 18, cy + 3, 18);
            gfx.fillCircle(cx - 12, cy + 6, 16);
        }

        // Distant hills (soft green)
        gfx.fillStyle(0x88cc88, 0.4);
        gfx.beginPath();
        gfx.moveTo(0, h * 0.45);
        for (let x = 0; x <= w; x += 40) {
            gfx.lineTo(x, h * 0.45 - Math.sin(x / 80) * 30);
        }
        gfx.lineTo(w, h);
        gfx.lineTo(0, h);
        gfx.closePath();
        gfx.fillPath();

        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    createCloudTexture(key) {
        let w, h, puffs;
        if (key === 'cloud1') {
            w = 86; h = 44;
            puffs = [[16, 25, 14], [31, 18, 19], [50, 18, 20], [69, 25, 14], [27, 29, 15], [53, 30, 17]];
        } else if (key === 'cloud2') {
            w = 104; h = 52;
            puffs = [[17, 30, 15], [32, 22, 20], [51, 18, 23], [72, 23, 20], [88, 31, 14], [37, 34, 17], [65, 35, 18]];
        } else {
            w = 70; h = 36;
            puffs = [[14, 22, 12], [27, 16, 16], [43, 17, 17], [57, 23, 11], [31, 25, 13], [47, 26, 12]];
        }
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });

        // Round, fluffy cloud made only from overlapping puffs — no flat rectangle body.
        gfx.fillStyle(0xe2eeff, 0.7);
        for (const [x, y, r] of puffs) {
            gfx.fillCircle(x, y + 3, r);
        }

        puffs.forEach(([x, y, r], i) => {
            gfx.fillStyle(i % 2 === 0 ? 0xf8fcff : 0xffffff, 0.94);
            gfx.fillCircle(x, y, r);
        });

        // Small bright top puffs make the clouds feel softer and more kawaii.
        const highlights = puffs.slice(1, 4);
        gfx.fillStyle(0xffffff, 1);
        for (const [x, y, r] of highlights) {
            gfx.fillCircle(x - 2, y - 3, Math.max(3, r * 0.32));
        }

        gfx.fillStyle(0xffffff, 0.85);
        gfx.fillCircle(w * 0.28, h * 0.30, 2);
        gfx.fillCircle(w * 0.48, h * 0.22, 2);
        gfx.fillCircle(w * 0.66, h * 0.34, 2);

        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    createBirdTexture(key) {
        const w = 36, h = 22;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });

        // Thin, light, simple cute sky bird.
        gfx.fillStyle(0xffffff, 1);
        gfx.fillEllipse(17, 13.5, 14, 7);
        gfx.fillEllipse(25.5, 10.5, 9, 7);

        // Very soft belly shading.
        gfx.fillStyle(0xf8f8f9, 1);
        gfx.fillEllipse(18, 15.5, 8, 3);

        // Pale grey tail feathers — light enough to stay cute.
        gfx.fillStyle(0xacacb2, 1);
        gfx.fillTriangle(11, 12, 4, 10, 8, 13);
        gfx.fillStyle(0xcdcdd3, 1);
        gfx.fillTriangle(11, 15, 4, 17, 8, 14);

        // Slim pale wings, not bat-like.
        gfx.fillStyle(0xacacb2, 1);
        gfx.fillTriangle(16, 11, 12, 4, 15, 5);
        gfx.fillTriangle(16, 11, 15, 5, 19, 11);
        gfx.fillStyle(0xcdcdd3, 1);
        gfx.fillTriangle(21, 11, 26, 4, 28, 7);
        gfx.fillTriangle(21, 11, 28, 7, 23, 12);
        gfx.fillStyle(0xf8f8f9, 1);
        gfx.fillEllipse(16, 8, 4, 6);
        gfx.fillStyle(0xffffff, 1);
        gfx.fillEllipse(26, 8, 4, 6);

        // Tiny face, beak, blush, and feet.
        gfx.fillStyle(0xf7ca60, 1);
        gfx.fillTriangle(29, 10, 35, 12, 29, 14);
        gfx.fillStyle(0x74747a, 1);
        gfx.fillEllipse(26, 10, 2.3, 2.3);
        gfx.fillStyle(0xffffff, 1);
        gfx.fillCircle(26.5, 9.5, 0.5);
        gfx.fillStyle(0xffc6d0, 1);
        gfx.fillCircle(23, 13, 0.8);
        gfx.fillStyle(0xf7ca60, 1);
        gfx.fillCircle(16, 18, 0.6);
        gfx.fillCircle(20, 18, 0.6);

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

        // Shine
        gfx.fillStyle(0xffffff, 0.6);
        gfx.fillCircle(s * 0.2, s * 0.2, s * 0.08);

        gfx.generateTexture(key, s, s);
        gfx.destroy();
    }

    createStarTexture(key) {
        const s = 12;
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });

        gfx.fillStyle(0xffff88, 1);
        const cx = s / 2, cy = s / 2;
        const outer = s * 0.45;
        const inner = s * 0.2;
        const points = [];
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? outer : inner;
            const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
            points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
        }
        gfx.beginPath();
        gfx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            gfx.lineTo(points[i].x, points[i].y);
        }
        gfx.closePath();
        gfx.fillPath();

        gfx.generateTexture(key, s, s);
        gfx.destroy();
    }

    createTexture(key, color, w, h, shape) {
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(parseInt(color.replace('#', '0x')), 1);
        if (shape === 'rect') {
            gfx.fillRect(0, 0, w, h);
        } else {
            gfx.fillCircle(w / 2, h / 2, w / 2);
        }
        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    create() {
        // Initialize cat stats
        this.registry.set('stats', {
            hunger: 80,
            happiness: 70,
            energy: 90,
            hygiene: 100
        });
        this.registry.set('inventory', {
            fish: 2,
            toys: 2
        });

        this.scene.start('StartScene');
    }
}
