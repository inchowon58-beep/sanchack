/**
 * Gemini로 산책하는펫샵 전용 품종 원본 콘텐츠 생성 (기존 사이트 문장 전달 금지)
 * GEMINI_API_KEY 필요
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const envLocal = path.join(ROOT, ".env.local");
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY가 없습니다. .env.local에 설정하거나 seed 스크립트를 사용하세요.");
  process.exit(1);
}

const { GoogleGenAI } = await import("@google/genai");
const ai = new GoogleGenAI({ apiKey });
const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.5-flash-lite",
].filter(Boolean);

async function generateWithModel(model, prompt) {
  const res = await ai.models.generateContent({ model, contents: prompt });
  const raw = res.text || "";
  const json = raw.match(/\{[\s\S]*\}/);
  if (!json) throw new Error("JSON parse fail");
  return JSON.parse(json[0]);
}

const text = fs.readFileSync(path.join(ROOT, "src/lib/breeds.ts"), "utf8");
const a = text.indexOf("const ROWS: Row[] = [");
const b = text.indexOf("];", a);
const rows = eval(text.slice(a + "const ROWS: Row[] = ".length, b + 1));

const donePath = path.join(__dirname, ".sanchack-encyclopedia-done.json");
const done = fs.existsSync(donePath) ? JSON.parse(fs.readFileSync(donePath, "utf8")) : {};

async function generate(row) {
  const [name, , kind, tag, size, coat, temperament, homeNeed] = row;
  const pet = kind === "cat" ? "고양이" : kind === "shelter" ? "보호·입양" : "강아지";
  const prompt = `당신은 반려동물 매거진 "산책하는펫샵"의 에디터입니다.
품종: ${name} (${pet})
태그: ${tag}
체구: ${size}
털/외모: ${coat}
성격 경향: ${temperament}
생활 요구: ${homeNeed}

규칙:
- 설명형·자연스러운 한국어
- 광고문구·과장 금지
- 동일 SEO 키워드 반복 금지
- 사실을 모르면 단정하지 말 것
- 지역 특성 임의 생성 금지
- 다른 사이트 문장을 참고하거나 rewrite하지 말 것

JSON만 출력:
{
  "intro": "2~3문장",
  "personality": "2~3문장",
  "living": "2~3문장",
  "activity": "2문장",
  "grooming": "2문장",
  "health": "2문장",
  "firstOwner": "2문장",
  "checklist": ["5개 항목"],
  "faq": [{"q":"","a":""}, {"q":"","a":""}, {"q":"","a":""}],
  "headingVariants": {
    "story": "H2 제목 1개",
    "beforeLiving": "H2 제목 1개",
    "lifestyle": "H2 제목 1개",
    "health": "H2 제목 1개"
  }
}`;

  let lastErr;
  for (const model of MODELS) {
    try {
      return await generateWithModel(model, prompt);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("JSON parse fail: " + name);
}

function sanitizeEntry(entry) {
  return {
    intro: String(entry.intro || "").trim(),
    personality: String(entry.personality || "").trim(),
    living: String(entry.living || "").trim(),
    activity: String(entry.activity || "").trim(),
    grooming: String(entry.grooming || "").trim(),
    health: String(entry.health || "").trim(),
    firstOwner: String(entry.firstOwner || "").trim(),
    checklist: (entry.checklist || []).map((s) => String(s).trim()).filter(Boolean).slice(0, 8),
    faq: (entry.faq || [])
      .map((f) => ({ q: String(f.q || "").trim(), a: String(f.a || "").trim() }))
      .filter((f) => f.q && f.a)
      .slice(0, 5),
    headingVariants: {
      story: String(entry.headingVariants?.story || "").trim(),
      beforeLiving: String(entry.headingVariants?.beforeLiving || "").trim(),
      lifestyle: String(entry.headingVariants?.lifestyle || "").trim(),
      health: String(entry.headingVariants?.health || "").trim(),
    },
  };
}

let seed = {};
const seedPath = path.join(ROOT, "src/lib/sanchack-encyclopedia-data.ts");
if (fs.existsSync(seedPath)) {
  try {
    const seedText = fs.readFileSync(seedPath, "utf8");
    const a = seedText.indexOf("{");
    const b = seedText.lastIndexOf("};");
    seed = JSON.parse(seedText.slice(a, b + 1));
  } catch {
    /* ignore */
  }
}

const data = { ...seed };
for (const row of rows) {
  const name = row[0];
  if (done[name]) {
    data[name] = done[name];
    continue;
  }
  console.log("generating", name);
  try {
    const entry = sanitizeEntry(await generate(row));
    data[name] = entry;
    done[name] = entry;
    fs.writeFileSync(donePath, JSON.stringify(done, null, 2));
    fs.writeFileSync(
      seedPath,
      `/** Gemini 생성 — generate-sanchack-encyclopedia.mjs */\nimport type { SanchackEncyclopedia } from "./sanchack-encyclopedia";\n\nexport const ENCYCLOPEDIA_DATA: Record<string, SanchackEncyclopedia> = ${JSON.stringify(data, null, 2)};\n`,
      "utf8"
    );
    await new Promise((r) => setTimeout(r, 1500));
  } catch (e) {
    console.error("fail", name, e.message?.slice?.(0, 120) || e.message);
  }
}

const out = `/** Gemini 생성 — generate-sanchack-encyclopedia.mjs */\nimport type { SanchackEncyclopedia } from "./sanchack-encyclopedia";\n\nexport const ENCYCLOPEDIA_DATA: Record<string, SanchackEncyclopedia> = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(path.join(ROOT, "src/lib/sanchack-encyclopedia-data.ts"), out, "utf8");
console.log("done", Object.keys(data).length);
