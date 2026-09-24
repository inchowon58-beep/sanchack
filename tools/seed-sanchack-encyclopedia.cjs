/**
 * 산책하는펫샵 전용 품종 원본 콘텐츠 (Gemini 없이 1차 시드 — 독립 editorial voice)
 * tools/generate-sanchack-encyclopedia.mjs 로 Gemini 교체 가능
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const text = fs.readFileSync(path.join(ROOT, "src/lib/breeds.ts"), "utf8");
const a = text.indexOf("const ROWS: Row[] = [");
const b = text.indexOf("];", a);
const rows = eval(text.slice(a + "const ROWS: Row[] = ".length, b + 1));

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

const storyOpeners = [
  "산책길에서 자주 마주치는",
  "처음 만나면 기억에 남는",
  "가족과 함께하기 좋다고 알려진",
  "보호자와의 교감을 중요하게 여기는",
  "활동량과 성격을 함께 살펴봐야 하는",
];

const livingHints = [
  "실내 동선과 쉴 공간을 먼저 정리해 두면 적응이 수월합니다.",
  "산책·놀이 시간을 하루 루틴에 넣을 수 있는지 확인해 보세요.",
  "털 관리와 미용 주기를 가족 일정과 맞출 수 있는지 점검해 주세요.",
  "소음·층간·반려동물 규정 등 주거 환경을 미리 확인하는 것이 좋습니다.",
];

function buildEntry(row) {
  const [name, folder, kind, tag, size, coat, temperament, homeNeed] = row;
  const pet = kind === "cat" ? "고양이" : kind === "shelter" ? (name.includes("고양") ? "고양이" : "강아지") : "강아지";
  const h = hash(name);
  const opener = pick(storyOpeners, h);
  const livingHint = pick(livingHints, h >> 3);

  return {
    intro: `${opener} ${name}입니다. ${tag}으로 알려져 있으며, ${temperament}`,
    personality: `${name}와 함께 지내려면 성격을 서두르지 않고 관찰하는 시간이 필요합니다. ${temperament} 경향이 있다고 알려져 있지만, 유년기 경험·건강·환경에 따라 달라질 수 있습니다.`,
    living: `${homeNeed} ${livingHint}`,
    activity:
      kind === "cat"
        ? `${size} 체구의 ${name}는 놀이·스크래처·휴식 공간의 균형이 중요합니다.`
        : `${size}견에 맞는 산책 빈도와 놀이 강도를 정해 두면 스트레스를 줄이는 데 도움이 됩니다.`,
    grooming: `${coat} 특성상 빗질·미용·피부 확인 루틴을 정기적으로 갖추는 것이 좋습니다.`,
    health:
      "분양·입양 전 건강검진 기록, 예방 접종, 구충 여부를 확인하세요. 이상 징후가 보이면 수의사 상담을 받는 것이 안전합니다.",
    firstOwner:
      kind === "shelter"
        ? `${name} 입양은 준비 기간과 적응 계획이 특히 중요합니다. 섣부른 결정보다 상담과 방문을 통해 맞는지 확인해 보세요.`
        : `처음 ${pet}를 키우신다면 ${name}의 ${tag} 특성과 ${homeNeed}를 함께 검토해 보세요.`,
    checklist: [
      "생활 공간·동선·안전 점검",
      "건강·예방 접종 기록 확인",
      "사료·용품·병원 일정 준비",
      "가족 구성원·다른 반려동물과의 적합성 논의",
      "입양 후 2~4주 적응 계획 세우기",
    ],
    faq: [
      {
        q: `${name}는 혼자 있는 시간을 잘 견딜까요?`,
        a: "개체차가 큽니다. 남는 시간, 분리 훈련, 환경 자극 정도를 함께 고려해 보세요.",
      },
      {
        q: "키우기 어려운 편인가요?",
        a: `${tag} — ${homeNeed} 난이도는 가정 환경과 경험에 따라 달라집니다.`,
      },
      {
        q: "아이·노약자와 함께해도 될까요?",
        a: "성격·활동량·크기를 만나보고 판단하는 것이 좋습니다. 무리한 접근은 피해 주세요.",
      },
    ],
    headingVariants: {
      story: pick(
        [`${name}는 어떤 ${pet}일까요?`, `${name}, 처음 만나는 분들을 위해`, `${name} 이야기`],
        h
      ),
      beforeLiving: pick(
        ["함께 살기 전에 알아둘 점", "입양 전에 짚어볼 것", "새 가족을 맞이하기 전"],
        h >> 2
      ),
      lifestyle: pick(
        ["이런 생활과 잘 맞을 수 있어요", "우리 집과 맞는지 살펴보기", "생활 리듬에 맞춰 보기"],
        h >> 4
      ),
      health: pick(["건강·관리 참고사항", "평소 챙길 건강 포인트", "돌봄·건강 체크"], h >> 5),
    },
  };
}

const data = {};
for (const row of rows) {
  const name = row[0];
  data[name] = buildEntry(row);
}

const out = `/** 자동 생성 — seed-sanchack-encyclopedia.mjs */\nimport type { SanchackEncyclopedia } from "./sanchack-encyclopedia";\n\nexport const ENCYCLOPEDIA_DATA: Record<string, SanchackEncyclopedia> = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(path.join(ROOT, "src/lib/sanchack-encyclopedia-data.ts"), out, "utf8");
console.log("seeded", Object.keys(data).length, "breeds");
