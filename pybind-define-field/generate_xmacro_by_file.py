import re
import json
from pathlib import Path

# --------------------- 读取配置 ---------------------
with open("config.json", "r") as f:
    config = json.load(f)

scan_files = config.get("scan_files", [])
output_dir = Path(config.get("output_dir", "xmacro_output"))
output_dir.mkdir(exist_ok=True)

# --------------------- 宏匹配模式 ---------------------
define_pattern = re.compile(r'#define\s+(\w+)\s+(.+)')

# --------------------- 扫描头文件并生成 X-macro ---------------------
for file_path in scan_files:
    path = Path(file_path)
    if not path.exists():
        print(f"[Warning] File not found: {file_path}")
        continue

    xmacro_entries = []

    with open(path, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("#define"):
                match = define_pattern.match(line)
                if match:
                    name, value = match.groups()
                    # 去掉行内注释
                    value = value.split("//")[0].strip()
                    value = value.split("/*")[0].strip()
                    xmacro_entries.append(f"    X({name}, {value})")

    if not xmacro_entries:
        print(f"[Info] No constants found in {file_path}")
        continue

    # 根据文件名生成 X-macro 宏名字，例如 shlogger_constants.h -> SHLOGGER_CONSTANTS_LIST
    macro_name = f"{path.stem.upper()}_LIST"

    output_file = output_dir / f"{path.stem}_list.h"

    with open(output_file, "w") as f_out:
        f_out.write(f"// Auto-generated from {file_path}\n")
        f_out.write(f"#ifndef {macro_name}_H\n")
        f_out.write(f"#define {macro_name}_H\n\n")
        f_out.write(f"#define {macro_name} \\\n")
        f_out.write(" \\\n".join(xmacro_entries))
        f_out.write(f"\n\n#endif // {macro_name}_H\n")

    print(f"[Success] Generated {output_file} with {len(xmacro_entries)} entries")