import Link from "next/link";
import type { Breed } from "@/lib/breeds";
import { breedPath } from "@/lib/breed-paths";
import type { SanchackPageContent } from "@/lib/sanchack-content";
import { neighborLinks } from "@/lib/sanchack-content";
import type { SectionKey } from "@/lib/layout-variants";
import { bizSourceLine } from "@/lib/local-pet-biz";

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

export default function BreedMagazine({ breed, content, sido, sigungu }: Props) {
  const { enc, sections, localFacts, facts, photos, related } = content;
  const neighbors = neighborLinks(breed, sido, sigungu);

  const blocks: Record<SectionKey, React.ReactNode> = {
    intro: (
      <div className="mag-prose">
        <p>{content.intro}</p>
      </div>
    ),
    breedSummary: (
      <div className="mag-prose">
        <h2>{enc.headingVariants.story}</h2>
        <p>{enc.personality}</p>
      </div>
    ),
    quickFacts: (
      <div className="mag-facts" aria-label="핵심 특성">
        {facts.map((f) => (
          <div className="mag-fact" key={f.label}>
            <span>{f.label}</span>
            <strong>{f.value}</strong>
          </div>
        ))}
      </div>
    ),
    story: (
      <div className="mag-prose">
        <h2>{enc.headingVariants.story}</h2>
        <p>{enc.intro}</p>
        <p>{enc.personality}</p>
      </div>
    ),
    temperament: (
      <div className="mag-prose">
        <h2>성격과 교감</h2>
        <p>{enc.personality}</p>
      </div>
    ),
    living: (
      <div className="mag-prose">
        <h2>{enc.headingVariants.beforeLiving}</h2>
        <p>{enc.living}</p>
        <p>{enc.firstOwner}</p>
      </div>
    ),
    care: (
      <div className="mag-prose">
        <h2>{enc.headingVariants.lifestyle}</h2>
        <p>{enc.activity}</p>
        <p>{enc.grooming}</p>
      </div>
    ),
    checklist: (
      <div className="mag-prose">
        <h2>입양 전 체크리스트</h2>
        <ul className="mag-checklist">
          {enc.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    ),
    publicData: (
      <div className="mag-prose walk-public-band">
        <h2>{localFacts.snapshotH2}</h2>
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
    ),
    faq: (
      <div className="mag-prose mag-faq">
        <h2>자주 묻는 질문</h2>
        {enc.faq.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    ),
    related: (
      <div className="mag-prose">
        <h2>관련 품종</h2>
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
    ),
  };

  return (
    <article>
      <div className="walk-container mag-hero">
        <div>
          <p className="walk-kicker">{content.kicker}</p>
          <h1 className="walk-title">{content.h1}</h1>
          <p className="walk-lead">{enc.intro}</p>
        </div>
        <img
          src={photos.hero}
          alt={`${breed.name} 대표 사진`}
          width={640}
          height={512}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="walk-container">
        {sections.map((key) => (
          <Section id={key} key={key}>
            {blocks[key]}
          </Section>
        ))}

        <div className="mag-prose">
          <h2>{enc.headingVariants.health}</h2>
          <p>{enc.health}</p>
        </div>
      </div>
    </article>
  );
}
