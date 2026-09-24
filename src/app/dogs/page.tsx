import type { Metadata } from "next";
import BreedFilterGrid from "../components/BreedFilterGrid";
import { DOG_BREEDS } from "@/lib/breeds";
import { SITE } from "@/lib/site";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = {
  title: { absolute: `강아지 품종 찾기 · 견종 탐색 | ${SITE.brand}` },
  description: "크기·활동량·털 관리·생활환경으로 강아지 품종을 찾아 보세요. 산책하는펫샵 견종 가이드.",
};

export default async function DogsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  return (
    <div className="walk-container walk-section">
      <p className="walk-kicker">강아지</p>
      <h1 className="walk-title">강아지 품종 찾기</h1>
      <p className="walk-lead">실제 품종 데이터에 근거한 필터로 탐색할 수 있습니다.</p>
      <BreedFilterGrid breeds={DOG_BREEDS} kind="dog" initialQ={q || ""} />
    </div>
  );
}
