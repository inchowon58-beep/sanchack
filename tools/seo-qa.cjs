/**
 * 산책하는펫샵 SEO QA — 빌드 후 메타·콘텐츠 검사
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function parseBreeds() {
  const text = fs.readFileSync(path.join(ROOT, "src/lib/breeds.ts"), "utf8");
  const a = text.indexOf("const ROWS: Row[] = [");
  const b = text.indexOf("];", a);
  return eval(text.slice(a + "const ROWS: Row[] = ".length, b + 1)).map((r) => r[0]);
}

function loadEncyclopedia() {
  const text = fs.readFileSync(path.join(ROOT, "src/lib/sanchack-encyclopedia-data.ts"), "utf8");
  const a = text.indexOf("{");
  const b = text.lastIndexOf("};");
  return JSON.parse(text.slice(a, b + 1));
}

const breeds = parseBreeds();
const enc = loadEncyclopedia();
const titles = new Set();
const descs = new Set();
const dupTitle = [];
const dupDesc = [];
const shortBody = [];
const hashes = new Map();

for (const name of breeds) {
  const e = enc[name];
  if (!e) {
    shortBody.push({ name, issue: "missing encyclopedia" });
    continue;
  }
  const body = [e.intro, e.personality, e.living, e.activity, e.grooming, e.health].join(" ");
  if (body.length < 120) shortBody.push({ name, issue: "short body", len: body.length });
  const h = body.slice(0, 200);
  if (hashes.has(h)) hashes.get(h).push(name);
  else hashes.set(h, [name]);
}

const nearDup = [...hashes.values()].filter((a) => a.length > 1);

console.log(
  JSON.stringify(
    {
      breeds: breeds.length,
      encyclopediaEntries: Object.keys(enc).length,
      duplicateTitles: dupTitle.length,
      duplicateDescriptions: dupDesc.length,
      shortBody,
      nearDuplicateGroups: nearDup.length,
      sampleNearDup: nearDup.slice(0, 3),
    },
    null,
    2
  )
);
