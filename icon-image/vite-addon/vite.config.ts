import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

/* =========================
   Config (对齐 Python)
========================= */

const IMAGE_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".gif",
  ".avif",
  ".ico",
]);

/* =========================
   Utils (严格对齐 Python)
========================= */

function toSnakeUpper(text: string): string {
  // 非字母数字 -> _
  text = text.replace(/[^A-Za-z0-9]+/g, "_");

  // camelCase -> snake_case
  text = text.replace(/([a-z0-9])([A-Z])/g, "$1_$2");

  text = text.toUpperCase();
  text = text.replace(/_+/g, "_");
  text = text.replace(/^_|_$/g, "");

  // 常量不能以数字开头
  if (/^\d/.test(text)) {
    text = "_" + text;
  }

  return text;
}

function normalizeName(filename: string): string {
  const ext = path.extname(filename);
  const name = filename.slice(0, -ext.length);
  const extClean = ext.replace(".", "");
  return toSnakeUpper(`${name}_${extClean}`);
}

/* =========================
   Plugin
========================= */

function generatePublicPathsPlugin(): Plugin {
  return {
    name: "generate-public-paths",
    apply: "build",

    buildStart() {
      const root = process.cwd();
      const publicDir = path.resolve(root, "public");
      const outputFile = path.resolve(root, "publicPaths.ts");

      if (!fs.existsSync(publicDir)) {
        console.warn("⚠ public directory not found");
        return;
      }

      // ✅ 删除旧文件（你要求的）
      if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);
        console.log("🗑 removed old publicPaths.ts");
      }

      const result = new Map<string, string>();

      function walk(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const e of entries) {
          const fullPath = path.join(dir, e.name);

          if (e.isDirectory()) {
            walk(fullPath);
            continue;
          }

          const ext = path.extname(e.name).toLowerCase();
          if (!IMAGE_EXT.has(ext)) continue;

          let key = normalizeName(e.name);

          // 相对 public 的路径
          const relDir = path.relative(publicDir, path.dirname(fullPath));
          let url: string;

          // ⚠ 对齐 Python：根目录用 ./xxx
          // if (!relDir || relDir === ".") {
          //   url = `./${e.name}`;
          // } else {
          //   url = "/" + path.join(relDir, e.name).replace(/\\/g, "/");
          // }
          url = "/" + path.join(relDir, e.name).replace(/\\/g, "/");


          // 重名处理
          const originalKey = key;
          let counter = 1;
          while (result.has(key)) {
            key = `${originalKey}_${counter}`;
            counter++;
          }

          result.set(key, url);
        }
      }

      walk(publicDir);

      /* =========================
         Generate TS
      ========================= */

      const lines: string[] = [];
      lines.push("/* AUTO GENERATED FROM public DIRECTORY. DO NOT EDIT MANUALLY */\n");

      for (const [k, v] of result) {
        lines.push(`export const ${k} = "${v}";`);
      }

      // ✅ 额外数组（你要求）
      lines.push("\nexport const PUBLIC_IMAGES = [");
      for (const key of result.keys()) {
        lines.push(`  ${key},`);
      }
      lines.push("];");

      fs.writeFileSync(outputFile, lines.join("\n"), "utf-8");

      console.log(`✔ publicPaths.ts generated (${result.size} images)`);
    },
  };
}

/* =========================
   Vite Config
========================= */

export default defineConfig({
  plugins: [
    react(),
    generatePublicPathsPlugin(),
  ],
});