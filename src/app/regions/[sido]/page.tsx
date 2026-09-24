import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BREEDS } from "@/lib/breeds";
import { breedPath } from "@/lib/breed-paths";
import { getSigungus, parseSidoName, SIDO_SHORT_NAMES } from "@/lib/korea-regions";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ sido: string }> };

export function generateStaticParams() {
  return SIDO_SHORT_NAMES.map((s) => ({ sido: s }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sido: raw } = await params;
  const sido = parseSidoName(raw);
  if (!sido) return { title: "페이지 없음" };
  return {
    title: { absolute: `${raw} 지역 분양·입양 허브 | ${SITE.brand}` },
    description: `${raw} 시·군·구별 품종 안내 페이지로 이동합니다.`,
  };
}

export default async function RegionSidoPage({ params }: Props) {
  const { sido: raw } = await params;
  const sido = parseSidoName(raw);
  if (!sido) notFound();
  const gus = getSigungus(sido);
  const breeds = BREEDS.filter((b) => b.kind !== "shelter").slice(0, 8);

  return (
    <div className="walk-container walk-section">
      <p className="walk-kicker">지역</p>
      <h1 className="walk-title">{raw} 지역 안내</h1>
      <h2 style={{ fontSize: "1.2rem" }}>시·군·구</h2>
      <div className="walk-region-pills" style={{ margin: "1rem 0 2rem" }}>
        {gus.map((g) => (
          <span key={g.sigungu}>{g.sigungu}</span>
        ))}
      </div>
      <h2 style={{ fontSize: "1.2rem" }}>품종별 {raw} 안내</h2>
      <div className="breed-grid" style={{ marginTop: "1rem" }}>
        {gus.slice(0, 6).flatMap((g) =>
          breeds.slice(0, 4).map((b) => (
            <Link key={`${b.slug}-${g.sigungu}`} href={breedPath(b.slug, sido, g.sigungu)} className="walk-tile">
              <strong>
                {g.sigungu} {b.name}
              </strong>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
