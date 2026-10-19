#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image


def png_to_pixel_svg(src: Path, dst: Path) -> tuple[int, int, int]:
    im = Image.open(src).convert("RGBA")
    width, height = im.size
    px = im.load()

    grid: list[list[str | None]] = [[None] * width for _ in range(height)]
    color_to_class: dict[str, str] = {}

    for y in range(height):
        for x in range(width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            color = f"#{r:02x}{g:02x}{b:02x}"
            grid[y][x] = color
            color_to_class.setdefault(color, f"c{len(color_to_class)}")

    horiz: list[tuple[int, int, int, int, str]] = []
    for y in range(height):
        x = 0
        while x < width:
            color = grid[y][x]
            if color is None:
                x += 1
                continue
            run = 1
            while x + run < width and grid[y][x + run] == color:
                run += 1
            horiz.append((x, y, run, 1, color))
            x += run

    by_key: dict[tuple[int, int, str], list[tuple[int, int]]] = {}
    for x, y, rw, _rh, color in horiz:
        by_key.setdefault((x, rw, color), []).append((y, 1))

    merged: list[tuple[int, int, int, int, str]] = []
    for (x, rw, color), spans in by_key.items():
        spans.sort()
        cur_y, cur_h = spans[0]
        for y, _ in spans[1:]:
            if y == cur_y + cur_h:
                cur_h += 1
            else:
                merged.append((x, cur_y, rw, cur_h, color))
                cur_y, cur_h = y, 1
        merged.append((x, cur_y, rw, cur_h, color))

    rects = "".join(
        f'<rect class="{color_to_class[c]}" x="{x}" y="{y}" width="{rw}" height="{rh}"/>'
        for x, y, rw, rh, c in merged
    )

    style = ".".join(
        f"{cls}{{fill:{color}}}" for color, cls in color_to_class.items()
    )

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {width} {height}" '
        f'shape-rendering="crispEdges" '
        f'width="{width}" height="{height}">'
        f"<style>{style}</style>"
        f"{rects}"
        f"</svg>\n"
    )

    dst.write_text(svg, encoding="utf-8")
    return len(svg), len(merged), len(color_to_class)


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("public/favicon.png")
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("public/favicon.svg")
    bytes_written, rect_count, color_count = png_to_pixel_svg(src, dst)
    print(f"wrote {dst} ({bytes_written} B, {rect_count} rects, {color_count} colors)")


if __name__ == "__main__":
    main()