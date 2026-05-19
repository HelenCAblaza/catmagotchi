class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Generate cat textures programmatically for pixel-perfect feature placement
        this.createCatIdleTexture('cat_idle');
        this.createCatRunTexture('cat_run');
        this.createCatSleepTexture('cat_sleep');

        // Generate other textures programmatically
        this.createTexture('platform', '#8b7355', 32, 32, 'rect');
        this.createCuteFishTexture('fish');
        this.createCuteYarnTexture('yarn');
        this.createTexture('box', '#c4956a', 80, 60, 'rect');
        this.createBowlTexture('bowl');
        this.createBedTexture('bed');
        this.createHomeBgTexture('bg_home');
        this.createPlatformerBgTexture('bg_platformer');
        this.createTexture('ground', '#5a8a4a', 32, 32, 'rect');
        this.createCloudTexture('cloud');
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

        // Soft pastel purple-pink gradient feel
        gfx.fillStyle(0xf5e6ff, 1);
        gfx.fillRect(0, 0, w, h);

        // Soft clouds
        gfx.fillStyle(0xffffff, 0.4);
        for (let i = 0; i < 6; i++) {
            const cx = (i * 90 + 30) % w;
            const cy = (i * 60 + 50) % (h * 0.4);
            gfx.fillCircle(cx, cy, 25);
            gfx.fillCircle(cx + 20, cy + 5, 20);
            gfx.fillCircle(cx - 15, cy + 8, 18);
        }

        // Tiny stars/sparkles scattered
        gfx.fillStyle(0xffccff, 0.6);
        for (let i = 0; i < 20; i++) {
            const sx = Math.random() * w;
            const sy = Math.random() * h;
            gfx.fillCircle(sx, sy, 2 + Math.random() * 2);
        }

        // Soft floor area
        gfx.fillStyle(0xffeecc, 0.3);
        gfx.fillRect(0, h * 0.55, w, h * 0.45);

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

    createCatIdleTexture(key) {
        const w = 64, h = 64;
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        const cx = 32, cy = 26; // head center
        const hr = 18; // head radius

        // --- BODY ---
        // Tiny body overlapping head bottom by 2-3px
        g.fillStyle(0xffffff, 1);
        g.fillEllipse(cx, cy + hr + 6, 16, 14);
        // Little paws
        g.fillCircle(cx - 8, cy + hr + 14, 4);
        g.fillCircle(cx + 8, cy + hr + 14, 4);

        // --- HEAD (perfect circle) ---
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx, cy, hr);

        // --- EARS (attach to SIDES of head) ---
        // Left ear outer
        g.fillStyle(0xffffff, 1);
        g.fillTriangle(cx - 16, cy - 2, cx - 22, cy - 14, cx - 10, cy - 12);
        // Left ear inner (pink)
        g.fillStyle(0xffbbcc, 1);
        g.fillTriangle(cx - 16, cy - 4, cx - 20, cy - 12, cx - 12, cy - 10);

        // Right ear outer
        g.fillStyle(0xffffff, 1);
        g.fillTriangle(cx + 16, cy - 2, cx + 22, cy - 14, cx + 10, cy - 12);
        // Right ear inner (pink)
        g.fillStyle(0xffbbcc, 1);
        g.fillTriangle(cx + 16, cy - 4, cx + 20, cy - 12, cx + 12, cy - 10);

        // --- EYES (white sclera + brown pupil + sparkle, NO dark outlines) ---
        // Left eye sclera
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx - 7, cy - 2, 4);
        // Left pupil
        g.fillStyle(0x8b5a2b, 1);
        g.fillCircle(cx - 7, cy - 2, 2);
        // Left sparkle
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx - 6, cy - 3, 1);

        // Right eye sclera
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx + 7, cy - 2, 4);
        // Right pupil
        g.fillStyle(0x8b5a2b, 1);
        g.fillCircle(cx + 7, cy - 2, 2);
        // Right sparkle
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx + 8, cy - 3, 1);

        // --- BLUSH (pink circles on cheeks) ---
        g.fillStyle(0xffaabb, 0.9);
        g.fillCircle(cx - 14, cy + 4, 3.5);
        g.fillCircle(cx + 14, cy + 4, 3.5);

        // --- WHISKERS (thin lines from cheeks, 3 per side) ---
        g.lineStyle(1, 0xdddddd, 0.9);
        // Left whiskers
        g.beginPath();
        g.moveTo(cx - 16, cy + 2);  g.lineTo(cx - 22, cy + 0);
        g.moveTo(cx - 16, cy + 4);  g.lineTo(cx - 22, cy + 4);
        g.moveTo(cx - 16, cy + 6);  g.lineTo(cx - 22, cy + 8);
        // Right whiskers
        g.moveTo(cx + 16, cy + 2);  g.lineTo(cx + 22, cy + 0);
        g.moveTo(cx + 16, cy + 4);  g.lineTo(cx + 22, cy + 4);
        g.moveTo(cx + 16, cy + 6);  g.lineTo(cx + 22, cy + 8);
        g.strokePath();

        g.generateTexture(key, w, h);
        g.destroy();
    }

    createCatRunTexture(key) {
        const w = 64, h = 64;
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        const cx = 32, cy = 26;
        const hr = 18;

        // --- BODY (slightly stretched, running pose) ---
        g.fillStyle(0xffffff, 1);
        g.fillEllipse(cx + 2, cy + hr + 6, 18, 13);
        // Paws (one lifted slightly)
        g.fillCircle(cx - 6, cy + hr + 13, 4);
        g.fillCircle(cx + 10, cy + hr + 13, 4);

        // --- HEAD (perfect circle) ---
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx, cy, hr);

        // --- EARS (attach to SIDES) ---
        g.fillStyle(0xffffff, 1);
        g.fillTriangle(cx - 16, cy - 2, cx - 22, cy - 14, cx - 10, cy - 12);
        g.fillStyle(0xffbbcc, 1);
        g.fillTriangle(cx - 16, cy - 4, cx - 20, cy - 12, cx - 12, cy - 10);

        g.fillStyle(0xffffff, 1);
        g.fillTriangle(cx + 16, cy - 2, cx + 22, cy - 14, cx + 10, cy - 12);
        g.fillStyle(0xffbbcc, 1);
        g.fillTriangle(cx + 16, cy - 4, cx + 20, cy - 12, cx + 12, cy - 10);

        // --- EYES (white sclera + brown pupil + sparkle) ---
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx - 7, cy - 2, 4);
        g.fillStyle(0x8b5a2b, 1);
        g.fillCircle(cx - 7, cy - 2, 2);
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx - 6, cy - 3, 1);

        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx + 7, cy - 2, 4);
        g.fillStyle(0x8b5a2b, 1);
        g.fillCircle(cx + 7, cy - 2, 2);
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx + 8, cy - 3, 1);

        // --- BLUSH (on cheeks) ---
        g.fillStyle(0xffaabb, 0.9);
        g.fillCircle(cx - 14, cy + 4, 3.5);
        g.fillCircle(cx + 14, cy + 4, 3.5);

        // --- WHISKERS (from cheeks) ---
        g.lineStyle(1, 0xdddddd, 0.9);
        g.beginPath();
        g.moveTo(cx - 16, cy + 2);  g.lineTo(cx - 22, cy + 0);
        g.moveTo(cx - 16, cy + 4);  g.lineTo(cx - 22, cy + 4);
        g.moveTo(cx - 16, cy + 6);  g.lineTo(cx - 22, cy + 8);
        g.moveTo(cx + 16, cy + 2);  g.lineTo(cx + 22, cy + 0);
        g.moveTo(cx + 16, cy + 4);  g.lineTo(cx + 22, cy + 4);
        g.moveTo(cx + 16, cy + 6);  g.lineTo(cx + 22, cy + 8);
        g.strokePath();

        // --- TAIL (lifted in run) ---
        g.lineStyle(3, 0xffffff, 1);
        g.beginPath();
        g.moveTo(cx + 8, cy + hr + 4);
        g.lineTo(cx + 14, cy + hr - 2);
        g.lineTo(cx + 18, cy + hr - 10);
        g.strokePath();
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx + 18, cy + hr - 10, 3);

        g.generateTexture(key, w, h);
        g.destroy();
    }

    createCatSleepTexture(key) {
        const w = 64, h = 64;
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        const cx = 32, cy = 26;
        const hr = 18;

        // --- BODY (curled a bit) ---
        g.fillStyle(0xffffff, 1);
        g.fillEllipse(cx, cy + hr + 8, 20, 14);
        g.fillCircle(cx - 10, cy + hr + 14, 5);
        g.fillCircle(cx + 10, cy + hr + 14, 5);

        // --- HEAD ---
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx, cy, hr);

        // --- EARS ---
        g.fillStyle(0xffffff, 1);
        g.fillTriangle(cx - 16, cy - 2, cx - 22, cy - 14, cx - 10, cy - 12);
        g.fillStyle(0xffbbcc, 1);
        g.fillTriangle(cx - 16, cy - 4, cx - 20, cy - 12, cx - 12, cy - 10);

        g.fillStyle(0xffffff, 1);
        g.fillTriangle(cx + 16, cy - 2, cx + 22, cy - 14, cx + 10, cy - 12);
        g.fillStyle(0xffbbcc, 1);
        g.fillTriangle(cx + 16, cy - 4, cx + 20, cy - 12, cx + 12, cy - 10);

        // --- CLOSED EYES (curved lines, sleeping) ---
        g.lineStyle(1.5, 0x8b5a2b, 1);
        g.beginPath();
        // Left closed eye (upside-down arc)
        g.arc(cx - 7, cy - 2, 3, Math.PI, 0, false);
        // Right closed eye
        g.arc(cx + 7, cy - 2, 3, Math.PI, 0, false);
        g.strokePath();

        // --- BLUSH (on cheeks) ---
        g.fillStyle(0xffaabb, 0.9);
        g.fillCircle(cx - 14, cy + 4, 3.5);
        g.fillCircle(cx + 14, cy + 4, 3.5);

        // --- WHISKERS (from cheeks) ---
        g.lineStyle(1, 0xdddddd, 0.9);
        g.beginPath();
        g.moveTo(cx - 16, cy + 2);  g.lineTo(cx - 22, cy + 0);
        g.moveTo(cx - 16, cy + 4);  g.lineTo(cx - 22, cy + 4);
        g.moveTo(cx - 16, cy + 6);  g.lineTo(cx - 22, cy + 8);
        g.moveTo(cx + 16, cy + 2);  g.lineTo(cx + 22, cy + 0);
        g.moveTo(cx + 16, cy + 4);  g.lineTo(cx + 22, cy + 4);
        g.moveTo(cx + 16, cy + 6);  g.lineTo(cx + 22, cy + 8);
        g.strokePath();

        // --- Zzz bubble ---
        g.fillStyle(0xaaaaff, 1);
        g.fillCircle(cx + 18, cy - 14, 3);
        g.fillCircle(cx + 22, cy - 20, 2);

        g.generateTexture(key, w, h);
        g.destroy();
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
            fish: 0,
            toys: 0
        });

        this.scene.start('StartScene');
    }
}
