import { CAT_BREEDS, DOG_BREEDS, SHELTER_BREEDS, type Breed } from "./breeds";
import { breedCover } from "./breed-images";
import { breedPath } from "./breed-paths";
import { POPULAR_REGION_KEYS, SIDO_SHORT_NAMES, getSigunguByKey } from "./korea-regions";

export const FEATURED_SLUGS = [
  "말티즈",
  "포메라니안",
  "웰시코기",
  "골든리트리버",
  "랙돌",
  "메인쿤",
  "토이푸들",
  "치와와",
] as const;

export function featuredBreeds(all: Breed[]): Breed[] {
  const map = new Map(all.map((b) => [b.slug, b]));
  return FEATURED_SLUGS.map((s) => map.get(s)).filter((b): b is Breed => Boolean(b));
}

export const QUICK_NAV = [
  { label: "강아지", href: "/dogs", desc: "견종 탐색" },
  { label: "고양이", href: "/cats", desc: "묘종 탐색" },
  { label: "보호·입양", href: "/adoption", desc: "보호소 안내" },
  { label: "지역별 찾기", href: "/regions", desc: "시·도·구별" },
] as const;

export const GUIDE_TOPICS = [
  { title: "크기", body: "초소형·소형·중형·대형에 맞는 공간과 산책량을 비교해 보세요." },
  { title: "활동량", body: "낮음·보통·높음 — 하루 루틴에 맞는 에너지 수준을 고릅니다." },
  { title: "털 관리", body: "빗질·미용 부담을 미리 확인하면 장기 돌봄이 수월합니다." },
  { title: "생활환경", body: "실내·실내+산책·넓은 공간 등 주거 형태와 맞춰 보세요." },
  { title: "성격", body: "품종 경향과 개체차를 함께 살펴보는 것이 중요합니다." },
] as const;

export const FIRST_FAMILY = [
  { title: "입양 전 준비", items: ["가족 합의", "주거·규정 확인", "비용·시간 계획"] },
  { title: "건강 확인", items: ["검진 기록", "예방 접종", "구충·치아"] },
  { title: "생활공간", items: ["쉴 곳", "배변·화장실", "안전 동선"] },
  { title: "초기 적응", items: ["2~4주 루틴", "분리 훈련", "병원·미용 예약"] },
  { title: "기본 용품", items: ["사료·급식기", "하네스·리드", "쿠션·장난감"] },
] as const;

export const REGION_HUBS = SIDO_SHORT_NAMES.map((s) => ({
  label: s,
  href: `/regions/${encodeURIComponent(s)}`,
}));

export function breedCard(b: Breed) {
  return {
    name: b.name,
    tag: b.tag,
    href: breedPath(b.slug),
    cover: breedCover(b.folder),
    kind: b.kind,
  };
}

export const DOG_CARDS = DOG_BREEDS.map(breedCard);
export const CAT_CARDS = CAT_BREEDS.map(breedCard);
export const SHELTER_CARDS = SHELTER_BREEDS.map(breedCard);

export const POPULAR_REGION_LINKS = POPULAR_REGION_KEYS.map((key) => {
  const r = getSigunguByKey(key);
  return r
    ? { label: `${key.replace("_", " ")}`, href: `/regions/${encodeURIComponent(key.replace("_", "/"))}` }
    : null;
}).filter(Boolean) as { label: string; href: string }[];
