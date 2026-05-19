#!/usr/bin/env python3
"""Generate the side-facing adventure run cat sprite.

This version uses only the Python standard library so it can run in a
minimal environment without Pillow.
"""
from __future__ import annotations

import struct
import zlib

SIZE = 64

# Palette
W = (255, 255, 255, 255)   # white fur
S = (245, 245, 245, 255)   # shadow white
P = (255, 182, 193, 255)   # pink inner ear / blush
E = (74, 48, 32, 255)      # dark brown eye
B = (255, 136, 153, 255)   # nose / tongue
M = (204, 85, 102, 255)    # mouth line
K = (90, 58, 32, 255)      # whiskers
LIGHT_PINK = (255, 220, 230, 255)


def new_canvas():
    return [[(0, 0, 0, 0) for _ in range(SIZE)] for _ in range(SIZE)]


def set_pixel(img, x, y, color):
    if 0 <= x < SIZE and 0 <= y < SIZE and color:
        img[y][x] = color


def fill_rect(img, x, y, w, h, color):
    for py in range(y, y + h):
        for px in range(x, x + w):
            set_pixel(img, px, py, color)


def fill_circle(img, cx, cy, r, color):
    ir = int(r) + 1
    rr = r * r
    for y in range(-ir, ir + 1):
        for x in range(-ir, ir + 1):
            if x * x + y * y <= rr + 0.5:
                set_pixel(img, cx + x, cy + y, color)


def fill_ellipse(img, cx, cy, rx, ry, color):
    x0 = int(cx - rx) - 1
    x1 = int(cx + rx) + 1
    y0 = int(cy - ry) - 1
    y1 = int(cy + ry) + 1
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            dx = (x - cx) / rx
            dy = (y - cy) / ry
            if dx * dx + dy * dy <= 1.0:
                set_pixel(img, x, y, color)


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
    """Side-facing RUN cat with shorter, rounder legs."""
    # Tail (curved up behind, short)
    for x, y in [
        (48, 36), (50, 34), (52, 32), (54, 30), (55, 28),
        (55, 26), (54, 24), (52, 23), (50, 24),
    ]:
        set_pixel(img, x, y, W)
    set_pixel(img, 56, 30, S)
    set_pixel(img, 56, 28, S)

    # Body: short, chubby oval
    fill_ellipse(img, 32, 40, 14, 8, W)
    # Body shadow on the back side
    fill_ellipse(img, 37, 41, 8, 5, S)

    # Legs: shorter and rounder, tucked more under body
    # Front leg reaching forward
    fill_ellipse(img, 20, 47, 2.5, 2.8, W)
    fill_ellipse(img, 18, 50, 1.6, 1.4, P)

    # Front tucked leg
    fill_ellipse(img, 27, 47, 2.2, 2.3, S)
    fill_ellipse(img, 27, 49, 1.4, 1.2, P)

    # Back leg reaching back
    fill_ellipse(img, 42, 46, 2.4, 2.8, W)
    fill_ellipse(img, 45, 49, 1.6, 1.4, P)

    # Back tucked leg
    fill_ellipse(img, 36, 47, 2.0, 2.1, S)
    fill_ellipse(img, 37, 49, 1.3, 1.1, P)

    # Head: big round circle, facing left
    fill_circle(img, 21, 25, 15, W)
    # Head shadow on the back side
    fill_ellipse(img, 28, 26, 7, 9, S)

    # Ears attached to the back of head, pointing up
    for x, y in [
        (17, 8), (18, 7), (19, 6), (20, 5), (21, 5), (22, 6),
        (16, 9), (17, 9), (18, 9), (19, 9), (20, 9), (21, 9), (22, 9), (23, 9),
        (16, 10), (17, 10), (18, 10), (19, 10), (20, 10), (21, 10), (22, 10), (23, 10),
        (17, 11), (18, 11), (19, 11), (20, 11), (21, 11), (22, 11), (23, 11),
        (18, 12), (19, 12), (20, 12), (21, 12), (22, 12),
    ]:
        set_pixel(img, x, y, W)
    for x, y in [
        (19, 7), (20, 6), (21, 6),
        (18, 8), (19, 8), (20, 8), (21, 8),
        (18, 9), (19, 9), (20, 9), (21, 9),
        (18, 10), (19, 10), (20, 10), (21, 10),
        (19, 11), (20, 11), (21, 11),
    ]:
        set_pixel(img, x, y, P)

    for x, y in [
        (25, 9), (26, 8), (27, 7), (28, 6), (29, 6), (30, 7),
        (25, 10), (26, 10), (27, 10), (28, 10), (29, 10), (30, 10), (31, 10),
        (25, 11), (26, 11), (27, 11), (28, 11), (29, 11), (30, 11), (31, 11),
        (26, 12), (27, 12), (28, 12), (29, 12), (30, 12),
        (27, 13), (28, 13), (29, 13),
    ]:
        set_pixel(img, x, y, W)
    for x, y in [
        (27, 8), (28, 7), (29, 7),
        (26, 9), (27, 9), (28, 9), (29, 9),
        (26, 10), (27, 10), (28, 10), (29, 10),
        (27, 11), (28, 11), (29, 11),
    ]:
        set_pixel(img, x, y, P)

    # Eye / face
    fill_circle(img, 15, 21, 2.75, E)
    fill_circle(img, 14, 19, 1.4, W)
    fill_circle(img, 16, 22, 0.8, W)
    set_pixel(img, 13, 18, W)

    # Blush
    cx, cy = 20, 27
    a, b = 2.5, 1.5
    for y in range(int(cy - b) - 1, int(cy + b) + 2):
        for x in range(int(cx - a) - 1, int(cx + a) + 2):
            dx = x - cx
            dy = y - cy
            if (dx * dx) / (a * a) + (dy * dy) / (b * b) <= 1.0:
                set_pixel(img, x, y, LIGHT_PINK)

    # Nose / mouth / whiskers
    set_pixel(img, 8, 25, B)
    set_pixel(img, 7, 26, B)
    set_pixel(img, 8, 26, B)

    set_pixel(img, 10, 27, M)
    set_pixel(img, 11, 28, B)
    set_pixel(img, 12, 27, M)

    set_pixel(img, 20, 28, K)
    set_pixel(img, 21, 29, K)
    set_pixel(img, 19, 30, K)


def encode_png(img):
    raw = bytearray()
    for row in img:
        raw.append(0)  # no filter
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
    ihdr = struct.pack('!IIBBBBB', SIZE, SIZE, 8, 6, 0, 0, 0)
    body = zlib.compress(bytes(raw), level=9)
    return header + chunk(b'IHDR', ihdr) + chunk(b'IDAT', body) + chunk(b'IEND', b'')


def main():
    img = new_canvas()
    draw_run_cat(img)
    with open('/home/helen/catmagotchi/assets/cat-run.png', 'wb') as f:
        f.write(encode_png(img))
    print('Saved cat-run.png')


if __name__ == '__main__':
    main()
