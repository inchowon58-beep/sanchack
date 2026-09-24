const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const donePath = path.join(__dirname, ".sanchack-encyclopedia-done.json");
const data = JSON.parse(fs.readFileSync(donePath, "utf8"));

for (const key of Object.keys(data)) {
  const e = data[key];
  e.faq = (e.faq || [])
    .map((f) => ({ q: String(f.q || "").trim(), a: String(f.a || "").trim() }))
    .filter((f) => f.q && f.a);
}

const out = `/** Gemini 생성 — generate-sanchack-encyclopedia.mjs */\nimport type { SanchackEncyclopedia } from "./sanchack-encyclopedia";\n\nexport const ENCYCLOPEDIA_DATA: Record<string, SanchackEncyclopedia> = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(path.join(ROOT, "src/lib/sanchack-encyclopedia-data.ts"), out, "utf8");
console.log("sanitized", Object.keys(data).length);
