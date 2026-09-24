import type { Metadata } from "next";
import BreedFilterGrid from "../components/BreedFilterGrid";
import { CAT_BREEDS } from "@/lib/breeds";
import { SITE } from "@/lib/site";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = {
  title: { absolute: `고양이 품종 찾기 · 묘종 탐색 | ${SITE.brand}` },
  description: "크기·활동량·털 관리·생활환경으로 고양이 품종을 찾아 보세요.",
};

export default async function CatsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  return (
    <div className="walk-container walk-section">
      <p className="walk-kicker">고양이</p>
      <h1 className="walk-title">고양이 품종 찾기</h1>
      <BreedFilterGrid breeds={CAT_BREEDS} kind="cat" initialQ={q || ""} />
    </div>
  );
}
