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
    img = new_canvas(104, 72)
    # soft shadow
    fill_ellipse(img, 53, 49, 42, 12, (230, 176, 182, 55))
    # base
    fill_ellipse(img, 52, 42, 39, 20, PINK)
    fill_ellipse(img, 52, 43, 37, 18, PINK_LIGHT)
    # rim shading
    fill_ellipse(img, 52, 46, 35, 16, PINK_DARK)
    fill_ellipse(img, 52, 41, 33, 14, PINK_LIGHT)
    # fluffy cushion
    fill_ellipse(img, 53, 40, 28, 12, CREAM)
    fill_ellipse(img, 53, 39, 25, 10, (255, 245, 234, 255))
    # stitch / tuft lines
    line(img, 35, 39, 42, 35, (255, 232, 220, 255), 1)
    line(img, 41, 43, 47, 37, (255, 232, 220, 255), 1)
    line(img, 58, 44, 64, 37, (255, 232, 220, 255), 1)
    line(img, 68, 39, 75, 43, (255, 232, 220, 255), 1)
    # front paw print
    fill_circle(img, 51, 54, 4, PINK_LIGHT)
    fill_circle(img, 42, 49, 2, PINK_LIGHT)
    fill_circle(img, 46, 46, 2, PINK_LIGHT)
    fill_circle(img, 56, 46, 2, PINK_LIGHT)
    fill_circle(img, 60, 49, 2, PINK_LIGHT)
    # little base underside
    fill_ellipse(img, 52, 50, 35, 7, (216, 145, 155, 120))
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
    fill_ellipse(img, 57, 49, 46, 7, (160, 112, 72, 65))
    # wooden tray
    fill_rounded_rect(img, 10, 28, 92, 24, 7, BROWN)
    fill_rounded_rect(img, 12, 30, 88, 20, 6, BEIGE)
    fill_rect(img, 12, 41, 88, 10, (199, 147, 98, 255))
    # front lip / shadow
    fill_rounded_rect(img, 12, 40, 88, 12, 5, BROWN_DARK)
    fill_rounded_rect(img, 14, 32, 84, 16, 4, (223, 187, 145, 255))
    # bowls
    # left food bowl
    fill_circle(img, 42, 24, 14, WHITE)
    fill_circle(img, 42, 25, 12, PINK_LIGHT)
    fill_circle(img, 42, 26, 10, (255, 239, 233, 255))
    fill_circle(img, 42, 23, 8, (139, 86, 43, 255))
    for p in [(36, 21), (40, 17), (45, 22), (48, 19), (39, 26), (44, 25), (47, 24), (34, 24), (38, 20)]:
        fill_circle(img, p[0], p[1], 1, (120, 76, 38, 255))
    fill_circle(img, 42, 27, 9, (146, 93, 48, 255))
    fill_circle(img, 42, 25, 8, (116, 72, 35, 255))
    fill_circle(img, 42, 24, 7, (126, 82, 42, 255))
    # bowl rim and paw mark
    fill_circle(img, 42, 24, 13, WHITE)
    fill_circle(img, 42, 26, 11, PINK_LIGHT)
    fill_circle(img, 42, 27, 8, (130, 80, 37, 255))
    fill_circle(img, 42, 31, 4, PINK_DARK)
    fill_circle(img, 35, 28, 2, PINK_DARK)
    fill_circle(img, 39, 25, 2, PINK_DARK)
    fill_circle(img, 45, 25, 2, PINK_DARK)
    fill_circle(img, 49, 28, 2, PINK_DARK)

    # right water bowl
    fill_circle(img, 78, 24, 14, WHITE)
    fill_circle(img, 78, 25, 12, (248, 241, 232, 255))
    fill_circle(img, 78, 26, 10, BLUE_LIGHT)
    fill_circle(img, 78, 25, 7, BLUE)
    fill_circle(img, 78, 24, 8, (170, 224, 250, 255))
    fill_circle(img, 78, 31, 4, BEIGE)
    fill_circle(img, 71, 28, 2, BEIGE)
    fill_circle(img, 75, 25, 2, BEIGE)
    fill_circle(img, 81, 25, 2, BEIGE)
    fill_circle(img, 85, 28, 2, BEIGE)

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
