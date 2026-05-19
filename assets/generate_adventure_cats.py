#!/usr/bin/env python3
"""Generate side-facing 64x64 RUN cat sprite for Adventure mode.

- Head: smaller, rounder circle
- Body: shorter horizontal oval
- Ears: small triangles pointing UP (symmetric, looks fine when flipped)
- Compact, cute proportions matching the home scene cat
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

def draw_run_cat(img):
    """Side-facing RUN cat — compact, round, cute.
    Head faces LEFT (nose on left side of head).
    Ears point UP (symmetric triangles, safe for setFlipX).
    Body is short and horizontal.
    """
    # --- TAIL (curved up behind, short) ---
    tail = [
        (48, 36), (50, 34), (52, 32), (54, 30), (55, 28),
        (55, 26), (54, 24), (52, 23), (50, 24)
    ]
    for x, y in tail:
        set_pixel(img, x, y, W)
    set_pixel(img, 56, 30, S)
    set_pixel(img, 56, 28, S)

    # --- BODY (short horizontal chubby oval) ---
    # Center around (32, 40), smaller than before
    for y in range(32, 48):
        for x in range(18, 46):
            dx = x - 32
            dy = y - 40
            # Ellipse: wider than tall
            if dx * dx / 180 + dy * dy / 55 <= 1.1:
                set_pixel(img, x, y, W)
    # Body shadow (right side, toward tail)
    for y in range(38, 48):
        for x in range(36, 46):
            dx = x - 32
            dy = y - 40
            if dx * dx / 180 + dy * dy / 55 <= 1.1 and dx > 2:
                set_pixel(img, x, y, S)

    # --- LEGS (running stride, shorter) ---
    # Back leg (stretched back)
    fill_rect(img, 42, 44, 3, 5, W)
    fill_rect(img, 44, 48, 3, 3, W)
    fill_rect(img, 45, 50, 2, 2, P)   # paw
    # Other back leg (tucked)
    fill_rect(img, 36, 44, 3, 4, S)
    fill_rect(img, 37, 47, 2, 2, P)
    # Front leg (stretched forward)
    fill_rect(img, 22, 44, 3, 5, W)
    fill_rect(img, 18, 48, 4, 3, W)
    fill_rect(img, 19, 50, 2, 2, P)   # paw
    # Other front leg (tucked)
    fill_rect(img, 26, 44, 3, 4, S)
    fill_rect(img, 27, 47, 2, 2, P)

    # --- HEAD (even bigger round circle, facing left) ---
    for y in range(10, 40):
        for x in range(6, 36):
            dx = x - 21
            dy = y - 25
            if dx * dx + dy * dy <= 175:
                set_pixel(img, x, y, W)
    # Head shadow (right side)
    for y in range(27, 38):
        for x in range(24, 36):
            dx = x - 21
            dy = y - 25
            if dx * dx + dy * dy <= 175 and dx > 4:
                set_pixel(img, x, y, S)

    # --- EARS (attached to top of head, pointing UP) ---
    # Main ear (left/top of head) — base sits ON head top (y≈10-12)
    ear = [
        (14, 8), (15, 7), (16, 6), (17, 5), (18, 5), (19, 6),
        (13, 9), (14, 9), (15, 9), (16, 9), (17, 9), (18, 9), (19, 9), (20, 9),
        (13, 10), (14, 10), (15, 10), (16, 10), (17, 10), (18, 10), (19, 10), (20, 10),
        (14, 11), (15, 11), (16, 11), (17, 11), (18, 11), (19, 11), (20, 11),
        (15, 12), (16, 12), (17, 12), (18, 12), (19, 12)
    ]
    for x, y in ear:
        set_pixel(img, x, y, W)
    ear_inner = [
        (16, 7), (17, 6), (18, 6),
        (15, 8), (16, 8), (17, 8), (18, 8),
        (15, 9), (16, 9), (17, 9), (18, 9),
        (15, 10), (16, 10), (17, 10), (18, 10),
        (16, 11), (17, 11), (18, 11)
    ]
    for x, y in ear_inner:
        set_pixel(img, x, y, P)

    # Second ear (slightly behind, also attached to head)
    ear2 = [
        (22, 9), (23, 8), (24, 7), (25, 6), (26, 6), (27, 7),
        (22, 10), (23, 10), (24, 10), (25, 10), (26, 10), (27, 10), (28, 10),
        (22, 11), (23, 11), (24, 11), (25, 11), (26, 11), (27, 11), (28, 11),
        (23, 12), (24, 12), (25, 12), (26, 12), (27, 12),
        (24, 13), (25, 13), (26, 13)
    ]
    for x, y in ear2:
        set_pixel(img, x, y, W)
    ear2_inner = [
        (24, 8), (25, 7), (26, 7),
        (23, 9), (24, 9), (25, 9), (26, 9),
        (23, 10), (24, 10), (25, 10), (26, 10),
        (24, 11), (25, 11), (26, 11)
    ]
    for x, y in ear2_inner:
        set_pixel(img, x, y, P)

    # --- EYE (45% smaller: radius 5 -> ~2.75) ---
    fill_circle(img, 15, 21, 2.75, E)
    fill_circle(img, 14, 19, 1.4, W)     # big white shine
    fill_circle(img, 16, 22, 0.8, W)     # small shine
    set_pixel(img, 13, 18, W)

    # --- BLUSH on cheek ---
    fill_circle(img, 18, 27, 3.5, P)
    fill_circle(img, 17, 27, 2.5, PI)

    # --- NOSE (small pink) ---
    set_pixel(img, 8, 25, B)
    set_pixel(img, 7, 26, B)
    set_pixel(img, 8, 26, B)

    # --- MOUTH (tiny happy) ---
    set_pixel(img, 10, 27, M)
    set_pixel(img, 11, 28, B)
    set_pixel(img, 12, 27, M)

    # --- WHISKERS (tiny cheek marks, flip-safe) ---
    set_pixel(img, 20, 28, K)
    set_pixel(img, 21, 29, K)
    set_pixel(img, 19, 30, K)


if __name__ == '__main__':
    img_run = new_canvas()
    draw_run_cat(img_run)
    img_run.save('/home/helen/catmagotchi/assets/cat-run.png')
    print('Saved cat-run.png')

    print('Done!')
