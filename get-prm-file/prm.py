import re
import json

def parse_prm_file(path):
    stack = []
    result = []
    i = 0

    with open(path, "r", encoding="utf-8") as f:
        for raw_line in f:
            i = i + 1
            row = raw_line.strip()
            print(row)
            print(stack)

            if not row:
                continue

            # 新层
            if row.startswith("L"):
                stack.append({"row_index": i, "row": row, "data": {}, "id_value_pair": False})
                continue

            # 层开始
            if row == "[":
                continue

            # 键值
            if ":" in row:
                parts = row.split(":", 1)
                key = parts[0]
                value = parts[1]
                
                if stack:
                    stack[-1]["data"][key] = value

            # 层结束
            if row == "]":
                top = stack.pop()

                # ✅ 没有子层 → 是最终层
                if top["data"] and not top["id_value_pair"]:
                    id_key = None
                    id_value = None
                    values = {}

                    for key, value in top["data"].items():
                        if "U" in key:      # 把含U的key当作id字段
                            id_key = key
                            id_value = value
                        else:             # 其他key都当作值
                            values[key] = value

                    if id_value is not None:
                        result.append({
                            "id": id_value,
                            "value": values
                        })

                # 标记上层有子层
                if stack:
                    stack[-1]["id_value_pair"] = True
                continue
                
    return result


# ===== 测试 =====
if __name__ == "__main__":
    prm_text = """\
L1
[
  L2
  [
    4U1: 1
    L3
    [
      4U1: 2
      F5: 0.2, 0.3, 0.4, 0.5, 0.6
    ]
    L4
    [
      4U1: 55
      F5: 0.1, 0.1, 0.1, 0.1, 0.1
    ]
  ]
]"""

    with open("example.prm", "w", encoding="utf-8") as f:
        f.write(prm_text)

    data = parse_prm_file("example.prm")
    print(json.dumps(data, indent=2, ensure_ascii=False))