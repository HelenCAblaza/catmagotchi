#!/usr/bin/env python3
"""Generate separate cozy-home PNG sprites for Catmagotchi.

Creates:
- cat-bed.png
- yarn-toy.png
- food-tray.png

Pure standard library only (no Pillow).
"""
from __future__ import annotations

import math
import struct
import zlib


def new_canvas(w, h):
    return [[(0, 0, 0, 0) for _ in range(w)] for _ in range(h)]


def set_pixel(img, x, y, color):
    h = len(img)
    w = len(img[0])
    if 0 <= x < w and 0 <= y < h and color[3] > 0:
        img[y][x] = color


def fill_rect(img, x, y, w, h, color):
    for py in range(y, y + h):
        for px in range(x, x + w):
            set_pixel(img, px, py, color)


def fill_circle(img, cx, cy, r, color):
    rr = r * r
    for y in range(int(cy - r) - 1, int(cy + r) + 2):
        for x in range(int(cx - r) - 1, int(cx + r) + 2):
            if (x - cx) * (x - cx) + (y - cy) * (y - cy) <= rr:
                set_pixel(img, x, y, color)


def fill_ellipse(img, cx, cy, rx, ry, color):
    for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
        for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
            dx = (x - cx) / rx
            dy = (y - cy) / ry
            if dx * dx + dy * dy <= 1.0:
                set_pixel(img, x, y, color)


def fill_rounded_rect(img, x, y, w, h, r, color):
    fill_rect(img, x + r, y, w - 2 * r, h, color)
    fill_rect(img, x, y + r, r, h - 2 * r, color)
    fill_rect(img, x + w - r, y + r, r, h - 2 * r, color)
    fill_circle(img, x + r, y + r, r, color)
    fill_circle(img, x + w - r - 1, y + r, r, color)
    fill_circle(img, x + r, y + h - r - 1, r, color)
    fill_circle(img, x + w - r - 1, y + h - r - 1, r, color)


def line(img, x0, y0, x1, y1, color, thickness=1):
    dx = abs(x1 - x0)
    dy = -abs(y1 - y0)
    sx = 1 if x0 < x1 else -1
    sy = 1 if y0 < y1 else -1
    err = dx + dy
    while True:
        fill_circle(img, x0, y0, max(1, thickness) // 2, color)
        if x0 == x1 and y0 == y1:
            break
        e2 = 2 * err
        if e2 >= dy:
            err += dy
            x0 += sx
        if e2 <= dx:
            err += dx
            y0 += sy


def png_bytes(img):
    h = len(img)
    w = len(img[0])
    raw = bytearray()
    for row in img:
        raw.append(0)
        for rgba in row:
            raw.extend(bytes(rgba))

    def chunk(tag, data):
        return (
            struct.pack('!I', len(data))
            + tag
            + data
            + struct.pack('!I', zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('!IIBBBBB', w, h, 8, 6, 0, 0, 0)
    return header + chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(bytes(raw), 9)) + chunk(b'IEND', b'')


def save(path, img):
    with open(path, 'wb') as f:
        f.write(png_bytes(img))


# Palette
TRANSPARENT = (0, 0, 0, 0)
WHITE = (255, 248, 240, 255)
CREAM = (255, 235, 215, 255)
PINK = (243, 170, 179, 255)
PINK_DARK = (219, 141, 153, 255)
PINK_LIGHT = (255, 205, 214, 255)
BROWN = (173, 116, 74, 255)
BROWN_DARK = (133, 87, 55, 255)
BEIGE = (233, 198, 166, 255)
BLUE = (129, 202, 244, 255)
BLUE_LIGHT = (196, 237, 255, 255)
GREEN = (140, 187, 110, 255)
GREEN_DARK = (96, 146, 74, 255)


def make_bed():
    """Cute fluffy donut bed — extra puffy rim, soft cushion, kawaii details."""
    img = new_canvas(120, 80)

    def bubble(cx, cy, r, col):
        fill_circle(img, cx, cy, r, col)

    # ===== Back depth layer (darkest) =====
    back_rim = [
        (20, 44, 14), (30, 36, 16), (42, 30, 18), (56, 27, 19),
        (70, 27, 19), (84, 30, 18), (96, 36, 16), (104, 44, 14),
        (98, 52, 13), (88, 58, 14), (76, 62, 15), (62, 64, 16),
        (48, 62, 15), (36, 58, 14), (26, 52, 13)
    ]
    for bx, by, br in back_rim:
        bubble(bx, by, br, (198, 110, 135, 255))

    # ===== Mid depth layer =====
    mid_rim = [
        (22, 42, 13), (32, 34, 15), (44, 28, 17), (58, 25, 18),
        (72, 25, 18), (86, 28, 17), (98, 34, 15), (106, 42, 13),
        (100, 50, 12), (90, 56, 13), (78, 60, 14), (64, 62, 15),
        (50, 60, 14), (38, 56, 13), (28, 50, 12)
    ]
    for bx, by, br in mid_rim:
        bubble(bx, by, br, (220, 140, 160, 255))

    # ===== Main body layer (PINK) =====
    main_rim = [
        (24, 40, 12), (34, 32, 14), (46, 26, 16), (60, 23, 17),
        (74, 23, 17), (88, 26, 16), (100, 32, 14), (108, 40, 12),
        (102, 48, 11), (92, 54, 12), (80, 58, 13), (66, 60, 14),
        (52, 58, 13), (40, 54, 12), (30, 48, 11)
    ]
    for bx, by, br in main_rim:
        bubble(bx, by, br, PINK)

    # ===== Light front layer =====
    light_rim = [
        (26, 38, 10), (36, 30, 12), (48, 24, 14), (62, 21, 15),
        (76, 21, 15), (90, 24, 14), (102, 30, 12), (110, 38, 10),
        (104, 46, 9), (94, 52, 10), (82, 56, 11), (68, 58, 12),
        (54, 56, 11), (42, 52, 10), (32, 46, 9)
    ]
    for bx, by, br in light_rim:
        bubble(bx, by, br, PINK_LIGHT)

    # ===== Soft inner cushion (recessed) =====
    fill_ellipse(img, 64, 44, 32, 14, (255, 235, 240, 255))
    fill_ellipse(img, 64, 42, 28, 12, (255, 245, 248, 255))
    fill_ellipse(img, 64, 40, 24, 10, WHITE)

    # cushion tuft dimples
    fill_circle(img, 52, 40, 3, (255, 228, 235, 255))
    fill_circle(img, 76, 40, 3, (255, 228, 235, 255))
    fill_circle(img, 64, 46, 2, (255, 220, 230, 255))

    # tiny quilt stitch lines
    line(img, 52, 40, 58, 36, (255, 215, 228, 255), 1)
    line(img, 64, 46, 70, 42, (255, 215, 228, 255), 1)
    line(img, 76, 40, 70, 36, (255, 215, 228, 255), 1)

    return img


def make_yarn():
    img = new_canvas(64, 64)
    # shadow
    fill_ellipse(img, 28, 43, 15, 6, (200, 150, 160, 55))
    # ball
    fill_circle(img, 27, 28, 17, PINK)
    fill_circle(img, 27, 27, 15, PINK_LIGHT)
    # knitted swirl lines
    for pts, col in [
        ([(14, 21), (20, 18), (28, 17), (37, 19), (40, 24)], PINK_DARK),
        ([(12, 28), (19, 25), (28, 24), (36, 25), (41, 30)], PINK_DARK),
        ([(15, 35), (21, 31), (28, 30), (35, 31), (39, 35)], PINK_DARK),
        ([(18, 15), (22, 13), (27, 12), (32, 13), (36, 16)], (255, 220, 227, 255)),
    ]:
        for a, b in zip(pts, pts[1:]):
            line(img, a[0], a[1], b[0], b[1], col, 1)
    # highlight
    fill_circle(img, 18, 18, 3, (255, 235, 240, 255))
    fill_circle(img, 14, 17, 1, (255, 255, 255, 180))
    # tail string
    line(img, 40, 36, 45, 39, PINK_DARK, 1)
    line(img, 45, 39, 48, 43, PINK_DARK, 1)
    line(img, 48, 43, 55, 44, PINK_DARK, 1)
    line(img, 55, 44, 58, 48, PINK_DARK, 1)
    return img


def make_food_tray():
    img = new_canvas(112, 64)
    # tray shadow
    fill_ellipse(img, 57, 50, 46, 7, (160, 112, 72, 70))

    # wooden tray: layered to look more 3D
    fill_rounded_rect(img, 8, 28, 96, 24, 8, BROWN_DARK)          # outer edge
    fill_rounded_rect(img, 10, 26, 92, 24, 8, BROWN)              # side wall / body
    fill_rounded_rect(img, 12, 28, 88, 18, 7, BEIGE)              # inner top
    fill_rect(img, 12, 38, 88, 6, (209, 157, 105, 255))          # front lip underside
    fill_rect(img, 12, 28, 88, 3, (240, 214, 183, 255))          # top highlight
    fill_rect(img, 12, 31, 88, 1, (255, 248, 236, 190))
    # subtle side shading and front edge
    fill_rect(img, 12, 28, 3, 18, (187, 129, 79, 255))
    fill_rect(img, 97, 28, 3, 18, (181, 122, 73, 255))
    fill_rect(img, 12, 42, 88, 3, (120, 80, 48, 120))

    # left food bowl (slightly raised to fit tray better)
    fill_ellipse(img, 42, 23, 15, 11, WHITE)
    fill_ellipse(img, 42, 24, 13, 9, PINK_LIGHT)
    fill_ellipse(img, 42, 24, 11, 7, (255, 241, 236, 255))
    fill_ellipse(img, 42, 22, 9, 5, (139, 86, 43, 255))
    fill_ellipse(img, 42, 20, 7, 3, (174, 118, 72, 255))
    fill_ellipse(img, 42, 19, 5, 2, (198, 146, 96, 255))
    for p in [(35, 18), (39, 15), (45, 17), (49, 20), (37, 22), (43, 21), (47, 19)]:
        fill_circle(img, p[0], p[1], 1, (120, 76, 38, 255))
    # bowl rim highlight and tiny paw mark
    fill_rect(img, 35, 15, 14, 1, (255, 251, 246, 210))
    fill_circle(img, 42, 28, 3, PINK_DARK)

    # right water bowl
    fill_ellipse(img, 79, 23, 15, 11, WHITE)
    fill_ellipse(img, 79, 24, 13, 9, (248, 241, 232, 255))
    fill_ellipse(img, 79, 24, 11, 7, BLUE_LIGHT)
    fill_ellipse(img, 79, 22, 8, 5, BLUE)
    fill_ellipse(img, 79, 20, 6, 3, (190, 234, 255, 255))
    fill_ellipse(img, 79, 19, 4, 2, (225, 249, 255, 255))
    fill_rect(img, 72, 15, 14, 1, (255, 255, 255, 180))
    fill_circle(img, 79, 28, 3, BEIGE)
    fill_circle(img, 72, 21, 1, BEIGE)
    fill_circle(img, 76, 18, 1, BEIGE)
    fill_circle(img, 83, 18, 1, BEIGE)
    fill_circle(img, 87, 21, 1, BEIGE)

    # tray paws / cute mark
    fill_circle(img, 57, 43, 5, (208, 156, 106, 255))
    fill_circle(img, 51, 40, 2, (193, 139, 92, 255))
    fill_circle(img, 55, 37, 2, (193, 139, 92, 255))
    fill_circle(img, 59, 40, 2, (193, 139, 92, 255))
    return img


def main():
    save('/home/helen/catmagotchi/assets/cat-bed.png', make_bed())
    save('/home/helen/catmagotchi/assets/yarn-toy.png', make_yarn())
    save('/home/helen/catmagotchi/assets/food-tray.png', make_food_tray())
    print('Saved cat-bed.png, yarn-toy.png, food-tray.png')


if __name__ == '__main__':
    main()
