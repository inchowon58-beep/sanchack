import Link from "next/link";
import type { Metadata } from "next";
import { KOREA_REGIONS, SIDO_SHORT_NAMES } from "@/lib/korea-regions";
import { DOG_BREEDS } from "@/lib/breeds";
import { breedPath } from "@/lib/breed-paths";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `지역별 분양·입양 안내 | ${SITE.brand}` },
  description: "서울·경기·인천 등 시·도·시·군·구별 품종 안내로 이동합니다.",
};

export default function RegionsPage() {
  const topBreeds = DOG_BREEDS.slice(0, 6);
  return (
    <div className="walk-container walk-section">
      <p className="walk-kicker">지역</p>
      <h1 className="walk-title">지역별 안내</h1>
      <div className="walk-region-pills" style={{ margin: "1rem 0 2rem" }}>
        {SIDO_SHORT_NAMES.map((s) => (
          <Link key={s} href={`/regions/${encodeURIComponent(s)}`}>
            {s}
          </Link>
        ))}
      </div>
      <h2 className="walk-title" style={{ fontSize: "1.35rem" }}>
        인기 견종 × 지역
      </h2>
      <div className="breed-grid" style={{ marginTop: "1rem" }}>
        {KOREA_REGIONS.slice(0, 12).flatMap((r) =>
          topBreeds.slice(0, 2).map((b) => (
            <Link
              key={`${b.slug}-${r.sigungu}`}
              href={breedPath(b.slug, r.sido, r.sigungu)}
              className="walk-tile"
            >
              <strong>
                {r.sigungu} {b.name}
              </strong>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
