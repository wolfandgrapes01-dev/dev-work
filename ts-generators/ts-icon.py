import os
import re
from pathlib import Path

# ===================== 配置 =====================
ROOT = Path(__file__).resolve().parent
PUBLIC_DIR = ROOT / "public"
OUTPUT_FILE = ROOT / "publicPaths.ts"
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif", ".ico"}
# ================================================


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

            # 重名处理，确保唯一
            original_key = key
            counter = 1
            while key in result:
                key = f"{original_key}_{counter}"
                counter += 1

            result[key] = url

    return result


def generate_ts():
    mapping = collect_files()
    lines = [
        "/* AUTO GENERATED FROM public DIRECTORY. DO NOT EDIT MANUALLY */\n"
    ]
    for k, v in mapping.items():
        lines.append(f'export const {k} = "{v}";')

    # 确保输出目录存在
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    # 写入 TS 文件
    OUTPUT_FILE.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated: {str(OUTPUT_FILE)}")


if __name__ == "__main__":
    generate_ts()