class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Generate simple pixel-art style textures programmatically
        this.createTexture('cat_idle', '#ff8c42', 32, 32, 'cat');
        this.createTexture('cat_run', '#ff8c42', 32, 32, 'cat');
        this.createTexture('cat_sleep', '#6b6b8a', 32, 32, 'cat_sleep');
        this.createTexture('platform', '#5a4a3a', 32, 32, 'rect');
        this.createTexture('fish', '#ff5555', 16, 16, 'fish');
        this.createTexture('yarn', '#ff88cc', 20, 20, 'circle');
        this.createTexture('box', '#8b6914', 80, 60, 'rect');
        this.createTexture('bowl', '#6666ff', 24, 12, 'rect');
        this.createTexture('bed', '#ffcc88', 48, 32, 'rect');
        this.createTexture('bg_home', '#3a3a5c', 800, 600, 'rect');
        this.createTexture('bg_platformer', '#2a2a4a', 800, 600, 'rect');
        this.createTexture('ground', '#4a7a3a', 32, 32, 'rect');
        this.createTexture('sky', '#87CEEB', 800, 600, 'rect');
        
        // Hide loading screen safely
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }

    createTexture(key, color, w, h, shape) {
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(parseInt(color.replace('#', '0x')), 1);
        
        if (shape === 'cat') {
            // Body
            gfx.fillRect(w*0.25, h*0.3, w*0.5, h*0.5);
            // Head
            gfx.fillCircle(w*0.5, h*0.25, w*0.25);
            // Ears
            gfx.fillTriangle(w*0.3, h*0.1, w*0.4, h*0.25, w*0.2, h*0.3);
            gfx.fillTriangle(w*0.7, h*0.1, w*0.6, h*0.25, w*0.8, h*0.3);
            // Tail
            gfx.fillRect(w*0.75, h*0.4, w*0.15, h*0.35);
            // Eyes
            gfx.fillStyle(0x000000, 1);
            gfx.fillCircle(w*0.42, h*0.22, 2);
            gfx.fillCircle(w*0.58, h*0.22, 2);
        } else if (shape === 'cat_sleep') {
            // Curled up cat
            gfx.fillStyle(parseInt(color.replace('#', '0x')), 1);
            gfx.fillCircle(w*0.5, h*0.55, w*0.3);
            gfx.fillRect(w*0.3, h*0.4, w*0.4, h*0.2);
            // Ears
            gfx.fillTriangle(w*0.3, h*0.35, w*0.4, h*0.45, w*0.25, h*0.5);
            gfx.fillTriangle(w*0.7, h*0.35, w*0.6, h*0.45, w*0.75, h*0.5);
            // Zzz
            gfx.fillStyle(0xffffff, 1);
            gfx.fillText('Z', w*0.7, h*0.3);
        } else if (shape === 'fish') {
            gfx.fillStyle(0xff5555, 1);
            gfx.fillEllipse(w*0.5, h*0.5, w*0.6, h*0.4);
            gfx.fillTriangle(w*0.9, h*0.5, w*0.7, h*0.3, w*0.7, h*0.7);
            gfx.fillStyle(0xffffff, 1);
            gfx.fillCircle(w*0.35, h*0.4, 2);
        } else {
            gfx.fillRect(0, 0, w, h);
        }
        
        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    create() {
        // Initialize cat stats
        this.registry.set('stats', {
            hunger: 80,      // 0-100
            happiness: 70,
            energy: 90,
            hygiene: 100
        });
        this.registry.set('inventory', {
            fish: 0,
            toys: 0
        });
        
        this.scene.start('HomeScene');
    }
}
