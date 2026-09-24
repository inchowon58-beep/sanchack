import type { Breed } from "./breeds";
import { DOG_BREEDS, CAT_BREEDS } from "./breeds";

export type SizeFilter = "초소형" | "소형" | "중형" | "대형" | "다양";
export type ActivityFilter = "낮음" | "보통" | "높음";
export type GroomFilter = "적음" | "보통" | "많음";
export type EnvFilter = "실내" | "실내+산책" | "넓은공간";

export type BreedTraits = {
  size: SizeFilter;
  activity: ActivityFilter;
  grooming: GroomFilter;
  environment: EnvFilter;
};

function inferActivity(b: Breed): ActivityFilter {
  const t = `${b.homeNeed} ${b.temperament} ${b.tag}`;
  if (/긴 산책|충분한 산책|활동|에너지|운동|놀이/.test(t)) return "높음";
  if (/짧은 산책|실내|무릎|소형|초소형/.test(t)) return "낮음";
  return "보통";
}

function inferGroom(b: Breed): GroomFilter {
  const c = b.coat;
  if (/긴|풍성|컬|장모|삼중|더블/.test(c)) return "많음";
  if (/짧|단모|매끈/.test(c)) return "적음";
  return "보통";
}

function inferEnv(b: Breed): EnvFilter {
  const t = `${b.homeNeed} ${b.size}`;
  if (/대형|넓|마당|시원|산책/.test(t) && /대형/.test(b.size)) return "넓은공간";
  if (/산책|놀이|활동/.test(t)) return "실내+산책";
  return "실내";
}

function inferSize(b: Breed): SizeFilter {
  const s = b.size.trim();
  if (["초소형", "소형", "중형", "대형", "다양"].includes(s)) return s as SizeFilter;
  return "다양";
}

export function breedTraits(b: Breed): BreedTraits {
  return {
    size: inferSize(b),
    activity: inferActivity(b),
    grooming: inferGroom(b),
    environment: inferEnv(b),
  };
}

export type FilterState = {
  kind?: "dog" | "cat";
  size?: SizeFilter;
  activity?: ActivityFilter;
  grooming?: GroomFilter;
  environment?: EnvFilter;
  q?: string;
};

export function filterBreeds(breeds: Breed[], f: FilterState): Breed[] {
  return breeds.filter((b) => {
    if (f.kind === "dog" && b.kind !== "dog") return false;
    if (f.kind === "cat" && b.kind !== "cat") return false;
    const t = breedTraits(b);
    if (f.size && t.size !== f.size && t.size !== "다양") return false;
    if (f.activity && t.activity !== f.activity) return false;
    if (f.grooming && t.grooming !== f.grooming) return false;
    if (f.environment && t.environment !== f.environment) return false;
    if (f.q) {
      const q = f.q.trim().toLowerCase();
      if (!b.name.toLowerCase().includes(q) && !b.tag.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export const FILTER_BREEDS = [...DOG_BREEDS, ...CAT_BREEDS];
