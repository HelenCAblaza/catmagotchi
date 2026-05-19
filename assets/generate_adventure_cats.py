#!/usr/bin/env python3
"""Generate the side-facing 64x64 adventure cat sprite.

This version uses only the Python standard library so it works even when PIL is
not installed. It redraws the run cat from scratch with:
- rounder head + clear muzzle
- attached upright ears
- white sclera + brown pupil
- compact body with visible stride
- fluffy tail and soft pink accents
"""
from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path

SIZE = 64
TRANSPARENT = (0, 0, 0, 0)

# Palette
W = (255, 255, 255, 255)      # fur
S = (245, 245, 245, 255)      # soft shadow
P = (255, 182, 193, 255)      # pink accents
B = (255, 136, 153, 255)      # nose / mouth
E = (74, 48, 32, 255)         # eye / pupil
K = (90, 58, 32, 255)         # whiskers

OUT = Path(__file__).resolve().parent / "cat-run.png"


def new_canvas() -> bytearray:
    return bytearray(SIZE * SIZE * 4)


def set_px(img: bytearray, x: int, y: int, color) -> None:
    if 0 <= x < SIZE and 0 <= y < SIZE:
        i = (y * SIZE + x) * 4
        img[i:i + 4] = bytes(color)


def fill_rect(img: bytearray, x: int, y: int, w: int, h: int, color) -> None:
    for py in range(y, y + h):
        for px in range(x, x + w):
            set_px(img, px, py, color)


def fill_circle(img: bytearray, cx: float, cy: float, r: float, color) -> None:
    left = math.floor(cx - r - 1)
    right = math.ceil(cx + r + 1)
    top = math.floor(cy - r - 1)
    bottom = math.ceil(cy + r + 1)
    rr = r * r
    for y in range(top, bottom + 1):
        for x in range(left, right + 1):
            dx = x - cx
            dy = y - cy
            if dx * dx + dy * dy <= rr:
                set_px(img, x, y, color)


def fill_ellipse(img: bytearray, cx: float, cy: float, rx: float, ry: float, color) -> None:
    left = math.floor(cx - rx - 1)
    right = math.ceil(cx + rx + 1)
    top = math.floor(cy - ry - 1)
    bottom = math.ceil(cy + ry + 1)
    inv_rx2 = 1.0 / (rx * rx)
    inv_ry2 = 1.0 / (ry * ry)
    for y in range(top, bottom + 1):
        for x in range(left, right + 1):
            dx = x - cx
            dy = y - cy
            if dx * dx * inv_rx2 + dy * dy * inv_ry2 <= 1.0:
                set_px(img, x, y, color)


def fill_triangle(img: bytearray, a, b, c, color) -> None:
    (x1, y1), (x2, y2), (x3, y3) = a, b, c
    min_x = math.floor(min(x1, x2, x3))
    max_x = math.ceil(max(x1, x2, x3))
    min_y = math.floor(min(y1, y2, y3))
    max_y = math.ceil(max(y1, y2, y3))

    def edge(px, py, qx, qy, rx, ry):
        return (rx - px) * (qy - py) - (ry - py) * (qx - px)

    area = edge(x1, y1, x2, y2, x3, y3)
    if area == 0:
        return
    sign = 1 if area > 0 else -1

    for y in range(min_y, max_y + 1):
        for x in range(min_x, max_x + 1):
            w1 = sign * edge(x2, y2, x3, y3, x, y)
            w2 = sign * edge(x3, y3, x1, y1, x, y)
            w3 = sign * edge(x1, y1, x2, y2, x, y)
            if w1 >= 0 and w2 >= 0 and w3 >= 0:
                set_px(img, x, y, color)


def draw_line(img: bytearray, x1: int, y1: int, x2: int, y2: int, color) -> None:
    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    sx = 1 if x1 < x2 else -1
    sy = 1 if y1 < y2 else -1
    err = dx - dy
    x, y = x1, y1
    while True:
        set_px(img, x, y, color)
        if x == x2 and y == y2:
            return
        e2 = 2 * err
        if e2 > -dy:
            err -= dy
            x += sx
        if e2 < dx:
            err += dx
            y += sy


def stamp_tail(img: bytearray) -> None:
    # Curved fluffy tail behind the body.
    tail_points = [
        (49, 37, 5),
        (51, 34, 4),
        (53, 31, 4),
        (54, 27, 3),
        (53, 23, 3),
        (50, 20, 4),
        (46, 18, 3),
    ]
    for x, y, r in tail_points:
        fill_circle(img, x, y, r, W)
    for x, y, r in [(52, 32, 3), (54, 28, 2), (51, 24, 2), (48, 21, 2)]:
        fill_circle(img, x, y, r, S)


def stamp_body(img: bytearray) -> None:
    # Main body blob.
    fill_ellipse(img, 38, 40, 18, 10, W)
    # Back shadow / depth.
    fill_ellipse(img, 44, 42, 9, 7, S)
    # A tiny chest shadow.
    fill_ellipse(img, 30, 42, 7, 5, S)

    # Running legs: stronger stagger so the stride reads as motion.
    draw_line(img, 23, 44, 20, 48, W)   # front thigh
    draw_line(img, 20, 48, 17, 51, W)   # front shin
    fill_circle(img, 16, 52, 2, P)      # front paw

    draw_line(img, 40, 44, 43, 48, W)   # rear thigh
    draw_line(img, 43, 48, 46, 51, W)   # rear shin
    fill_circle(img, 47, 52, 2, P)      # rear paw

    # A tucked support leg so the body doesn't read as a sausage.
    draw_line(img, 33, 46, 33, 49, S)
    fill_circle(img, 33, 52, 1.5, P)


def stamp_head(img: bytearray) -> None:
    # Head circle, overlapping the body a little.
    fill_circle(img, 20, 25, 14, W)
    # Soft head shadow on the back/right side.
    fill_circle(img, 27, 26, 8, S)

    # Muzzle protrusion so it clearly reads as a side profile.
    fill_ellipse(img, 13, 27, 7, 5, W)
    fill_ellipse(img, 16, 28, 4, 3, S)

    # Ears: upright and attached, not floating.
    fill_triangle(img, (15, 12), (18, 5), (22, 13), W)
    fill_triangle(img, (16, 13), (18, 7), (20, 13), P)

    fill_triangle(img, (25, 13), (29, 6), (33, 14), W)
    fill_triangle(img, (26, 13), (29, 8), (31, 13), P)

    # Eye: white sclera + brown pupil + sparkle.
    fill_circle(img, 16, 23, 4, (250, 250, 252, 255))
    fill_circle(img, 17, 24, 2, E)
    set_px(img, 18, 21, W)
    set_px(img, 19, 22, W)
    set_px(img, 15, 21, (255, 255, 255, 220))

    # Nose and mouth.
    fill_triangle(img, (8, 26), (11, 25), (10, 28), B)
    draw_line(img, 10, 29, 12, 30, B)
    draw_line(img, 12, 30, 14, 29, B)

    # Tiny smile curve.
    set_px(img, 11, 30, B)
    set_px(img, 12, 31, B)
    set_px(img, 13, 30, B)

    # Subtle blush.
    fill_ellipse(img, 17, 29, 3, 2, (255, 220, 230, 255))

    # Whiskers — short and tidy.
    draw_line(img, 10, 27, 6, 26, K)
    draw_line(img, 10, 29, 5, 29, K)
    draw_line(img, 10, 31, 6, 32, K)


def draw_run_cat(img: bytearray) -> None:
    stamp_tail(img)
    stamp_body(img)
    stamp_head(img)


def encode_png_rgba(img: bytearray, width: int = SIZE, height: int = SIZE) -> bytes:
    # Filter type 0 for every row — simplest and perfectly fine for pixel art.
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)
        start = y * stride
        raw.extend(img[start:start + stride])

    compressor = zlib.compressobj(level=9)
    compressed = compressor.compress(bytes(raw)) + compressor.flush()

    def chunk(kind: bytes, payload: bytes) -> bytes:
        return (
            struct.pack('>I', len(payload)) +
            kind +
            payload +
            struct.pack('>I', zlib.crc32(kind + payload) & 0xFFFFFFFF)
        )

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    return header + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')


def main() -> None:
    img = new_canvas()
    draw_run_cat(img)
    OUT.write_bytes(encode_png_rgba(img))
    print(f'Saved {OUT}')


if __name__ == '__main__':
    main()
