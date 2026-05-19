#!/usr/bin/env python3
"""Generate side-facing 64x64 cat sprites for Adventure mode.

Design notes:
- All sprites face LEFT in the PNG (default orientation).
- setFlipX(true) mirrors to face RIGHT.
- Whiskers and ears point TOWARD THE TAIL (rightward) so that after a horizontal
  flip they still point toward the tail, i.e. opposite to the facing direction.
- Idle = straight standing body, neutral swept-back ears, short trailing whiskers.
- Run  = stretched horizontal body, ears swept back, whiskers swept back, legs in stride.
"""
from PIL import Image

SIZE = 64

# Palette
W = (255, 255, 255)       # white fur
S = (245, 245, 245)       # shadow white
P = (255, 182, 193)       # pink inner ear / blush
PI = (255, 150, 170)      # deeper pink
E = (74, 48, 32)          # dark brown eye
B = (255, 136, 153)       # nose / tongue
M = (204, 85, 102)        # mouth line
K = (90, 58, 32)          # whiskers

def new_canvas():
    return Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))

def set_pixel(img, x, y, color):
    if 0 <= x < SIZE and 0 <= y < SIZE and color:
        img.putpixel((x, y), color)

def fill_rect(img, x, y, w, h, color):
    for py in range(y, y + h):
        for px in range(x, x + w):
            set_pixel(img, px, py, color)

def fill_circle(img, cx, cy, r, color):
    ir = int(r) + 1
    for y in range(-ir, ir + 1):
        for x in range(-ir, ir + 1):
            if x * x + y * y <= r * r + 0.5:
                set_pixel(img, cx + x, cy + y, color)

def draw_line(img, x1, y1, x2, y2, color):
    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    sx = 1 if x1 < x2 else -1
    sy = 1 if y1 < y2 else -1
    err = dx - dy
    x, y = x1, y1
    while True:
        set_pixel(img, x, y, color)
        if x == x2 and y == y2:
            break
        e2 = 2 * err
        if e2 > -dy:
            err -= dy
            x += sx
        if e2 < dx:
            err += dx
            y += sy

# ========================================================================
# ADVENTURE IDLE — straight standing body, facing left
# ========================================================================
def draw_adventure_idle(img):
    """Side-facing idle cat, straight standing pose, facing left."""
    # --- TAIL (gently curved down-behind) ---
    tail = [
        (46, 38), (48, 40), (50, 42), (52, 44), (53, 46),
        (53, 48), (52, 50), (50, 51), (48, 50)
    ]
    for x, y in tail:
        set_pixel(img, x, y, W)
    set_pixel(img, 54, 44, S)
    set_pixel(img, 54, 46, S)

    # --- BODY (upright rounded oval, taller than wide) ---
    for y in range(28, 50):
        for x in range(22, 46):
            dx = x - 34
            dy = y - 38
            if dx * dx / 120 + dy * dy / 110 <= 1.2:
                set_pixel(img, x, y, W)
    # Body shadow (right side)
    for y in range(34, 50):
        for x in range(38, 46):
            dx = x - 34
            dy = y - 38
            if dx * dx / 120 + dy * dy / 110 <= 1.2 and dx > 2:
                set_pixel(img, x, y, S)

    # --- LEGS (standing straight, 4 on ground) ---
    # Front legs
    fill_rect(img, 26, 48, 4, 6, W)
    fill_rect(img, 27, 54, 3, 2, P)
    fill_rect(img, 22, 48, 4, 6, S)
    fill_rect(img, 23, 54, 2, 2, P)
    # Back legs
    fill_rect(img, 42, 48, 4, 6, W)
    fill_rect(img, 43, 54, 3, 2, P)
    fill_rect(img, 36, 48, 4, 6, S)
    fill_rect(img, 37, 54, 2, 2, P)

    # --- HEAD (round, facing left) ---
    for y in range(8, 36):
        for x in range(8, 32):
            dx = x - 20
            dy = y - 22
            if dx * dx + dy * dy <= 190:
                set_pixel(img, x, y, W)
    # Head shadow (right side)
    for y in range(24, 34):
        for x in range(24, 32):
            dx = x - 20
            dy = y - 22
            if dx * dx + dy * dy <= 190 and dx > 4:
                set_pixel(img, x, y, S)

    # --- EARS (swept back toward tail — rightward) ---
    # Main ear (leaning back)
    ear = [
        (12, 4), (13, 3), (14, 2), (15, 1), (16, 0),
        (11, 5), (12, 5), (13, 5), (14, 5), (15, 5), (16, 5), (17, 5),
        (10, 6), (11, 6), (12, 6), (13, 6), (14, 6), (15, 6), (16, 6), (17, 6), (18, 6),
        (11, 7), (12, 7), (13, 7), (14, 7), (15, 7), (16, 7), (17, 7),
        (12, 8), (13, 8), (14, 8), (15, 8), (16, 8)
    ]
    for x, y in ear:
        set_pixel(img, x, y, W)
    ear_inner = [
        (13, 4), (14, 3), (15, 2),
        (12, 5), (13, 5), (14, 5), (15, 5), (16, 5),
        (12, 6), (13, 6), (14, 6), (15, 6), (16, 6),
        (13, 7), (14, 7), (15, 7)
    ]
    for x, y in ear_inner:
        set_pixel(img, x, y, P)

    # Second ear (smaller, more swept back)
    ear2 = [
        (20, 6), (21, 5), (22, 4), (23, 3),
        (19, 7), (20, 7), (21, 7), (22, 7), (23, 7), (24, 7),
        (19, 8), (20, 8), (21, 8), (22, 8), (23, 8), (24, 8),
        (20, 9), (21, 9), (22, 9), (23, 9)
    ]
    for x, y in ear2:
        set_pixel(img, x, y, W)
    ear2_inner = [
        (21, 6), (22, 5), (23, 4),
        (20, 7), (21, 7), (22, 7), (23, 7),
        (21, 8), (22, 8), (23, 8)
    ]
    for x, y in ear2_inner:
        set_pixel(img, x, y, P)

    # --- EYE (big sparkly brown) ---
    fill_circle(img, 14, 18, 5, E)
    fill_circle(img, 12, 15, 2.5, W)   # big white shine
    fill_circle(img, 16, 19, 1, W)     # small shine
    set_pixel(img, 11, 14, W)

    # --- BLUSH on cheek ---
    fill_circle(img, 16, 24, 3, P)
    fill_circle(img, 15, 24, 2, PI)

    # --- NOSE ---
    set_pixel(img, 8, 22, B)
    set_pixel(img, 7, 23, B)
    set_pixel(img, 8, 23, B)

    # --- MOUTH ---
    set_pixel(img, 9, 24, M)
    set_pixel(img, 10, 25, B)
    set_pixel(img, 11, 24, M)

    # --- WHISKERS (swept back toward tail — point RIGHT/increasing x)
    # Start near muzzle/cheek, trail toward body/tail
    draw_line(img, 10, 26, 16, 27, K)
    draw_line(img, 10, 28, 17, 30, K)
    draw_line(img, 11, 30, 18, 32, K)


# ========================================================================
# ADVENTURE RUN — stretched body, facing left
# ========================================================================
def draw_adventure_run(img):
    """Side-facing run cat, stretched horizontal body, facing left."""
    # --- TAIL (curved up behind) ---
    tail = [
        (52, 30), (54, 28), (56, 26), (57, 24), (58, 22),
        (58, 20), (57, 18), (55, 17), (53, 18), (51, 20)
    ]
    for x, y in tail:
        set_pixel(img, x, y, W)
    set_pixel(img, 59, 24, S)
    set_pixel(img, 59, 22, S)
    set_pixel(img, 56, 16, S)

    # --- BODY (horizontal stretched oval) ---
    for y in range(24, 42):
        for x in range(18, 54):
            dx = x - 36
            dy = y - 34
            if dx * dx / 260 + dy * dy / 85 <= 1.2:
                set_pixel(img, x, y, W)
    # Body shadow
    for y in range(34, 42):
        for x in range(44, 54):
            dx = x - 36
            dy = y - 34
            if dx * dx / 260 + dy * dy / 85 <= 1.2 and dx > 5:
                set_pixel(img, x, y, S)

    # --- LEGS (running stride) ---
    # Back leg (stretched back)
    fill_rect(img, 46, 40, 3, 7, W)
    fill_rect(img, 48, 46, 3, 4, W)
    fill_rect(img, 49, 49, 2, 2, P)
    # Other back leg (tucked)
    fill_rect(img, 40, 42, 3, 5, S)
    fill_rect(img, 41, 46, 2, 2, P)
    # Front leg (stretched forward)
    fill_rect(img, 20, 40, 3, 7, W)
    fill_rect(img, 16, 46, 4, 4, W)
    fill_rect(img, 17, 49, 2, 2, P)
    # Other front leg (tucked)
    fill_rect(img, 26, 42, 3, 5, S)
    fill_rect(img, 27, 46, 2, 2, P)

    # --- HEAD (round, facing left) ---
    for y in range(6, 36):
        for x in range(6, 30):
            dx = x - 18
            dy = y - 20
            if dx * dx + dy * dy <= 200:
                set_pixel(img, x, y, W)
    # Head shadow
    for y in range(22, 34):
        for x in range(22, 30):
            dx = x - 18
            dy = y - 20
            if dx * dx + dy * dy <= 200 and dx > 4:
                set_pixel(img, x, y, S)

    # --- EARS (swept back toward tail) ---
    ear = [
        (12, 2), (13, 1), (14, 0), (15, 0), (16, 0),
        (11, 3), (12, 3), (13, 3), (14, 3), (15, 3), (16, 3), (17, 3),
        (10, 4), (11, 4), (12, 4), (13, 4), (14, 4), (15, 4), (16, 4), (17, 4), (18, 4),
        (11, 5), (12, 5), (13, 5), (14, 5), (15, 5), (16, 5), (17, 5),
        (12, 6), (13, 6), (14, 6), (15, 6), (16, 6)
    ]
    for x, y in ear:
        set_pixel(img, x, y, W)
    ear_inner = [
        (13, 2), (14, 1), (15, 1),
        (12, 3), (13, 3), (14, 3), (15, 3), (16, 3),
        (12, 4), (13, 4), (14, 4), (15, 4), (16, 4),
        (13, 5), (14, 5), (15, 5)
    ]
    for x, y in ear_inner:
        set_pixel(img, x, y, P)

    # Second ear (swept back)
    ear2 = [
        (20, 4), (21, 3), (22, 2), (23, 2),
        (19, 5), (20, 5), (21, 5), (22, 5), (23, 5), (24, 5),
        (19, 6), (20, 6), (21, 6), (22, 6), (23, 6), (24, 6),
        (20, 7), (21, 7), (22, 7), (23, 7)
    ]
    for x, y in ear2:
        set_pixel(img, x, y, W)
    ear2_inner = [
        (21, 4), (22, 3), (23, 3),
        (20, 5), (21, 5), (22, 5), (23, 5),
        (21, 6), (22, 6), (23, 6)
    ]
    for x, y in ear2_inner:
        set_pixel(img, x, y, P)

    # --- EYE (big sparkly) ---
    fill_circle(img, 12, 16, 5, E)
    fill_circle(img, 10, 13, 2.5, W)
    fill_circle(img, 14, 18, 1, W)
    set_pixel(img, 9, 12, W)

    # --- BLUSH ---
    fill_circle(img, 14, 22, 3, P)
    fill_circle(img, 13, 22, 2, PI)

    # --- NOSE ---
    set_pixel(img, 6, 20, B)
    set_pixel(img, 5, 21, B)
    set_pixel(img, 6, 21, B)

    # --- MOUTH ---
    set_pixel(img, 7, 23, M)
    set_pixel(img, 8, 24, B)
    set_pixel(img, 9, 23, M)

    # --- WHISKERS (swept back toward tail — point RIGHT) ---
    draw_line(img, 10, 24, 18, 26, K)
    draw_line(img, 10, 26, 19, 29, K)
    draw_line(img, 11, 28, 20, 31, K)


if __name__ == '__main__':
    img_idle = new_canvas()
    draw_adventure_idle(img_idle)
    img_idle.save('/home/helen/catmagotchi/assets/cat-adventure-idle.png')
    print('Saved cat-adventure-idle.png')

    img_run = new_canvas()
    draw_adventure_run(img_run)
    img_run.save('/home/helen/catmagotchi/assets/cat-run.png')
    print('Saved cat-run.png')

    print('Done!')
