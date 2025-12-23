import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public"
OUTPUT_FILE = ROOT / "src/assets/publicPaths.ts"

IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif", ".ico"}


def to_snake_upper(text: str) -> str:
    """
    Convert "heroImagePng" or "hero-image" -> "HERO_IMAGE_PNG"
    """
    # Split by non-alphanumeric
    text = re.sub(r"[^A-Za-z0-9]+", "_", text)

    # Insert underscore before capitals (camelCase support)
    text = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", text)

    text = text.upper()

    # Remove multiple _
    text = re.sub(r"_+", "_", text)

    # Trim _
    text = text.strip("_")

    # Const 不能以数字开头
    if text and text[0].isdigit():
        text = "_" + text

    return text


def normalize_name(filename: str) -> str:
    """
    hero-image.png -> HERO_IMAGE_PNG
    album-a.jpg -> ALBUM_A_JPG
    """
    name, ext = os.path.splitext(filename)
    ext_clean = ext.replace(".", "")

    combined = f"{name}_{ext_clean}"
    return to_snake_upper(combined)


def collect_files():
    result = {}

    for root, dirs, files in os.walk(PUBLIC_DIR):
        rel_dir = Path(root).relative_to(PUBLIC_DIR)

        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext not in IMAGE_EXT:
                continue

            key = normalize_name(f)

            url = "/" + str(rel_dir / f).replace("\\", "/")
            if rel_dir == Path("."):
                url = "/" + f

            # 重名处理
            if key in result:
                if rel_dir != Path("."):
                    key = to_snake_upper(f"{rel_dir.name}_{key}")
                else:
                    key = key + "_DUP"

            result[key] = url

    return result


def generate_ts():
    mapping = collect_files()

    lines = [
        "/* AUTO GENERATED FROM public DIRECTORY. DO NOT EDIT MANUALLY */\n"
    ]

    for k, v in mapping.items():
        lines.append(f'export const {k} = "{v}";')

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Generated: {OUTPUT_FILE}")


if __name__ == "__main__":
    generate_ts()