class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    create() {
        const W = this.scale.width;   // 480
        const H = this.scale.height;  // 800

        // Background (furthest back)
        const bg = this.add.image(W / 2, H / 2, 'bg_home');
        bg.setDisplaySize(W, H);
        bg.setDepth(-20);

        // Cozy room overlay: warm walls, wood floor, window, picture, and rug
        const room = this.add.graphics();
        room.setDepth(-10);
        room.fillStyle(0xecdac8, 1);
        room.fillRect(0, 0, W, H * 0.54);
        room.fillStyle(0xe0d4c8, 1);
        room.fillRect(0, H * 0.54, W, H * 0.46);
        room.fillStyle(0xc4b8a8, 1);
        room.fillRect(0, H * 0.535, W, 3);

        // Wood floor planks for cozy detail
        room.fillStyle(0xd9cdc2, 1);
        const floorStart = H * 0.54;
        const plankGap = 28;
        for (let py = floorStart + plankGap; py < H; py += plankGap) {
            room.fillRect(0, py, W, 2);
        }
        // Subtle plank shading (alternating every other plank)
        room.fillStyle(0xd5c9be, 0.35);
        for (let py = floorStart + plankGap * 2; py < H; py += plankGap * 2) {
            room.fillRect(0, py - plankGap + 2, W, plankGap - 2);
        }

        // Cute wall detail: tiny floating shelf with a succulent plant
        // Placed close to the picture frame
        const shelfX = 150;
        const shelfY = 340;
        // Shelf shadow
        room.fillStyle(0xccb8a5, 1);
        room.fillRect(shelfX - 2, shelfY + 3, 36, 4);
        // Shelf board
        room.fillStyle(0xbfa890, 1);
        room.fillRect(shelfX - 2, shelfY, 36, 4);
        room.fillStyle(0xd4b896, 1);
        room.fillRect(shelfX - 2, shelfY - 1, 36, 2);
        // Tiny pot
        room.fillStyle(0xd68a7a, 1);
        room.fillRect(shelfX + 6, shelfY - 8, 14, 9);
        room.fillStyle(0xe8a090, 1);
        room.fillRect(shelfX + 8, shelfY - 10, 10, 3);
        // Plant leaves
        room.fillStyle(0x88cc88, 1);
        room.fillCircle(shelfX + 13, shelfY - 14, 4);
        room.fillCircle(shelfX + 10, shelfY - 11, 3);
        room.fillCircle(shelfX + 16, shelfY - 11, 3);
        room.fillStyle(0xaaddaa, 1);
        room.fillCircle(shelfX + 13, shelfY - 16, 2);
        room.fillCircle(shelfX + 11, shelfY - 13, 2);
        room.fillCircle(shelfX + 15, shelfY - 13, 2);

        // === 3D Window ===
        const winX = W * 0.65;
        const winY = 250;
        const winW = 130;
        const winH = 105;
        const frameThick = 6;

        // Outer wall shadow (lighter, gives depth that the frame protrudes)
        room.fillStyle(0xe0d4c8, 1);
        room.fillRoundedRect(winX - 6, winY - 6, winW + 12, winH + 12, 14);

        // Outer frame (light warm wood)
        room.fillStyle(0xe0c8a0, 1);
        room.fillRoundedRect(winX, winY, winW, winH, 12);

        // Inner frame (lighter tan face)
        room.fillStyle(0xf0dcc0, 1);
        room.fillRoundedRect(winX + 3, winY + 3, winW - 6, winH - 6, 10);

        // Glass pane (sky)
        room.fillStyle(0xb8e8ff, 1);
        room.fillRoundedRect(winX + frameThick, winY + frameThick, winW - frameThick * 2, winH - frameThick * 2, 6);

        // Sky gradient hint (top lighter, bottom slightly deeper)
        room.fillStyle(0xe0f4ff, 0.6);
        room.fillRoundedRect(winX + frameThick + 4, winY + frameThick + 4, winW - frameThick * 2 - 8, 40, 4);

        // Window cross bars (white wood)
        const barColor = 0xf5efe6;
        room.fillStyle(barColor, 1);
        // Horizontal bar
        room.fillRect(winX + frameThick, winY + winH / 2 - 3, winW - frameThick * 2, 6);
        // Vertical bar
        room.fillRect(winX + winW / 2 - 3, winY + frameThick, 6, winH - frameThick * 2);

        // Window sill (light 3D protruding ledge at bottom)
        room.fillStyle(0xe0c8a0, 1);
        room.fillRect(winX - 10, winY + winH - 6, winW + 20, 14);
        room.fillStyle(0xf0dcc0, 1);
        room.fillRect(winX - 8, winY + winH - 8, winW + 16, 6);
        // Sill highlight
        room.fillStyle(0xfae8cc, 1);
        room.fillRect(winX - 6, winY + winH - 8, winW + 12, 2);

        // White pixel accents on window frame for balance
        room.fillStyle(0xffffff, 0.6);
        // Top edge scattered pixels
        room.fillRect(winX + 6, winY + 6, 3, 3);
        room.fillRect(winX + 12, winY + 8, 2, 2);
        room.fillRect(winX + 18, winY + 5, 2, 2);
        room.fillRect(winX + 24, winY + 7, 3, 3);
        room.fillRect(winX + 30, winY + 9, 2, 2);
        room.fillRect(winX + 36, winY + 6, 2, 2);
        room.fillRect(winX + 42, winY + 8, 3, 3);
        room.fillRect(winX + 48, winY + 5, 2, 2);
        room.fillRect(winX + 54, winY + 7, 3, 3);
        room.fillRect(winX + 60, winY + 9, 2, 2);
        room.fillRect(winX + 66, winY + 6, 2, 2);
        room.fillRect(winX + 72, winY + 8, 3, 3);
        room.fillRect(winX + 78, winY + 5, 2, 2);
        room.fillRect(winX + 84, winY + 7, 2, 2);
        room.fillRect(winX + 90, winY + 9, 3, 3);
        room.fillRect(winX + 96, winY + 6, 2, 2);
        room.fillRect(winX + 102, winY + 8, 2, 2);
        room.fillRect(winX + 108, winY + 5, 3, 3);
        room.fillRect(winX + 114, winY + 7, 2, 2);
        room.fillRect(winX + 120, winY + 9, 2, 2);
        // Right edge pixels
        room.fillRect(winX + winW - 10, winY + 10, 3, 3);
        room.fillRect(winX + winW - 16, winY + 7, 2, 2);
        room.fillRect(winX + winW - 22, winY + 9, 2, 2);
        room.fillRect(winX + winW - 28, winY + 6, 3, 3);
        room.fillRect(winX + winW - 34, winY + 8, 2, 2);
        room.fillRect(winX + winW - 40, winY + 10, 2, 2);
        room.fillRect(winX + winW - 10, winY + 20, 2, 2);
        room.fillRect(winX + winW - 8, winY + 30, 3, 3);
        room.fillRect(winX + winW - 12, winY + 40, 2, 2);
        room.fillRect(winX + winW - 10, winY + 50, 3, 3);
        room.fillRect(winX + winW - 8, winY + 60, 2, 2);
        room.fillRect(winX + winW - 12, winY + 70, 3, 3);
        room.fillRect(winX + winW - 10, winY + 80, 2, 2);
        // Left edge pixels
        room.fillRect(winX + 6, winY + 15, 3, 3);
        room.fillRect(winX + 8, winY + 25, 2, 2);
        room.fillRect(winX + 6, winY + 35, 3, 3);
        room.fillRect(winX + 8, winY + 45, 2, 2);
        room.fillRect(winX + 6, winY + 55, 3, 3);
        room.fillRect(winX + 8, winY + 65, 2, 2);
        room.fillRect(winX + 6, winY + 75, 3, 3);
        room.fillRect(winX + 8, winY + 85, 2, 2);
        room.fillRect(winX + 6, winY + 95, 3, 3);
        // Bottom edge pixels
        room.fillRect(winX + winW - 10, winY + winH - 20, 3, 3);
        room.fillRect(winX + 8, winY + winH - 14, 2, 2);
        room.fillRect(winX + 14, winY + winH - 18, 3, 3);
        room.fillRect(winX + 20, winY + winH - 12, 2, 2);
        room.fillRect(winX + 26, winY + winH - 16, 3, 3);
        room.fillRect(winX + 32, winY + winH - 10, 2, 2);
        room.fillRect(winX + 38, winY + winH - 14, 2, 2);
        room.fillRect(winX + 44, winY + winH - 20, 3, 3);
        room.fillRect(winX + 50, winY + winH - 12, 2, 2);
        room.fillRect(winX + 56, winY + winH - 18, 3, 3);
        room.fillRect(winX + 62, winY + winH - 10, 2, 2);
        room.fillRect(winX + 68, winY + winH - 16, 3, 3);
        room.fillRect(winX + 74, winY + winH - 12, 2, 2);
        room.fillRect(winX + 80, winY + winH - 20, 3, 3);
        room.fillRect(winX + 86, winY + winH - 10, 2, 2);
        room.fillRect(winX + 92, winY + winH - 16, 3, 3);
        room.fillRect(winX + 98, winY + winH - 12, 2, 2);
        room.fillRect(winX + 104, winY + winH - 18, 3, 3);
        room.fillRect(winX + 110, winY + winH - 10, 2, 2);
        room.fillRect(winX + 116, winY + winH - 16, 3, 3);
        room.fillRect(winX + 122, winY + winH - 12, 2, 2);

        // Glass highlight / reflection streak
        room.fillStyle(0xffffff, 0.35);
        room.fillRect(winX + frameThick + 10, winY + frameThick + 12, 18, 3);
        room.fillRect(winX + frameThick + 14, winY + frameThick + 18, 10, 2);

        // === Cute flower pot on window sill ===
        const potX = winX + winW - 32;
        const potY = winY + winH - 21;
        // Pot shadow
        room.fillStyle(0xccb8a5, 1);
        room.fillRect(potX - 2, potY + 4, 26, 5);
        // Pot body
        room.fillStyle(0xd68a7a, 1);
        room.fillRoundedRect(potX, potY, 22, 18, 3);
        // Pot rim highlight
        room.fillStyle(0xe8a090, 1);
        room.fillRect(potX + 2, potY, 18, 4);
        // Soil
        room.fillStyle(0x8a6e50, 1);
        room.fillRect(potX + 4, potY - 2, 14, 4);
        // Stem
        room.fillStyle(0x66aa66, 1);
        room.fillRect(potX + 10, potY - 18, 2, 16);
        // Leaves
        room.fillStyle(0x88cc88, 1);
        room.fillCircle(potX + 6, potY - 12, 4);
        room.fillCircle(potX + 16, potY - 14, 4);
        room.fillStyle(0xaaddaa, 1);
        room.fillCircle(potX + 5, potY - 16, 3);
        room.fillCircle(potX + 17, potY - 18, 3);
        // Pink flower blossom
        room.fillStyle(0xff99bb, 1);
        room.fillCircle(potX + 11, potY - 24, 5);
        room.fillCircle(potX + 8, potY - 22, 4);
        room.fillCircle(potX + 14, potY - 22, 4);
        room.fillStyle(0xffbbdd, 1);
        room.fillCircle(potX + 11, potY - 26, 3);
        // Flower center
        room.fillStyle(0xffeeaa, 1);
        room.fillCircle(potX + 11, potY - 24, 2);

        // === 3D Picture Frame ===
        const picX = 60;
        const picY = 258;
        const picW = 82;
        const picH = 62;
        const picThick = 5;

        // Outer shadow (recessed into wall)
        room.fillStyle(0xc4b08a, 1);
        room.fillRoundedRect(picX - 3, picY - 3, picW + 6, picH + 6, 8);

        // Outer frame (light warm wood)
        room.fillStyle(0xe0c8a0, 1);
        room.fillRoundedRect(picX, picY, picW, picH, 6);

        // Outer frame top highlight (3D light catch)
        room.fillStyle(0xf0dcc0, 1);
        room.fillRoundedRect(picX, picY, picW, 5, 3);

        // Outer frame right/bottom shadow (3D depth)
        room.fillStyle(0xd0b890, 1);
        room.fillRect(picX + picW - 4, picY + 3, 4, picH - 6);
        room.fillRect(picX + 3, picY + picH - 4, picW - 6, 4);

        // Inner frame inset rim
        room.fillStyle(0xf5efe6, 1);
        room.fillRoundedRect(picX + 4, picY + 4, picW - 8, picH - 8, 4);

        // White pixel accents on picture frame for balance
        room.fillStyle(0xffffff, 0.6);
        room.fillRect(picX + 6, picY + 6, 3, 3);
        room.fillRect(picX + 10, picY + 9, 2, 2);
        room.fillRect(picX + 14, picY + 5, 2, 2);
        room.fillRect(picX + 18, picY + 8, 3, 3);
        room.fillRect(picX + 22, picY + 6, 2, 2);
        room.fillRect(picX + 26, picY + 10, 2, 2);
        room.fillRect(picX + 30, picY + 7, 3, 3);
        room.fillRect(picX + 34, picY + 5, 2, 2);
        room.fillRect(picX + picW - 10, picY + 5, 3, 3);
        room.fillRect(picX + picW - 7, picY + 10, 2, 2);
        room.fillRect(picX + picW - 14, picY + 7, 2, 2);
        room.fillRect(picX + picW - 18, picY + 11, 3, 3);
        room.fillRect(picX + picW - 22, picY + 6, 2, 2);
        room.fillRect(picX + picW - 26, picY + 9, 2, 2);
        room.fillRect(picX + 8, picY + picH - 8, 2, 2);
        room.fillRect(picX + 12, picY + picH - 11, 3, 3);
        room.fillRect(picX + 16, picY + picH - 6, 2, 2);
        room.fillRect(picX + 20, picY + picH - 13, 3, 3);
        room.fillRect(picX + 24, picY + picH - 8, 2, 2);
        room.fillRect(picX + 28, picY + picH - 11, 2, 2);
        room.fillRect(picX + 32, picY + picH - 6, 3, 3);
        room.fillRect(picX + picW - 12, picY + picH - 10, 3, 3);
        room.fillRect(picX + picW - 16, picY + picH - 6, 2, 2);
        room.fillRect(picX + picW - 20, picY + picH - 13, 3, 3);
        room.fillRect(picX + picW - 24, picY + picH - 8, 2, 2);
        room.fillRect(picX + picW - 28, picY + picH - 11, 2, 2);
        room.fillRect(picX + picW - 32, picY + picH - 6, 3, 3);

        // Inner frame shadow inside inset
        room.fillStyle(0xe0d4c8, 1);
        room.fillRoundedRect(picX + 6, picY + 6, picW - 12, picH - 12, 3);

        // === Lovely photo inside: nature sunset landscape ===
        const photoX = picX + picThick;
        const photoY = picY + picThick;
        const photoW = picW - picThick * 2;
        const photoH = picH - picThick * 2;

        // Sunset sky gradient bands (pink → peach → yellow → cream)
        room.fillStyle(0xffb8cc, 1);  // soft pink top
        room.fillRoundedRect(photoX, photoY, photoW, photoH * 0.35, 3);
        room.fillStyle(0xffccaa, 1);  // peach
        room.fillRoundedRect(photoX, photoY + photoH * 0.35, photoW, photoH * 0.25, 0);
        room.fillStyle(0xffddaa, 1);  // warm yellow
        room.fillRoundedRect(photoX, photoY + photoH * 0.60, photoW, photoH * 0.20, 0);
        room.fillStyle(0xffeedd, 1);  // cream bottom
        room.fillRoundedRect(photoX, photoY + photoH * 0.80, photoW, photoH * 0.20, 0);

        // Setting sun
        room.fillStyle(0xffaa88, 1);
        room.fillCircle(photoX + photoW * 0.65, photoY + photoH * 0.45, 7);
        room.fillStyle(0xffccaa, 1);
        room.fillCircle(photoX + photoW * 0.65, photoY + photoH * 0.43, 4);

        // Pixel-style rolling hills (stay inside photo bounds)
        room.fillStyle(0x88bb88, 1);
        // Left back hill
        room.fillRoundedRect(photoX, photoY + photoH * 0.72, photoW * 0.5, photoH * 0.28, 3);
        // Right back hill
        room.fillRoundedRect(photoX + photoW * 0.5, photoY + photoH * 0.75, photoW * 0.5, photoH * 0.25, 3);
        room.fillStyle(0x66aa66, 1);
        // Front center hill
        room.fillRoundedRect(photoX + photoW * 0.15, photoY + photoH * 0.78, photoW * 0.7, photoH * 0.22, 3);

        // Tiny tree on front hill (stays inside)
        room.fillStyle(0x558855, 1);
        // Trunk
        room.fillRect(photoX + photoW * 0.4 - 1, photoY + photoH * 0.62, 2, 8);
        // Canopy (pixel blocks)
        room.fillRect(photoX + photoW * 0.4 - 4, photoY + photoH * 0.55, 8, 4);
        room.fillRect(photoX + photoW * 0.4 - 3, photoY + photoH * 0.52, 6, 3);
        room.fillStyle(0x77bb77, 1);
        room.fillRect(photoX + photoW * 0.4 - 2, photoY + photoH * 0.50, 4, 2);

        // Tiny pixel flowers in foreground
        room.fillStyle(0xff99bb, 1);
        room.fillRect(photoX + photoW * 0.1, photoY + photoH * 0.88, 2, 2);
        room.fillRect(photoX + photoW * 0.85, photoY + photoH * 0.90, 2, 2);
        room.fillStyle(0xffbbdd, 1);
        room.fillRect(photoX + photoW * 0.2, photoY + photoH * 0.92, 2, 2);
        room.fillRect(photoX + photoW * 0.75, photoY + photoH * 0.86, 2, 2);

        // === Artist Painting Corner (right corner of room) ===
        const artX = 406;
        const artY = 378;

        // Floor shadow under easel
        room.fillStyle(0xccb8a5, 0.6);
        room.fillRoundedRect(artX + 5, artY + 60, 43, 9, 4);

        // Easel back leg
        room.fillStyle(0xa08060, 1);
        room.fillRect(artX + 30, artY + 10, 4, 54);
        // Easel front left leg
        room.fillStyle(0xbfa080, 1);
        room.fillRect(artX + 10, artY + 28, 4, 41);
        // Easel front right leg
        room.fillRect(artX + 44, artY + 28, 4, 41);

        // Canvas board
        room.fillStyle(0xfaf8f5, 1);
        room.fillRoundedRect(artX + 12, artY, 35, 41, 2);
        // Canvas inner
        room.fillStyle(0xffffff, 1);
        room.fillRoundedRect(artX + 14, artY + 2, 30, 37, 1);

        // Tiny painting on canvas - a simple sunset with a tree
        room.fillStyle(0xffb8cc, 1);
        room.fillRoundedRect(artX + 16, artY + 4, 26, 13, 1);
        room.fillStyle(0xffddaa, 1);
        room.fillRoundedRect(artX + 16, artY + 15, 26, 10, 0);
        room.fillStyle(0xffaa88, 1);
        room.fillCircle(artX + 36, artY + 13, 3);
        room.fillStyle(0x88bb88, 1);
        room.fillRect(artX + 25, artY + 23, 2, 8);
        room.fillCircle(artX + 26, artY + 21, 4);
        room.fillCircle(artX + 23, artY + 23, 3);
        room.fillCircle(artX + 29, artY + 23, 3);

        // Paint splatters on wall (artist mess!)
        room.fillStyle(0xff99bb, 0.5);
        room.fillCircle(artX + 47, artY - 10, 3);
        room.fillCircle(artX + 55, artY + 5, 2);
        room.fillStyle(0x88ccff, 0.5);
        room.fillCircle(artX + 50, artY + 16, 2);
        room.fillCircle(artX + 58, artY - 5, 3);
        room.fillStyle(0xffdd88, 0.5);
        room.fillCircle(artX + 53, artY + 26, 2);

        // Paint palette on the floor
        const palX = artX + 5;
        const palY = artY + 62;
        room.fillStyle(0xf5e0c8, 1);
        room.fillRoundedRect(palX, palY, 24, 11, 5);
        room.fillStyle(0xe8d0b8, 1);
        room.fillRoundedRect(palX + 1, palY + 1, 22, 9, 4);
        // Thumb hole
        room.fillStyle(0xd9c4a8, 1);
        room.fillCircle(palX + 3, palY + 5, 2);
        // Paint blobs on palette
        room.fillStyle(0xff7799, 1);
        room.fillCircle(palX + 8, palY + 4, 2);
        room.fillStyle(0x77ccff, 1);
        room.fillCircle(palX + 14, palY + 6, 2);
        room.fillStyle(0xffcc66, 1);
        room.fillCircle(palX + 18, palY + 4, 2);
        room.fillStyle(0x88dd88, 1);
        room.fillCircle(palX + 16, palY + 8, 2);

        // Small paintbrush leaning against easel
        room.fillStyle(0xc4a882, 1);
        room.fillRect(artX + 48, artY + 38, 3, 20);
        room.fillStyle(0x8a6e4b, 1);
        room.fillRect(artX + 48, artY + 55, 3, 3);
        // Brush tip
        room.fillStyle(0xff99bb, 1);
        room.fillRect(artX + 48, artY + 35, 3, 4);

        this.clouds = []; // kept for update() compatibility, no clouds in room

        // === Simple 3D White Cabinet (left side) ===
        const cabX = 12;
        const cabY = 380;
        const cabW = 65;
        const cabH = 65;
        const cabDepth = 6;

        // Cabinet shadow (floor)
        room.fillStyle(0xccb8a5, 1);
        room.fillRoundedRect(cabX + 4, cabY + cabH + 2, cabW, 6, 2);

        // Cabinet body (white)
        room.fillStyle(0xffffff, 1);
        room.fillRoundedRect(cabX, cabY, cabW, cabH, 4);

        // Top surface (lighter white for 3D depth)
        room.fillStyle(0xfafafa, 1);
        room.fillRoundedRect(cabX, cabY, cabW, 6, 3);

        // Right side shadow (3D depth)
        room.fillStyle(0xe8e8e8, 1);
        room.fillRect(cabX + cabW - 6, cabY + 4, 6, cabH - 8);

        // Drawer seam (top drawer line)
        room.fillStyle(0xeeeeee, 1);
        room.fillRect(cabX + 6, cabY + cabH * 0.35, cabW - 12, 2);

        // Drawer seam (bottom drawer line)
        room.fillStyle(0xeeeeee, 1);
        room.fillRect(cabX + 6, cabY + cabH * 0.72, cabW - 12, 2);

        // Top drawer knob
        room.fillStyle(0xcccccc, 1);
        room.fillCircle(cabX + cabW / 2, cabY + cabH * 0.17, 3);

        // Bottom drawer knob
        room.fillStyle(0xcccccc, 1);
        room.fillCircle(cabX + cabW / 2, cabY + cabH * 0.55, 3);

        // Tiny cat toy (yarn ball) on top of cabinet
        room.fillStyle(0xffb8cc, 1);
        room.fillCircle(cabX + cabW * 0.6, cabY - 5, 5);
        room.fillStyle(0xffccd8, 1);
        room.fillCircle(cabX + cabW * 0.6, cabY - 6, 3);
        // Yarn tail
        room.fillStyle(0xffb8cc, 1);
        room.fillRect(cabX + cabW * 0.6 + 3, cabY - 3, 8, 2);

        // Floating hearts particles around the cat area
        this.hearts = this.add.group();
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => this.spawnHeart()
        });

        // Title - matching StartScene style
        const titleText = this.add.text(W / 2, 60, 'Catmagotchi', {
            fontSize: '42px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            fontStyle: 'bold',
            stroke: '#ff88cc',
            strokeThickness: 3,
            padding: { top: 4, bottom: 10 }
        }).setOrigin(0.5).setShadow(0, 4, '#ff88cc88', 0, true, true);
        titleText.setDepth(5);

        // Copyright watermark
        const copyText = this.add.text(W / 2, H - 14, '\u00a9 2025 Helen C. All Rights Reserved.', {
            fontSize: '10px',
            color: '#887799',
            fontFamily: 'Poppins'
        }).setOrigin(0.5);
        copyText.setDepth(5);

        // Cat name above stats - smaller, left aligned, no stars, darker grey
        const nameText = this.add.text(40, 125, 'Mitten', {
            fontSize: '18px',
            color: '#555555',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        nameText.setDepth(5);

        // === STATS AREA ===
        const statY1 = 165;
        const statY2 = 201;
        const barW = 110;
        const barH = 14;
        const labelX = 40;     // aligned with buttons left edge
        const barX = 90;       // after labels

        this.createCapsuleStatBar(labelX, statY1, 'Hunger', 'hunger', 0xff7799, barX, barW, barH);
        this.createCapsuleStatBar(labelX, statY2, 'Energy', 'energy', 0x88dd88, barX, barW, barH);

        const rightLabelX = 223;
        const rightBarX = 265;
        this.createCapsuleStatBar(rightLabelX - 2, statY1, 'Happy', 'happiness', 0xffcc66, rightBarX, barW, barH);
        this.createCapsuleStatBar(rightLabelX, statY2, 'Clean', 'hygiene', 0x77ccff, rightBarX, barW, barH);

        // Inventory - aligned right with buttons right edge
        this.fishText = this.add.text(440, statY1, '\ud83d\udc1f: 0', {
            fontSize: '15px',
            color: '#cccccc',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);
        this.fishText.setDepth(10);

        this.toyText = this.add.text(440, statY2, '\ud83e\uddf6: 0', {
            fontSize: '15px',
            color: '#cccccc',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0.5);
        this.toyText.setDepth(10);

        // === CAT AREA ===
        const catY = H * 0.55;
        this.cat = this.add.sprite(W / 2, catY, 'cat_idle');
        this.cat.setScale(2.86);

        // Cooldown for cleaning (via Bath button)
        this.canClean = true;

        // Decorative items around cat - separate movable sprites from PNG files
        this.catBed = this.add.image(W * 0.20, H * 0.64, 'cat_bed').setScale(1.35).setDepth(1);
        this.yarnToy = this.add.image(W * 0.80, H * 0.61, 'yarn_toy').setScale(1.15).setDepth(1);
        this.foodTray = this.add.image(W * 0.55, H * 0.67, 'food_tray').setScale(1.05).setDepth(1);

        // === BUTTONS (bottom area) - circle buttons in a single row ===
        const btnY = H * 0.78;
        const circleR = 32;
        const btnX1 = W * 0.14;
        const btnX2 = W * 0.38;
        const btnX3 = W * 0.62;
        const btnX4 = W * 0.86;

        this.createCircleButton(btnX1, btnY, '🛏️', 'Sleep', () => this.sleep(), circleR, 0xaabbee);
        this.createCircleButton(btnX2, btnY, '🍗', 'Feed', () => this.feed(), circleR, 0xdd9999);
        this.createCircleButton(btnX3, btnY, '🧶', 'Play', () => this.play(), circleR, 0xdd99dd);
        this.createCircleButton(btnX4, btnY, '🛁', 'Bath', () => this.cleanCat(), circleR, 0x77bbdd);

        // === ADVENTURE BUTTON - round pastel world button at bottom right ===
        this.createAdventureButton(W - 55, H - 55);

        // Stats update loop
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => this.decayStats()
        });

        // Cat idle animation - gentle bob with a little squash
        this.tweens.add({
            targets: this.cat,
            y: catY - 8,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update() {
        // Drift clouds
        for (const cloud of this.clouds) {
            cloud.sprite.x += cloud.speed;
            if (cloud.sprite.x > this.scale.width + 50) {
                cloud.sprite.x = -50;
            }
        }

        // Float hearts
        this.hearts.children.each((heart) => {
            heart.y -= heart.speedY;
            heart.x += Math.sin(heart.time + heart.offset) * 0.5;
            heart.time += 0.05;
            heart.alpha -= 0.005;
            if (heart.alpha <= 0) {
                heart.destroy();
            }
        });

        const stats = this.registry.get('stats');
        this.updateBar('hunger', stats.hunger);
        this.updateBar('happiness', stats.happiness);
        this.updateBar('energy', stats.energy);
        this.updateBar('hygiene', stats.hygiene);

        const inv = this.registry.get('inventory');
        this.fishText.setText(`\ud83d\udc1f: ${inv.fish}`);
        this.toyText.setText(`\ud83e\uddf6: ${inv.toys}`);
    }

    spawnHeart() {
        const W = this.scale.width;
        const H = this.scale.height;
        // spawn hearts above the cat
        const catX = W * 0.5;
        const catY = H * 0.45;
        const x = catX + (Math.random() - 0.5) * 180;
        const y = catY + (Math.random() - 0.5) * 60;
        const heart = this.add.image(x, y, 'heart')
            .setScale(0.3 + Math.random() * 0.4)
            .setAlpha(0.7);
        heart.speedY = 0.3 + Math.random() * 0.5;
        heart.time = 0;
        heart.offset = Math.random() * 100;
        this.hearts.add(heart);
    }

    createCapsuleStatBar(labelX, labelY, label, key, color, barX, barWidth, barHeight) {
        const r = barHeight / 2;
        // Background capsule
        const bg = this.add.graphics();
        bg.setDepth(10);
        bg.fillStyle(0x333344, 1);
        this.drawCapsule(bg, barX, labelY - barHeight / 2, barWidth, barHeight, r);

        // Fill capsule
        const fill = this.add.graphics();
        fill.setDepth(11);
        fill.fillStyle(color, 1);
        this[`gfx_${key}`] = fill;
        this[`bar_${key}_x`] = barX;
        this[`bar_${key}_y`] = labelY;
        this[`bar_${key}_w`] = barWidth;
        this[`bar_${key}_h`] = barHeight;
        this[`bar_${key}_r`] = r;
        this[`bar_${key}_color`] = color;

        // Label
        const lbl = this.add.text(labelX, labelY, label, {
            fontSize: '12px',
            color: '#777777',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        lbl.setDepth(10);
    }

    drawCapsule(gfx, x, y, w, h, r) {
        gfx.fillRoundedRect(x, y, w, h, r);
    }

    updateBar(key, value) {
        const fill = this[`gfx_${key}`];
        if (fill) {
            fill.clear();
            const x = this[`bar_${key}_x`];
            const y = this[`bar_${key}_y`];
            const w = this[`bar_${key}_w`];
            const h = this[`bar_${key}_h`];
            const r = this[`bar_${key}_r`];
            let color = this[`bar_${key}_color`];
            if (value < 30) color = 0xff4444;
            fill.fillStyle(color, 1);
            const fillW = Math.max(0, (value / 100) * w);
            if (fillW > 0) {
                fill.fillRoundedRect(x, y - h / 2, fillW, h, r);
            }
        }
    }

    createCircleButton(x, y, icon, label, callback, radius, color) {
        const border = 2;
        const btn = this.add.graphics();
        const borderColor = this.darkenColor(color, 0x222222);
        // Crisp border using filled circle behind
        btn.fillStyle(borderColor, 1);
        btn.fillCircle(x, y, radius + border);
        btn.fillStyle(color, 1);
        btn.fillCircle(x, y, radius);
        btn.setInteractive(
            new Phaser.Geom.Circle(x, y, radius + border),
            Phaser.Geom.Circle.Contains
        );
        btn.setScrollFactor(0);

        // Emoji icon centered in circle
        const iconText = this.add.text(x, y - 2, icon, {
            fontSize: '24px',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Label below circle
        this.add.text(x, y + radius + 10, label, {
            fontSize: '11px',
            color: '#8888aa',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Hover effect - brighten
        btn.on('pointerover', () => {
            btn.clear();
            const lighter = this.lightenColor(color, 0x222222);
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(x, y, radius + border);
            btn.fillStyle(lighter, 1);
            btn.fillCircle(x, y, radius);
        });
        btn.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(x, y, radius + border);
            btn.fillStyle(color, 1);
            btn.fillCircle(x, y, radius);
        });
        btn.on('pointerdown', callback);
    }

    lightenColor(color, amount) {
        const r = Math.min(255, ((color >> 16) & 0xFF) + ((amount >> 16) & 0xFF));
        const g = Math.min(255, ((color >> 8) & 0xFF) + ((amount >> 8) & 0xFF));
        const b = Math.min(255, (color & 0xFF) + (amount & 0xFF));
        return (r << 16) | (g << 8) | b;
    }

    darkenColor(color, amount) {
        const r = Math.max(0, ((color >> 16) & 0xFF) - ((amount >> 16) & 0xFF));
        const g = Math.max(0, ((color >> 8) & 0xFF) - ((amount >> 8) & 0xFF));
        const b = Math.max(0, (color & 0xFF) - (amount & 0xFF));
        return (r << 16) | (g << 8) | b;
    }

    createAdventureButton(x, y) {
        const radius = 45;
        const size = radius * 2;
        const color = 0xaaddcc;
        const borderColor = this.darkenColor(color, 0x222222);
        const border = 2;

        const btn = this.add.graphics();
        btn.fillStyle(borderColor, 1);
        btn.fillCircle(0, 0, radius + border);
        btn.fillStyle(color, 1);
        btn.fillCircle(0, 0, radius);
        btn.setPosition(x, y);
        // Rectangle hit area that fully contains the circle
        btn.setInteractive(
            new Phaser.Geom.Rectangle(-radius - border, -radius - border, size + border * 2, size + border * 2),
            Phaser.Geom.Rectangle.Contains
        );
        btn.setScrollFactor(0);

        // World icon
        const icon = this.add.text(x, y - 6, '🌍', {
            fontSize: '24px',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0);

        // Adventure label - fresh text with Poppins
        this.add.text(x, y + 14, 'Adventure', {
            fontSize: '11px',
            color: '#8888aa',
            fontFamily: 'Poppins',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);

        // Hover effect - brighten (redraw)
        btn.on('pointerover', () => {
            btn.clear();
            const lighter = this.lightenColor(color, 0x222222);
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(0, 0, radius + border);
            btn.fillStyle(lighter, 1);
            btn.fillCircle(0, 0, radius);
        });
        btn.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(borderColor, 1);
            btn.fillCircle(0, 0, radius + border);
            btn.fillStyle(color, 1);
            btn.fillCircle(0, 0, radius);
        });
        btn.on('pointerdown', () => {
            this.scene.start('PlatformerScene');
        });
    }

    feed() {
        const stats = this.registry.get('stats');
        const inv = this.registry.get('inventory');

        if (inv.fish > 0) {
            stats.hunger = Math.min(100, stats.hunger + 20);
            stats.energy = Math.min(100, stats.energy + 5);
            stats.hygiene = Math.max(0, stats.hygiene - 10);
            inv.fish--;
            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude0b Yum!');
            this.spawnBurst(this.cat.x, this.cat.y - 20, 'heart', 5);
        } else {
            this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\ude3f No fish!');
        }

        this.registry.set('stats', stats);
        this.registry.set('inventory', inv);
    }

    play() {
        const stats = this.registry.get('stats');
        const inv = this.registry.get('inventory');

        if (inv.toys <= 0) {
            this.showFloatingText(this.cat.x, this.cat.y - 40, '🧶 No yarn!');
            this.registry.set('stats', stats);
            this.registry.set('inventory', inv);
            return;
        }

        if (stats.energy > 10) {
            stats.happiness = Math.min(100, stats.happiness + 15);
            stats.energy = Math.max(0, stats.energy - 10);
            stats.hygiene = Math.max(0, stats.hygiene - 15);
            inv.toys--;
            this.showFloatingText(this.cat.x, this.cat.y - 40, '😸 Fun!');
            this.spawnBurst(this.cat.x, this.cat.y - 20, 'star', 6);

            this.tweens.add({
                targets: this.cat,
                y: this.cat.y - 70,
                duration: 300,
                yoyo: true
            });
        } else {
            this.showFloatingText(this.cat.x, this.cat.y - 40, '😴 Too tired...');
        }

        this.registry.set('stats', stats);
        this.registry.set('inventory', inv);
    }

    sleep() {
        const stats = this.registry.get('stats');
        stats.energy = Math.min(100, stats.energy + 30);
        stats.hunger = Math.max(0, stats.hunger - 10);
        this.registry.set('stats', stats);

        this.cat.setTexture('cat_sleep');
        this.showFloatingText(this.cat.x, this.cat.y - 40, '\ud83d\udca4 Zzz...');

        this.time.delayedCall(2000, () => {
            if (this.cat && this.cat.active) {
                this.cat.setTexture('cat_idle');
            }
        });
    }

    cleanCat() {
        if (!this.canClean) {
            this.showFloatingText(this.cat.x, this.cat.y - 50, '\u23f3 Wait...');
            return;
        }

        const stats = this.registry.get('stats');
        if (stats.hygiene >= 100) {
            this.showFloatingText(this.cat.x, this.cat.y - 50, '\u2728 Already clean!');
            return;
        }

        stats.hygiene = Math.min(100, stats.hygiene + 25);
        stats.happiness = Math.min(100, stats.happiness + 5);
        this.registry.set('stats', stats);

        this.showFloatingText(this.cat.x, this.cat.y - 50, '\ud83e\uddfc Clean!');
        this.spawnBurst(this.cat.x, this.cat.y - 30, 'star', 4);

        this.tweens.add({
            targets: this.cat,
            scaleX: this.cat.scaleX * 1.07,
            scaleY: this.cat.scaleY * 0.93,
            duration: 150,
            yoyo: true,
            repeat: 2
        });

        const sparkle = this.add.text(this.cat.x + 30, this.cat.y - 30, '\u2728', {
            fontSize: '22px',
            fontFamily: 'Poppins'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: sparkle,
            y: sparkle.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => sparkle.destroy()
        });

        this.canClean = false;
        this.time.delayedCall(3000, () => {
            this.canClean = true;
        });
    }

    spawnBurst(x, y, textureKey, count) {
        for (let i = 0; i < count; i++) {
            const p = this.add.image(x, y, textureKey)
                .setScale(0.4 + Math.random() * 0.3)
                .setAlpha(0.9);
            const angle = Math.random() * Math.PI * 2;
            const dist = 20 + Math.random() * 40;
            this.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist - 20,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: 600 + Math.random() * 400,
                ease: 'Power2',
                onComplete: () => p.destroy()
            });
        }
    }

    decayStats() {
        const stats = this.registry.get('stats');
        stats.hunger = Math.max(0, stats.hunger - 2);
        stats.happiness = Math.max(0, stats.happiness - 1);
        stats.energy = Math.max(0, stats.energy - 1);
        stats.hygiene = Math.max(0, stats.hygiene - 0.5);
        this.registry.set('stats', stats);
    }

    showFloatingText(x, y, text) {
        const txt = this.add.text(x, y, text, {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Poppins',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: txt,
            y: y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => txt.destroy()
        });
    }
}
