import Link from "next/link";
import BreedSearchForm from "./components/BreedSearchForm";
import {
  CAT_CARDS,
  DOG_CARDS,
  FEATURED_SLUGS,
  FIRST_FAMILY,
  GUIDE_TOPICS,
  QUICK_NAV,
  REGION_HUBS,
  SHELTER_CARDS,
  featuredBreeds,
} from "@/lib/home-data";
import { BREEDS } from "@/lib/breeds";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const featured = featuredBreeds(BREEDS);
  const dogFeatured = DOG_CARDS.slice(0, 6);
  const catTop = CAT_CARDS[0];
  const catRest = CAT_CARDS.slice(1, 4);

  return (
    <>
      <section className="walk-container walk-hero">
        <div>
          <p className="walk-kicker">{SITE.brandEn}</p>
          <h1 className="walk-title">{SITE.tagline}</h1>
          <p className="walk-lead">{SITE.taglineSub}</p>
          <BreedSearchForm />
        </div>
        <div className="walk-hero-photo">
          <img
            src={SITE.ogImage}
            alt="산책하는 반려견과 보호자"
            width={560}
            height={420}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="walk-section">
        <div className="walk-container">
          <p className="walk-kicker">빠른 탐색</p>
          <div className="walk-tiles">
            {QUICK_NAV.map((item) => (
              <Link href={item.href} key={item.href} className="walk-tile">
                <strong>{item.label}</strong>
                <span>{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="walk-section" style={{ background: "var(--walk-paper)" }}>
        <div className="walk-container">
          <p className="walk-kicker">오늘 알아볼 친구</p>
          <h2 className="walk-title" style={{ fontSize: "1.75rem" }}>
            대표 품종 {featured.length}종
          </h2>
          <div className="walk-friends" style={{ marginTop: "1.25rem" }}>
            {featured.map((b) => (
              <Link href={`/${encodeURIComponent(b.slug)}`} key={b.slug} className="walk-friend-card">
                <img
                  src={`https://image.cattery.co.kr/${b.folder}/01.webp`}
                  alt={`${b.name} 사진`}
                  width={400}
                  height={300}
                  loading="lazy"
                />
                <div>
                  <strong>{b.name}</strong>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--walk-muted)" }}>{b.tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="walk-section">
        <div className="walk-container">
          <p className="walk-kicker">품종 선택 가이드</p>
          <h2 className="walk-title" style={{ fontSize: "1.75rem" }}>
            우리 집에 맞는 아이 고르기
          </h2>
          <div className="walk-guide-grid" style={{ marginTop: "1.25rem" }}>
            {GUIDE_TOPICS.map((g) => (
              <div className="walk-guide-card" key={g.title}>
                <strong>{g.title}</strong>
                <p style={{ margin: "0.35rem 0 0", fontSize: "0.9rem" }}>{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="walk-section">
        <div className="walk-container">
          <p className="walk-kicker">강아지 품종 탐색</p>
          <h2 className="walk-title" style={{ fontSize: "1.75rem" }}>
            산책길에서 만날 수 있는 친구들
          </h2>
          <div className="walk-breed-row" style={{ marginTop: "1rem" }}>
            {dogFeatured.map((b) => (
              <Link href={b.href} key={b.name} className="walk-breed-chip">
                <img src={b.cover} alt={`${b.name} 사진`} width={220} height={150} loading="lazy" />
                <div>
                  <strong>{b.name}</strong>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--walk-muted)" }}>{b.tag}</p>
                </div>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: "1rem" }}>
            <Link href="/dogs">강아지 품종 전체 보기 →</Link>
          </p>
        </div>
      </section>

      <section className="walk-section" style={{ background: "#f3f8fb" }}>
        <div className="walk-container walk-cat-row">
          <div>
            <p className="walk-kicker">고양이 품종 탐색</p>
            <h2 className="walk-title" style={{ fontSize: "1.75rem" }}>
              창가와 소파의 동반자
            </h2>
            {catTop && (
              <Link
                href={catTop.href}
                className="walk-cat-feature"
                style={{ display: "block", marginTop: "1rem", position: "relative" }}
              >
                <img
                  src={catTop.cover}
                  alt={`${catTop.name} 대표 사진`}
                  width={600}
                  height={360}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1rem",
                    background: "linear-gradient(transparent, rgba(0,0,0,.55))",
                    color: "#fff",
                  }}
                >
                  <strong>{catTop.name}</strong>
                </div>
              </Link>
            )}
          </div>
          <div className="walk-cat-stack">
            {catRest.map((b) => (
              <Link href={b.href} key={b.name} className="walk-cat-mini">
                <img src={b.cover} alt={`${b.name} 사진`} width={96} height={72} loading="lazy" />
                <div>
                  <strong>{b.name}</strong>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--walk-muted)" }}>{b.tag}</p>
                </div>
              </Link>
            ))}
            <Link href="/cats">고양이 품종 더 보기 →</Link>
          </div>
        </div>
      </section>

      <section className="walk-section">
        <div className="walk-container">
          <p className="walk-kicker">처음 가족을 맞이한다면</p>
          <h2 className="walk-title" style={{ fontSize: "1.75rem" }}>
            입양 전에 준비할 것
          </h2>
          <div className="walk-guide-grid" style={{ marginTop: "1rem", gridTemplateColumns: "repeat(5,1fr)" }}>
            {FIRST_FAMILY.map((f) => (
              <div className="walk-guide-card" key={f.title}>
                <strong>{f.title}</strong>
                <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.1rem", fontSize: "0.88rem" }}>
                  {f.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="walk-section">
        <div className="walk-container">
          <p className="walk-kicker">지역별 안내</p>
          <h2 className="walk-title" style={{ fontSize: "1.75rem" }}>
            거주 지역에서 알아보기
          </h2>
          <div className="walk-region-pills" style={{ marginTop: "1rem" }}>
            {REGION_HUBS.map((r) => (
              <Link href={r.href} key={r.href}>
                {r.label}
              </Link>
            ))}
            <Link href="/regions">전체 지역</Link>
          </div>
        </div>
      </section>

      <section className="walk-section">
        <div className="walk-container">
          <p className="walk-kicker">보호·입양</p>
          <h2 className="walk-title" style={{ fontSize: "1.75rem" }}>
            새 가족을 기다리는 아이들
          </h2>
          <div className="walk-adopt-band" style={{ marginTop: "1rem" }}>
            {SHELTER_CARDS.map((s) => (
              <Link href={s.href} key={s.name} className="walk-adopt-card">
                <strong>{s.name}</strong>
                <p style={{ margin: "0.5rem 0 0" }}>{s.tag}</p>
                <p style={{ fontSize: "0.9rem", color: "var(--walk-muted)" }}>
                  보호·입양은 충분한 상담과 준비 시간이 필요합니다.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="walk-section">
        <div className="walk-container walk-public-band">
          <p className="walk-kicker">공공데이터 안내</p>
          <h2 className="walk-title" style={{ fontSize: "1.4rem" }}>
            지역별 등록 업체·병원 정보
          </h2>
          <p>
            품종·지역 페이지에서는 농림축산식품부 등 공개된 동물 관련 사업자 목록을 표로 제공합니다. 숫자는
            공개 시점·행정구역 기준이며, 방문·상담 전 최신 상태를 확인해 주세요.
          </p>
          <small>데이터 출처: 공공데이터포털·동물보호 관련 공개 목록 (페이지 하단 표기)</small>
        </div>
      </section>
    </>
  );
}
