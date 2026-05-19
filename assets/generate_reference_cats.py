#!/usr/bin/env python3
"""Generate Catmagotchi sprites to match the provided reference cat.

Outputs:
- cat-idle.png           front-facing home cat
- cat-sleep.png          curled sleep pose
- cat-adventure-idle.png side-facing adventure idle pose
- cat-run.png            side-facing adventure run pose

Pure stdlib PNG writer so this works without Pillow.
"""
from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path

SIZE = 64
OUT_DIR = Path(__file__).resolve().parent

# Palette
W = (255, 255, 255, 255)
S = (245, 245, 245, 255)
P = (255, 182, 193, 255)
P2 = (255, 210, 220, 255)
B = (255, 136, 153, 255)
M = (204, 85, 102, 255)
E = (74, 48, 32, 255)
K = (90, 58, 32, 255)
G = (221, 221, 221, 255)
BLUE = (120, 170, 220, 255)


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


def write_png(path: Path, img: bytearray) -> None:
    raw = bytearray()
    stride = SIZE * 4
    for y in range(SIZE):
        raw.append(0)
        raw.extend(img[y * stride:(y + 1) * stride])
    compressed = zlib.compress(bytes(raw), level=9)

    def chunk(kind: bytes, payload: bytes) -> bytes:
        return (
            struct.pack('>I', len(payload)) +
            kind +
            payload +
            struct.pack('>I', zlib.crc32(kind + payload) & 0xFFFFFFFF)
        )

    png = [
        b'\x89PNG\r\n\x1a\n',
        chunk(b'IHDR', struct.pack('>IIBBBBB', SIZE, SIZE, 8, 6, 0, 0, 0)),
        chunk(b'IDAT', compressed),
        chunk(b'IEND', b''),
    ]
    path.write_bytes(b''.join(png))


# --- FRONT-FACING HOME IDLE ---
def draw_idle(img: bytearray) -> None:
    # Tail
    tail = [(48, 38), (49, 37), (50, 36), (51, 35), (52, 34), (53, 33), (54, 32),
            (55, 31), (56, 30), (56, 29), (56, 28), (56, 27), (55, 26), (54, 25),
            (53, 24), (52, 24), (51, 24), (50, 25), (49, 26), (48, 27), (47, 28), (46, 29)]
    for x, y in tail:
        set_px(img, x, y, W)
    for x, y in [(57, 30), (57, 29), (57, 28), (55, 23), (54, 23)]:
        set_px(img, x, y, S)

    # Body
    for y in range(32, 51):
        for x in range(14, 47):
            dx = x - 30
            dy = y - 40
            if dx * dx / 180 + dy * dy / 90 <= 1.2:
                set_px(img, x, y, W)
    for y in range(42, 51):
        for x in range(32, 47):
            dx = x - 30
            dy = y - 40
            if dx * dx / 180 + dy * dy / 90 <= 1.2 and dx > 5:
                set_px(img, x, y, S)

    # Legs
    fill_rect(img, 18, 48, 5, 8, W)
    fill_rect(img, 19, 55, 3, 2, P)
    fill_rect(img, 37, 48, 5, 8, W)
    fill_rect(img, 38, 55, 3, 2, P)
    fill_rect(img, 22, 46, 4, 7, S)
    fill_rect(img, 34, 46, 4, 7, S)

    # Head
    for y in range(8, 39):
        for x in range(12, 49):
            dx = x - 30
            dy = y - 22
            if dx * dx + dy * dy <= 280:
                set_px(img, x, y, W)
    for y in range(25, 37):
        for x in range(36, 49):
            dx = x - 30
            dy = y - 22
            if dx * dx + dy * dy <= 280 and dx > 8:
                set_px(img, x, y, S)

    # Ears
    left_ear = [
        (14, 10), (15, 9), (16, 8), (17, 7), (18, 6), (19, 5), (20, 4),
        (13, 11), (14, 11), (15, 11), (16, 11), (17, 11), (18, 11), (19, 11), (20, 11), (21, 11),
        (12, 12), (13, 12), (14, 12), (15, 12), (16, 12), (17, 12), (18, 12), (19, 12), (20, 12), (21, 12), (22, 12),
        (13, 13), (14, 13), (15, 13), (16, 13), (17, 13), (18, 13), (19, 13), (20, 13), (21, 13),
    ]
    for x, y in left_ear:
        set_px(img, x, y, W)
    for x, y in [(16, 9), (17, 8), (18, 7), (15, 10), (16, 10), (17, 10), (18, 10), (19, 10),
                 (15, 11), (16, 11), (17, 11), (18, 11), (19, 11), (16, 12), (17, 12), (18, 12)]:
        set_px(img, x, y, P)

    right_ear = [
        (46, 10), (45, 9), (44, 8), (43, 7), (42, 6), (41, 5), (40, 4),
        (47, 11), (46, 11), (45, 11), (44, 11), (43, 11), (42, 11), (41, 11), (40, 11), (39, 11),
        (48, 12), (47, 12), (46, 12), (45, 12), (44, 12), (43, 12), (42, 12), (41, 12), (40, 12), (39, 12), (38, 12),
        (47, 13), (46, 13), (45, 13), (44, 13), (43, 13), (42, 13), (41, 13), (40, 13), (39, 13),
    ]
    for x, y in right_ear:
        set_px(img, x, y, W)
    for x, y in [(44, 9), (43, 8), (42, 7), (45, 10), (44, 10), (43, 10), (42, 10), (41, 10),
                 (45, 11), (44, 11), (43, 11), (42, 11), (41, 11), (44, 12), (43, 12), (42, 12)]:
        set_px(img, x, y, P)

    # Eyes
    fill_circle(img, 20, 20, 6, E)
    fill_circle(img, 17, 16, 3, W)
    fill_circle(img, 22, 22, 1.5, W)
    fill_circle(img, 40, 20, 6, E)
    fill_circle(img, 37, 16, 3, W)
    fill_circle(img, 42, 22, 1.5, W)

    # Blush
    fill_circle(img, 14, 26, 4, P)
    fill_circle(img, 46, 26, 4, P)

    # Nose / mouth
    for pt in [(30, 24), (29, 25), (30, 25), (31, 25)]:
        set_px(img, *pt, B)
    for pt in [(28, 27), (29, 28), (30, 29), (31, 28), (32, 27)]:
        set_px(img, *pt, M if pt[1] != 29 else B)
    fill_rect(img, 29, 29, 3, 3, B)
    set_px(img, 30, 30, (255, 153, 170, 255))

    # Whiskers
    draw_line(img, 8, 22, 2, 20, K)
    draw_line(img, 8, 25, 1, 25, K)
    draw_line(img, 8, 28, 2, 30, K)
    draw_line(img, 52, 22, 58, 20, K)
    draw_line(img, 52, 25, 59, 25, K)
    draw_line(img, 52, 28, 58, 30, K)


# --- SIDE PROFILE ADVENTURE IDLE ---
def draw_side_idle(img: bytearray) -> None:
    # Tail curled up behind the body.
    tail = [(48, 37), (50, 35), (52, 33), (54, 31), (55, 29), (56, 27), (56, 25),
            (55, 23), (54, 21), (52, 20), (50, 21)]
    for x, y in tail:
        set_px(img, x, y, W)
    for x, y in [(54, 32), (55, 30), (55, 28), (53, 22), (52, 22)]:
        set_px(img, x, y, S)

    # Body — low and compact.
    fill_ellipse(img, 36, 39, 17, 11, W)
    fill_ellipse(img, 43, 41, 9, 7, S)
    fill_ellipse(img, 29, 41, 7, 5, S)

    # Legs — standing, not running.
    fill_rect(img, 21, 45, 4, 8, W)
    fill_rect(img, 22, 52, 4, 2, P)
    fill_rect(img, 39, 44, 4, 9, W)
    fill_rect(img, 40, 52, 4, 2, P)
    fill_rect(img, 33, 46, 3, 5, S)
    fill_rect(img, 33, 52, 2, 1, P)

    # Head — round, facing left, overlapping the body a bit.
    fill_circle(img, 19, 23, 14, W)
    fill_circle(img, 26, 25, 8, S)
    fill_ellipse(img, 13, 27, 7, 5, W)
    fill_ellipse(img, 16, 28, 4, 3, S)

    # Ears — attached, triangular, pink inner.
    fill_triangle(img, (15, 11), (18, 4), (22, 12), W)
    fill_triangle(img, (16, 12), (18, 7), (20, 12), P)
    fill_triangle(img, (25, 12), (29, 5), (33, 13), W)
    fill_triangle(img, (26, 12), (29, 7), (31, 12), P)

    # Eye.
    fill_circle(img, 14, 22, 4, (250, 250, 252, 255))
    fill_circle(img, 15, 23, 2, E)
    set_px(img, 16, 20, W)
    set_px(img, 17, 21, W)

    # Nose / mouth / blush / whiskers on tail side.
    for pt in [(8, 26), (9, 25), (10, 26)]:
        set_px(img, *pt, B)
    draw_line(img, 10, 29, 12, 30, B)
    draw_line(img, 12, 30, 14, 29, B)
    fill_circle(img, 23, 28, 3, P)
    draw_line(img, 22, 18, 30, 16, K)
    draw_line(img, 22, 20, 31, 20, K)
    draw_line(img, 22, 22, 30, 24, K)


# --- SIDE PROFILE RUN ---
def draw_side_run(img: bytearray) -> None:
    # Tail
    for x, y in [(49, 37), (51, 34), (53, 31), (54, 28), (55, 25), (55, 22), (54, 20), (52, 18), (50, 19)]:
        set_px(img, x, y, W)
    for x, y in [(54, 29), (55, 27), (54, 23), (52, 20)]:
        set_px(img, x, y, S)

    # Body
    fill_ellipse(img, 37, 40, 18, 10, W)
    fill_ellipse(img, 44, 42, 9, 7, S)
    fill_ellipse(img, 30, 42, 7, 5, S)

    # Legs: stronger stagger.
    draw_line(img, 23, 44, 20, 48, W)
    draw_line(img, 20, 48, 17, 51, W)
    fill_circle(img, 16, 52, 2, P)
    draw_line(img, 40, 44, 43, 48, W)
    draw_line(img, 43, 48, 46, 51, W)
    fill_circle(img, 47, 52, 2, P)
    draw_line(img, 33, 46, 33, 49, S)
    fill_circle(img, 33, 52, 1.5, P)

    # Head
    fill_circle(img, 19, 24, 14, W)
    fill_circle(img, 26, 26, 8, S)
    fill_ellipse(img, 12, 28, 7, 5, W)
    fill_ellipse(img, 16, 29, 4, 3, S)

    # Ears
    fill_triangle(img, (15, 11), (18, 4), (22, 12), W)
    fill_triangle(img, (16, 12), (18, 7), (20, 12), P)
    fill_triangle(img, (25, 12), (29, 5), (33, 13), W)
    fill_triangle(img, (26, 12), (29, 7), (31, 12), P)

    # Eye and face.
    fill_circle(img, 14, 23, 4, (250, 250, 252, 255))
    fill_circle(img, 15, 24, 2, E)
    set_px(img, 16, 21, W)
    set_px(img, 17, 22, W)
    for pt in [(8, 27), (9, 26), (10, 27), (11, 27)]:
        set_px(img, *pt, B)
    draw_line(img, 10, 30, 12, 31, B)
    draw_line(img, 12, 31, 14, 30, B)
    fill_circle(img, 23, 29, 3, P)
    draw_line(img, 22, 19, 30, 17, K)
    draw_line(img, 22, 21, 31, 21, K)
    draw_line(img, 22, 23, 30, 25, K)


# --- SLEEP ---
def draw_sleep(img: bytearray) -> None:
    # Main curled body.
    fill_circle(img, 32, 32, 16, W)
    fill_circle(img, 38, 36, 10, S)
    # Small tucked head on the left.
    fill_circle(img, 18, 27, 10, W)
    fill_circle(img, 21, 30, 5, S)

    # Ear.
    fill_triangle(img, (13, 11), (16, 5), (20, 12), W)
    fill_triangle(img, (14, 12), (16, 8), (18, 12), P)

    # Sleepy eyes.
    draw_line(img, 11, 25, 15, 27, E)
    draw_line(img, 17, 27, 21, 25, E)

    # Nose / blush.
    set_px(img, 8, 27, B)
    fill_circle(img, 11, 30, 3, P)

    # Tail wrap.
    for x, y in [(48, 42), (50, 40), (52, 38), (54, 36), (55, 34), (56, 32), (56, 30), (55, 28), (53, 26), (50, 24), (46, 22)]:
        set_px(img, x, y, W)

    # Paws tucked in.
    fill_rect(img, 21, 44, 5, 3, S)
    fill_rect(img, 38, 44, 5, 3, S)

    # Zs.
    for pt in [(36, 10), (37, 9), (38, 8), (38, 10), (36, 12), (37, 12), (38, 12)]:
        set_px(img, *pt, BLUE)
    for pt in [(42, 6), (43, 5), (44, 4), (44, 6), (42, 8), (43, 8), (44, 8)]:
        set_px(img, *pt, (102, 153, 204, 255))
    for pt in [(46, 3), (47, 2), (48, 1), (48, 3), (46, 5), (47, 5), (48, 5)]:
        set_px(img, *pt, (68, 119, 170, 255))


def main() -> None:
    outputs = {
        'cat-idle.png': draw_idle,
        'cat-sleep.png': draw_sleep,
        'cat-adventure-idle.png': draw_side_idle,
        'cat-run.png': draw_side_run,
    }
    for filename, fn in outputs.items():
        img = new_canvas()
        fn(img)
        write_png(OUT_DIR / filename, img)
        print(f'Saved {filename}')


if __name__ == '__main__':
    main()
