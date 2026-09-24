import type { Breed } from "./breeds";
import { sizeClass } from "./breeds";
import { breedPath } from "./breed-paths";
import { eunNeun, eulReul, iraRa } from "./korean";
import {
  getDongs,
  getSigungus,
  KOREA_REGIONS,
  neighborSigungus,
  SIDOS,
} from "./korea-regions";
import {
  bizSourceLine,
  dongBizCounts,
  getBizBundle,
  sidoBizCounts,
  sigunguBizCounts,
  sliceBiz,
  type BizItem,
} from "./local-pet-biz";

export type LocalStat = { label: string; value: string; note: string };

export type LocalTableRow = { cells: string[]; href?: string };

export type LocalTable = {
  caption: string;
  headers: string[];
  rows: LocalTableRow[];
  source: string;
};

export type LocalRegionFacts = {
  level: "national" | "sido" | "sigungu" | "dong";
  snapshotH2: string;
  snapshotSource: string;
  stats: LocalStat[];
  tables: LocalTable[];
  paragraphs: string[];
};

const TOTAL_SIDOS = SIDOS.length;
const TOTAL_SIGUNGU = KOREA_REGIONS.length;
const TOTAL_DONGS = KOREA_REGIONS.reduce((n, r) => n + r.dongs.length, 0);

const REGION_SOURCE =
  "행정구역 범위는 산책하는펫샵가 분양 안내를 위해 정리한 시·도·시군구·동 목록입니다.";

function bizTable(caption: string, items: BizItem[], fallback: boolean): LocalTable | null {
  if (!items.length) return null;
  const { rows, extra } = sliceBiz(items);
  const note = fallback ? "이 동에 공개된 곳이 없어 같은 시·군·구를 보여 줍니다. " : "";
  const hasYear = rows.some((it) => it.year);
  return {
    caption: extra ? `${caption} (상위 ${rows.length}곳 · 외 ${extra}곳)` : caption,
    headers: hasYear ? ["상호", "동·읍·면", "등록연도"] : ["상호", "동·읍·면"],
    rows: rows.map((it) => ({
      cells: hasYear ? [it.name, it.dong || "—", it.year ? `${it.year}년` : "—"] : [it.name, it.dong || "—"],
    })),
    source: note + bizSourceLine(),
  };
}

function bizShopTables(place: string, sido?: string, sigungu?: string, dong?: string): LocalTable[] {
  const biz = getBizBundle(sido, sigungu, dong);
  return [
    bizTable(`${place} 동물판매업`, biz.sales, biz.salesFallback),
    bizTable(`${place} 동물생산업`, biz.breeding, biz.breedingFallback),
    bizTable(`${place} 동물병원`, biz.hospital, biz.hospitalFallback),
    bizTable(`${place} 동물미용업`, biz.groom, biz.groomFallback),
    bizTable(`${place} 위탁관리(호텔·유치원)`, biz.board, biz.boardFallback),
    bizTable(`${place} 동물약국`, biz.pharmacy, biz.pharmacyFallback),
  ].filter((t): t is LocalTable => Boolean(t));
}

function snapshotStats(sido?: string, sigungu?: string, dong?: string): LocalStat[] {
  const biz = getBizBundle(sido, sigungu, dong);
  if (dong && sigungu) {
    return [
      { label: "분양 등록업체", value: `${biz.salesParent}곳`, note: `이 동 ${biz.salesCount}곳 · ${sigungu} 영업 중` },
      { label: "생산 등록업체", value: `${biz.breedingParent}곳`, note: `이 동 ${biz.breedingCount}곳 · ${sigungu} 영업 중` },
      { label: "병원 수", value: `${biz.hospitalParent}곳`, note: `이 동 ${biz.hospitalCount}곳 · ${sigungu}` },
    ];
  }
  return [
    { label: "분양 등록업체", value: `${biz.salesCount}곳`, note: "영업 중" },
    { label: "생산 등록업체", value: `${biz.breedingCount}곳`, note: "영업 중" },
    { label: "병원 수", value: `${biz.hospitalCount}곳`, note: "공개 목록" },
  ];
}

function snapshotInsight(
  place: string,
  name: string,
  sido?: string,
  sigungu?: string,
  dong?: string
): string {
  const biz = getBizBundle(sido, sigungu, dong);
  if (dong && sigungu) {
    if (biz.breedingCount === 0) {
      return `${dong}에는 영업 중인 동물생산업이 확인되지 않습니다. 이 동네에서 만나는 ${name}은 ${sigungu}의 다른 읍·면이나 인근 지역에서 오는 경우가 많습니다.`;
    }
    return `${dong}에는 동물생산업 ${biz.breedingCount}곳, 동물판매업 ${biz.salesCount}곳이 영업 중입니다. ${name} 분양 전에 생산·판매 등록과 병원 거리를 함께 보시면 됩니다.`;
  }
  if (sigungu && sido) {
    return `${sigungu} 공개 목록 기준 동물판매업 ${biz.salesCount}곳, 동물생산업 ${biz.breedingCount}곳, 동물병원 ${biz.hospitalCount}곳입니다.`;
  }
  if (sido) {
    return `${sido} 공개 목록 기준 동물판매업 ${biz.salesCount}곳, 동물생산업 ${biz.breedingCount}곳, 동물병원 ${biz.hospitalCount}곳입니다.`;
  }
  return `전국 공개 목록 기준 동물판매업 ${biz.salesCount}곳, 동물생산업 ${biz.breedingCount}곳, 동물병원 ${biz.hospitalCount}곳입니다. ${place}${eulReul(place)} 고르시면 숫자가 달라집니다.`;
}

function joinNames(names: string[], limit = 8): string {
  if (!names.length) return "";
  if (names.length <= limit) return names.join("·");
  return `${names.slice(0, limit).join("·")} 등 ${names.length}곳`;
}

export function buildLocalRegionFacts(
  breed: Breed,
  sido?: string,
  sigungu?: string,
  dong?: string
): LocalRegionFacts {
  const name = breed.name;
  const kw = breed.keyword;

  if (sido && sigungu && dong) {
    const dongs = getDongs(sido, sigungu);
    const nearbyGu = neighborSigungus(sido, sigungu, 6);
    const dongCounts = dongBizCounts(sido, sigungu);
    return {
      level: "dong",
      snapshotH2: `${dong}${eunNeun(dong)} 어떤 곳인가`,
      snapshotSource: bizSourceLine(),
      stats: snapshotStats(sido, sigungu, dong),
      tables: [
        ...bizShopTables(dong, sido, sigungu, dong),
        {
          caption: `${sigungu} 안에서 ${dong} 위치`,
          headers: ["동·읍·면", "판매업", "생산업", "병원"],
          rows: dongCounts.map((r) => ({
            cells: [
              r.dong === dong ? `${r.dong} (현재)` : r.dong,
              `${r.sales}곳`,
              `${r.breeding}곳`,
              `${r.hospital}곳`,
            ],
            href: r.dong === dong ? undefined : breedPath(breed.slug, sido, sigungu, r.dong),
          })),
          source: bizSourceLine(),
        },
        {
          caption: `${sigungu} ${name} 분양 · 동·읍·면`,
          headers: ["행정구역", "소속", "안내"],
          rows: dongs.map((d) => ({
            cells: [d, `${sido} ${sigungu}`, d === dong ? "현재 페이지" : `${name} 분양`],
            href: d === dong ? undefined : breedPath(breed.slug, sido, sigungu, d),
          })),
          source: REGION_SOURCE,
        },
      ],
      paragraphs: [
        snapshotInsight(dong, name, sido, sigungu, dong),
        `${dong}${eunNeun(dong)} ${sido} ${sigungu}에 속합니다. 같은 ${sigungu}에는 ${joinNames(dongs)} ${name} 분양 안내가 이어집니다.`,
        `${name}${eunNeun(name)} ${sizeClass(breed)} 체구에 ${breed.coat}입니다. ${dong}에서 분양을 보실 때는 사진보다 산책·화장실·환기 동선이 ${breed.homeNeed.replace(/입니다\.?$/, "")}와 맞는지부터 보시면 됩니다.`,
        nearbyGu.length
          ? `${sigungu}와 이어지는 ${sido} 시·군·구는 ${joinNames(nearbyGu.map((r) => r.sigungu))}입니다. 이동 범위가 넓으면 인근 구 ${kw} 페이지를 함께 비교하세요.`
          : `${adminFallback(sido, sigungu, dong)} ${kw}는 아래 문의로 이어집니다.`,
      ],
    };
  }

  if (sido && sigungu) {
    const dongs = getDongs(sido, sigungu);
    const nearbyGu = neighborSigungus(sido, sigungu, 8);
    return {
      level: "sigungu",
      snapshotH2: `${sigungu}${eunNeun(sigungu)} 어떤 곳인가`,
      snapshotSource: bizSourceLine(),
      stats: snapshotStats(sido, sigungu),
      tables: [
        ...bizShopTables(sigungu, sido, sigungu),
        {
          caption: `${sigungu} 행정구역별 ${name} 분양`,
          headers: ["동·읍·면", "시·군·구", "안내"],
          rows: dongs.map((d) => ({
            cells: [d, sigungu, `${name} 분양`],
            href: breedPath(breed.slug, sido, sigungu, d),
          })),
          source: REGION_SOURCE,
        },
      ],
      paragraphs: [
        snapshotInsight(sigungu, name, sido, sigungu),
        `${sigungu}${eunNeun(sigungu)} ${sido}의 시·군·구입니다. 이 페이지에서는 ${joinNames(dongs)} ${dongs.length}곳의 ${name} 분양을 동 단위로 안내합니다.`,
        `${name}은 ${breed.tag}입니다. ${sigungu} 주거 형태가 아파트·주택·다가구로 갈리면 산책 동선과 털 관리량(${breed.coat})을 집마다 다르게 보셔야 합니다.`,
        nearbyGu.length
          ? `${sido}에서 ${sigungu} 다음으로 이어지는 시·군·구는 ${joinNames(nearbyGu.map((r) => r.sigungu))}입니다.`
          : `${sigungu} ${kw} 상담은 아래 문의로 남기시면 됩니다.`,
      ],
    };
  }

  if (sido) {
    const gus = getSigungus(sido);
    const dongCount = gus.reduce((n, r) => n + r.dongs.length, 0);
    const counts = sigunguBizCounts(sido);
    return {
      level: "sido",
      snapshotH2: `${sido}${eunNeun(sido)} 어떤 곳인가`,
      snapshotSource: bizSourceLine(),
      stats: snapshotStats(sido),
      tables: [
        {
          caption: `${sido} 시·군·구별 판매·생산·병원`,
          headers: ["시·군·구", "판매업", "생산업", "병원"],
          rows: counts.map((r) => ({
            cells: [r.sigungu, `${r.sales}곳`, `${r.breeding}곳`, `${r.hospital}곳`],
            href: breedPath(breed.slug, sido, r.sigungu),
          })),
          source: bizSourceLine(),
        },
        {
          caption: `${sido} 시·군·구별 ${name} 분양`,
          headers: ["시·군·구", "동·읍·면 수", "안내"],
          rows: gus.map((r) => ({
            cells: [r.sigungu, `${r.dongs.length}곳`, `${name} 분양`],
            href: breedPath(breed.slug, r.sido, r.sigungu),
          })),
          source: REGION_SOURCE,
        },
      ],
      paragraphs: [
        snapshotInsight(sido, name, sido),
        `${sido}${eunNeun(sido)} ${gus.length}개 시·군·구, 동·읍·면 ${dongCount}곳의 ${name} 분양 페이지로 나뉩니다. ${joinNames(gus.map((r) => r.sigungu))} 순으로 이어집니다.`,
        `${name}${eunNeun(name)} ${sizeClass(breed)}${iraRa(sizeClass(breed))} ${breed.coat} 특성이 있어 ${sido} 안에서도 도심과 외곽의 산책·미용 여건이 다릅니다. 시·군·구를 고르신 뒤 동 단위 안내를 보세요.`,
      ],
    };
  }

  const counts = sidoBizCounts();
  return {
    level: "national",
    snapshotH2: `전국은 어떤 곳인가`,
    snapshotSource: bizSourceLine(),
    stats: snapshotStats(),
    tables: [
      {
        caption: `시·도별 판매·생산·병원`,
        headers: ["시·도", "판매업", "생산업", "병원"],
        rows: counts.map((r) => ({
          cells: [r.sido, `${r.sales}곳`, `${r.breeding}곳`, `${r.hospital}곳`],
          href: breedPath(breed.slug, r.sido),
        })),
        source: bizSourceLine(),
      },
      {
        caption: `시·도별 ${name} 분양`,
        headers: ["시·도", "시·군·구 수", "안내"],
        rows: SIDOS.map((s) => ({
          cells: [s, `${getSigungus(s).length}곳`, `${name} 분양`],
          href: breedPath(breed.slug, s),
        })),
        source: REGION_SOURCE,
      },
    ],
    paragraphs: [
      snapshotInsight("전국", name),
      `전국 ${name} 분양은 ${TOTAL_SIDOS}개 시·도, ${TOTAL_SIGUNGU}개 시·군·구, 동·읍·면 ${TOTAL_DONGS}곳으로 나뉩니다. 거주 지역을 고르시면 그 동네 기준으로 집 준비와 상담이 짧아집니다.`,
      `${name}${eunNeun(name)} ${breed.tag}입니다. ${sizeClass(breed)} 체구와 ${breed.coat} 특성을 시·도별 주거 환경에 대입해 보신 뒤 시·군·구 페이지로 내려가세요.`,
    ],
  };
}

function adminFallback(sido: string, sigungu: string, dong: string): string {
  return `${sido} ${sigungu} ${dong}`;
}
