import Link from "next/link";
import type { Breed } from "@/lib/breeds";
import { breedPath } from "@/lib/breed-paths";
import type { PageGalleryPhoto } from "@/lib/breed-images";
import type { SanchackPageContent } from "@/lib/sanchack-content";
import { neighborLinks } from "@/lib/sanchack-content";
import type { SectionKey } from "@/lib/layout-variants";
import { bizSourceLine } from "@/lib/local-pet-biz";
import CollapsibleSection from "./CollapsibleSection";

type Props = {
  breed: Breed;
  content: SanchackPageContent;
  pagePath: string;
  sido?: string;
  sigungu?: string;
  dong?: string;
};

function Section({
  id,
  children,
}: {
  id: SectionKey;
  children: React.ReactNode;
}) {
  return <section data-section={id}>{children}</section>;
}

function MagPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" className="mag-photo-img" />
  );
}

function ScatterPhoto({ photo }: { photo: PageGalleryPhoto }) {
  const variant = photo.variant || "inline";
  return (
    <figure className={`mag-scatter mag-scatter-${variant}`}>
      <MagPhoto src={photo.src} alt={photo.alt} />
    </figure>
  );
}

function MagGallery({ photos, cols }: { photos: PageGalleryPhoto[]; cols: 2 | 3 }) {
  return (
    <div className={`mag-gallery mag-gallery-${cols}`} aria-label="품종 사진 갤러리">
      {photos.map((p) => (
        <figure key={p.src} className="mag-gallery-item">
          <MagPhoto src={p.src} alt={p.alt} />
        </figure>
      ))}
    </div>
  );
}

function MagPhotoStrip({ photos }: { photos: PageGalleryPhoto[] }) {
  return (
    <div className="mag-photo-strip" aria-label="품종 사진">
      {photos.map((p) => (
        <figure key={p.src} className="mag-photo-strip-item">
          <MagPhoto src={p.src} alt={p.alt} />
        </figure>
      ))}
    </div>
  );
}

export default function BreedMagazine({ breed, content, sido, sigungu }: Props) {
  const { enc, sections, localFacts, facts, photos, gallery, related } = content;
  const neighbors = neighborLinks(breed, sido, sigungu);

  const sectionTitles: Partial<Record<SectionKey, string>> = {
    intro: "소개",
    breedSummary: enc.headingVariants.story,
    quickFacts: "핵심 특성",
    story: enc.headingVariants.story,
    temperament: "성격과 교감",
    living: enc.headingVariants.beforeLiving,
    care: enc.headingVariants.lifestyle,
    checklist: "입양 전 체크리스트",
    publicData: localFacts.snapshotH2,
    faq: "자주 묻는 질문",
    related: "관련 품종",
  };

  const blocks: Record<SectionKey, React.ReactNode> = {
    intro: (
      <CollapsibleSection title={sectionTitles.intro!}>
        <div className="mag-prose">
          <p>{content.intro}</p>
        </div>
      </CollapsibleSection>
    ),
    breedSummary: (
      <CollapsibleSection title={sectionTitles.breedSummary!}>
        <div className="mag-prose">
          <p>{enc.personality}</p>
        </div>
      </CollapsibleSection>
    ),
    quickFacts: (
      <CollapsibleSection title={sectionTitles.quickFacts!}>
        <div className="mag-facts" aria-label="핵심 특성">
          {facts.map((f) => (
            <div className="mag-fact" key={f.label}>
              <span>{f.label}</span>
              <strong>{f.value}</strong>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    ),
    story: (
      <CollapsibleSection title={sectionTitles.story!}>
        <div className="mag-prose">
          <p>{enc.intro}</p>
          <p>{enc.personality}</p>
        </div>
      </CollapsibleSection>
    ),
    temperament: (
      <CollapsibleSection title={sectionTitles.temperament!}>
        <div className="mag-prose">
          <p>{enc.personality}</p>
        </div>
      </CollapsibleSection>
    ),
    living: (
      <CollapsibleSection title={sectionTitles.living!}>
        <div className="mag-prose">
          <p>{enc.living}</p>
          <p>{enc.firstOwner}</p>
        </div>
      </CollapsibleSection>
    ),
    care: (
      <CollapsibleSection title={sectionTitles.care!}>
        <div className="mag-prose">
          <p>{enc.activity}</p>
          <p>{enc.grooming}</p>
        </div>
      </CollapsibleSection>
    ),
    checklist: (
      <CollapsibleSection title={sectionTitles.checklist!}>
        <div className="mag-prose">
          <ul className="mag-checklist">
            {enc.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </CollapsibleSection>
    ),
    publicData: (
      <CollapsibleSection title={sectionTitles.publicData!} className="walk-public-band">
        <div className="mag-prose">
          <div className="mag-facts">
            {localFacts.stats.map((s) => (
              <div className="mag-fact" key={s.label}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
                <small>{s.note}</small>
              </div>
            ))}
          </div>
          {localFacts.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          {localFacts.tables.map((t) => (
            <div className="mag-table-wrap" key={t.caption}>
              <table className="mag-table">
                <caption>{t.caption}</caption>
                <thead>
                  <tr>
                    {t.headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((row, i) => (
                    <tr key={i}>
                      {row.cells.map((c, j) => (
                        <td key={j}>
                          {row.href && j === 0 ? <Link href={row.href}>{c}</Link> : c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <small>{t.source}</small>
            </div>
          ))}
          <small>{bizSourceLine()}</small>
        </div>
      </CollapsibleSection>
    ),
    faq: (
      <CollapsibleSection title={sectionTitles.faq!} className="mag-faq-wrap">
        <div className="mag-faq">
          {enc.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </CollapsibleSection>
    ),
    related: (
      <CollapsibleSection title={sectionTitles.related!}>
        <div className="mag-prose">
          <div className="mag-related">
            {related.map((b) => (
              <Link key={b.slug} href={breedPath(b.slug)}>
                {b.name}
              </Link>
            ))}
          </div>
          {neighbors.length > 0 && (
            <>
              <h3 style={{ marginTop: "1.25rem" }}>인근 지역</h3>
              <div className="mag-related">
                {neighbors.map((n) => (
                  <Link key={n.href} href={n.href}>
                    {n.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>
    ),
  };

  const scatterMap = new Map<number, number>();
  if (gallery.layout === "scatter") {
    gallery.scatterAt.forEach((sectionIdx, photoIdx) => {
      scatterMap.set(sectionIdx, photoIdx);
    });
  }

  const galleryBlock =
    gallery.layout === "grid-2" ? (
      <MagGallery photos={gallery.photos} cols={2} />
    ) : gallery.layout === "grid-3" ? (
      <MagGallery photos={gallery.photos} cols={3} />
    ) : gallery.layout === "strip" ? (
      <MagPhotoStrip photos={gallery.photos} />
    ) : null;

  return (
    <article>
      <div className="walk-container mag-hero">
        <div>
          <p className="walk-kicker">{content.kicker}</p>
          <h1 className="walk-title">{content.h1}</h1>
          <p className="walk-lead">{enc.intro}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos.hero}
          alt={`${breed.name} 대표 사진`}
          width={640}
          height={512}
          loading="eager"
          fetchPriority="high"
          className="mag-hero-img"
        />
      </div>

      <div className="walk-container mag-body">
        {sections.map((key, idx) => {
          const scatterPhotoIdx = scatterMap.get(idx);
          const showGalleryBlock = galleryBlock && idx === gallery.blockInsertAt;

          return (
            <div key={key}>
              {scatterPhotoIdx != null && gallery.photos[scatterPhotoIdx] ? (
                <ScatterPhoto photo={gallery.photos[scatterPhotoIdx]} />
              ) : null}
              {showGalleryBlock ? galleryBlock : null}
              <Section id={key}>{blocks[key]}</Section>
            </div>
          );
        })}

        <CollapsibleSection title={enc.headingVariants.health}>
          <div className="mag-prose">
            <p>{enc.health}</p>
          </div>
        </CollapsibleSection>
      </div>
    </article>
  );
}
