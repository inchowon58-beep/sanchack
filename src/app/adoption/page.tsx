import Link from "next/link";
import type { Metadata } from "next";
import { SHELTER_BREEDS } from "@/lib/breeds";
import { breedPath } from "@/lib/breed-paths";
import { breedCover } from "@/lib/breed-images";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `보호·입양 안내 | ${SITE.brand}` },
  description: "강아지·고양이 보호소 입양 정보. 준비 사항과 지역별 안내를 확인하세요.",
};

export default function AdoptionPage() {
  return (
    <div className="walk-container walk-section">
      <p className="walk-kicker">보호·입양</p>
      <h1 className="walk-title">보호·입양 정보</h1>
      <p className="walk-lead">상품이 아닌 생명을 맞이하는 과정입니다. 충분한 시간을 가지고 알아보세요.</p>
      <div className="walk-adopt-band" style={{ marginTop: "1.5rem" }}>
        {SHELTER_BREEDS.map((b) => (
          <Link href={breedPath(b.slug)} key={b.slug} className="walk-adopt-card">
            <img
              src={breedCover(b.folder)}
              alt={`${b.name} 안내`}
              width={480}
              height={280}
              loading="lazy"
              style={{ borderRadius: 12, marginBottom: "0.75rem" }}
            />
            <strong>{b.name}</strong>
            <p>{b.tag}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
