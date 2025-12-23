import xmltodict
from pathlib import Path

# ===================== 配置 =====================
INPUT_XML = "strings.xml"  # 输入 XML 文件
OUTPUT_TS = "../DcsGuiFront/react/src/constants/record-table.ts"  # 输出 TS 文件（与 tools 同层级）
LANG_COUNT = 5  # 固定 5 种语言
# ================================================

def parse_xml(xml_path: str):
    with open(xml_path, "r", encoding="utf-8") as f:
        data = xmltodict.parse(f.read())
    return data

def extract_records(data):
    """提取 id -> [lang0, lang1, lang2, lang3, lang4]"""
    root = data.get("root", {})
    sections = root.get("Section", [])
    if isinstance(sections, dict):
        sections = [sections]

    records = {}

    for section in sections:
        string_defs = section.get("StringDef", [])
        if isinstance(string_defs, dict):
            string_defs = [string_defs]

        for s in string_defs:
            string_id = s.get("id")
            if not string_id:
                continue

            lang_map = [""] * LANG_COUNT
            string_block = s.get("String", {})
            langs = string_block.get("lang", [])
            if isinstance(langs, dict):
                langs = [langs]

            for t in langs:
                idx = int(t["@langId"])
                if 0 <= idx < LANG_COUNT:
                    lang_map[idx] = t.get("#text", "").strip()

            records[string_id] = lang_map

    return records

def generate_ts_class(records, output_path=OUTPUT_TS):
    lines = []
    lines.append("// Auto-generated from XML. DO NOT EDIT\n\n")
    lines.append("export type LangIndex = 0 | 1 | 2 | 3 | 4;\n\n")
    lines.append("type RecordData = {\n")
    for key, values in records.items():
        arr = ", ".join([f'"{v}"' for v in values])
        lines.append(f'  readonly "{key}": readonly [{arr}];\n')
    lines.append("};\n\n")
    lines.append("export class RecordTable {\n")
    lines.append("  private static readonly data: RecordData = {\n")
    for key, values in records.items():
        arr = ", ".join([f'"{v}"' for v in values])
        lines.append(f'    "{key}": [{arr}] as const,\n')
    lines.append("  };\n\n")
    lines.append("  static get<ID extends keyof RecordData>(id: ID): RecordData[ID] {\n")
    lines.append("    return this.data[id];\n")
    lines.append("  }\n")
    lines.append("}\n")

    Path(output_path).write_text("".join(lines), encoding="utf-8")
    print(f"Generated -> {output_path}")

if __name__ == "__main__":
    xml_data = parse_xml(INPUT_XML)
    records = extract_records(xml_data)
    generate_ts_class(records)