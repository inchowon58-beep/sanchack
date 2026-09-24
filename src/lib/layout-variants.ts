export type LayoutVariant = "A" | "B" | "C";

export type SectionKey =
  | "intro"
  | "breedSummary"
  | "quickFacts"
  | "story"
  | "temperament"
  | "living"
  | "care"
  | "checklist"
  | "publicData"
  | "faq"
  | "related";

const VARIANT_SECTIONS: Record<LayoutVariant, SectionKey[]> = {
  A: ["intro", "breedSummary", "living", "care", "publicData", "checklist", "faq", "related"],
  B: ["intro", "quickFacts", "checklist", "story", "care", "publicData", "faq", "related"],
  C: ["intro", "story", "temperament", "living", "checklist", "care", "publicData", "faq", "related"],
};

function hashKey(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** URL 기반 deterministic layout — 빌드마다 동일 */
export function layoutVariantFor(urlKey: string): LayoutVariant {
  const variants: LayoutVariant[] = ["A", "B", "C"];
  return variants[hashKey(urlKey) % 3];
}

export function sectionsForVariant(v: LayoutVariant): SectionKey[] {
  return VARIANT_SECTIONS[v];
}
