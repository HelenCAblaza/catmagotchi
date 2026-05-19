#!/usr/bin/env python3
"""Generate improved side-facing 64x64 cat sprites for Adventure mode."""
from PIL import Image

SIZE = 64

# Colors
W = (255, 255, 255)       # white fur
S = (245, 245, 245)       # shadow white
D = (220, 220, 220)       # darker shadow
P = (255, 182, 193)       # pink inner ear / blush
PI = (255, 150, 170)      # pink inner deeper
E = (74, 48, 32)          # dark brown eye
B = (255, 136, 153)       # nose / tongue
M = (204, 85, 102)        # mouth line
K = (90, 58, 32)          # whiskers
T = (255, 200, 210)       # tongue lighter

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

def draw_adventure_idle(img):
    """Side-facing idle cat, facing left, standing still."""
    # --- TAIL (curled up behind) ---
    tail_pixels = [
        (50, 34), (52, 32), (54, 30), (55, 28), (56, 26),
        (56, 24), (56, 22), (55, 20), (53, 19), (51, 20),
        (49, 22), (48, 24)
    ]
    for x, y in tail_pixels:
        set_pixel(img, x, y, W)
    set_pixel(img, 57, 26, S)
    set_pixel(img, 57, 24, S)
    set_pixel(img, 57, 22, S)
    set_pixel(img, 54, 18, S)

    # --- BODY (horizontal chubby oval) ---
    for y in range(26, 44):
        for x in range(20, 52):
            dx = x - 36
            dy = y - 34
            if dx * dx / 240 + dy * dy / 90 <= 1.2:
                set_pixel(img, x, y, W)
    # Body shadow (bottom-right)
    for y in range(34, 44):
        for x in range(42, 52):
            dx = x - 36
            dy = y - 34
            if dx * dx / 240 + dy * dy / 90 <= 1.2 and dx > 4:
                set_pixel(img, x, y, S)

    # --- LEGS (standing, all 4 on ground) ---
    # Back legs
    fill_rect(img, 44, 42, 4, 6, W)
    fill_rect(img, 46, 48, 3, 2, P)  # paw
    fill_rect(img, 38, 42, 4, 6, S)
    fill_rect(img, 40, 48, 2, 2, P)  # paw
    # Front legs
    fill_rect(img, 26, 42, 4, 6, W)
    fill_rect(img, 27, 48, 3, 2, P)  # paw
    fill_rect(img, 20, 42, 4, 6, S)
    fill_rect(img, 21, 48, 2, 2, P)  # paw

    # --- HEAD (round, facing left) ---
    for y in range(8, 38):
        for x in range(8, 32):
            dx = x - 20
            dy = y - 22
            if dx * dx + dy * dy <= 210:
                set_pixel(img, x, y, W)
    # Head shadow (bottom right)
    for y in range(24, 36):
        for x in range(24, 32):
            dx = x - 20
            dy = y - 22
            if dx * dx + dy * dy <= 210 and dx > 4:
                set_pixel(img, x, y, S)

    # --- EARS (higher, two visible from slight 3/4 angle) ---
    # Main ear (higher, more prominent)
    ear_pixels = [
        (10, 4), (11, 3), (12, 2), (13, 1),
        (9, 5), (10, 5), (11, 5), (12, 5), (13, 5), (14, 5),
        (8, 6), (9, 6), (10, 6), (11, 6), (12, 6), (13, 6), (14, 6), (15, 6),
        (9, 7), (10, 7), (11, 7), (12, 7), (13, 7), (14, 7),
        (10, 8), (11, 8), (12, 8), (13, 8)
    ]
    for x, y in ear_pixels:
        set_pixel(img, x, y, W)
    # Ear inner pink
    ear_inner = [
        (11, 4), (12, 3),
        (11, 5), (12, 5), (13, 5),
        (11, 6), (12, 6), (13, 6),
        (12, 7), (13, 7)
    ]
    for x, y in ear_inner:
        set_pixel(img, x, y, P)
    # Second ear (slightly behind, smaller)
    ear2 = [
        (18, 6), (19, 5), (20, 4),
        (18, 7), (19, 7), (20, 7), (21, 7),
        (19, 8), (20, 8), (21, 8)
    ]
    for x, y in ear2:
        set_pixel(img, x, y, W)
    ear2_inner = [
        (19, 6), (20, 5),
        (19, 7), (20, 7)
    ]
    for x, y in ear2_inner:
        set_pixel(img, x, y, P)

    # --- EYE (big sparkly brown eye, facing left) ---
    fill_circle(img, 14, 18, 5, E)
    fill_circle(img, 12, 15, 2.5, W)   # big white shine
    fill_circle(img, 16, 19, 1, W)     # small shine
    # Eye highlight sparkle dot
    set_pixel(img, 11, 14, W)

    # --- BLUSH on cheek (below eye, on the cheek, not forward) ---
    # Position: below the eye, slightly back toward the ear
    fill_circle(img, 16, 24, 3, P)
    fill_circle(img, 15, 24, 2, PI)    # deeper center

    # --- NOSE (small pink triangle pointing left) ---
    set_pixel(img, 8, 22, B)
    set_pixel(img, 7, 23, B)
    set_pixel(img, 8, 23, B)

    # --- MOUTH (small happy curve) ---
    set_pixel(img, 9, 24, M)
    set_pixel(img, 10, 25, B)
    set_pixel(img, 11, 24, M)

    # --- WHISKERS on cheek (fanning from cheek, not projecting forward) ---
    # Start from cheek area (near blush, below eye) and fan outward/down
    draw_line(img, 12, 26, 8, 29, K)
    draw_line(img, 14, 27, 10, 31, K)
    draw_line(img, 16, 27, 13, 32, K)


def draw_adventure_run(img):
    """Side-facing run cat, facing left, legs in running pose."""
    # --- TAIL (curved up behind, more dynamic) ---
    tail_pixels = [
        (52, 30), (54, 28), (56, 26), (57, 24), (58, 22),
        (58, 20), (57, 18), (55, 17), (53, 18), (51, 20)
    ]
    for x, y in tail_pixels:
        set_pixel(img, x, y, W)
    set_pixel(img, 59, 24, S)
    set_pixel(img, 59, 22, S)
    set_pixel(img, 56, 16, S)

    # --- BODY (horizontal oval, slightly stretched) ---
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

    # --- LEGS (running pose: front stretched forward, back stretched back) ---
    # Back leg (stretched back)
    fill_rect(img, 46, 40, 3, 7, W)
    fill_rect(img, 48, 46, 3, 4, W)
    fill_rect(img, 49, 49, 2, 2, P)   # paw
    # Other back leg (tucked)
    fill_rect(img, 40, 42, 3, 5, S)
    fill_rect(img, 41, 46, 2, 2, P)
    # Front leg (stretched forward)
    fill_rect(img, 20, 40, 3, 7, W)
    fill_rect(img, 16, 46, 4, 4, W)
    fill_rect(img, 17, 49, 2, 2, P)   # paw
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

    # --- EARS (higher!) ---
    # Main ear
    ear_pixels = [
        (10, 2), (11, 1), (12, 0), (13, 0),
        (9, 3), (10, 3), (11, 3), (12, 3), (13, 3), (14, 3),
        (8, 4), (9, 4), (10, 4), (11, 4), (12, 4), (13, 4), (14, 4), (15, 4),
        (9, 5), (10, 5), (11, 5), (12, 5), (13, 5), (14, 5),
        (10, 6), (11, 6), (12, 6), (13, 6)
    ]
    for x, y in ear_pixels:
        set_pixel(img, x, y, W)
    ear_inner = [
        (11, 2), (12, 1),
        (11, 3), (12, 3), (13, 3),
        (11, 4), (12, 4), (13, 4),
        (12, 5), (13, 5)
    ]
    for x, y in ear_inner:
        set_pixel(img, x, y, P)
    # Second ear (slightly behind)
    ear2 = [
        (18, 4), (19, 3), (20, 2),
        (18, 5), (19, 5), (20, 5), (21, 5),
        (19, 6), (20, 6), (21, 6)
    ]
    for x, y in ear2:
        set_pixel(img, x, y, W)
    ear2_inner = [
        (19, 4), (20, 3),
        (19, 5), (20, 5)
    ]
    for x, y in ear2_inner:
        set_pixel(img, x, y, P)

    # --- EYE (big sparkly, facing left) ---
    fill_circle(img, 12, 16, 5, E)
    fill_circle(img, 10, 13, 2.5, W)
    fill_circle(img, 14, 18, 1, W)
    set_pixel(img, 9, 12, W)

    # --- BLUSH on cheek (below eye, on the side) ---
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

    # --- WHISKERS on cheek (fanning from cheek area, not forward) ---
    draw_line(img, 10, 24, 6, 27, K)
    draw_line(img, 12, 25, 8, 29, K)
    draw_line(img, 14, 25, 11, 30, K)


if __name__ == '__main__':
    # Generate adventure idle (side-facing standing)
    img_idle = new_canvas()
    draw_adventure_idle(img_idle)
    img_idle.save('/home/helen/catmagotchi/assets/cat-adventure-idle.png')
    print('Saved cat-adventure-idle.png')

    # Generate adventure run (side-facing running)
    img_run = new_canvas()
    draw_adventure_run(img_run)
    img_run.save('/home/helen/catmagotchi/assets/cat-run.png')
    print('Saved cat-run.png')

    print('Done! Both sprites generated.')
