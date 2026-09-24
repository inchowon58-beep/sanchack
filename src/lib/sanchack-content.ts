import type { Breed } from "./breeds";
import { relatedBreeds } from "./breeds";
import { breedPath } from "./breed-paths";
import { breedTraits } from "./breed-filters";
import { breedPageGallery, breedPhotos, type PageGallery } from "./breed-images";
import { layoutVariantFor, sectionsForVariant, type SectionKey } from "./layout-variants";
import { buildLocalRegionFacts, type LocalRegionFacts } from "./local-region-facts";
import { displaySido, neighborSigungus } from "./korea-regions";
import { getSanchackEncyclopedia } from "./sanchack-encyclopedia";
import { SITE } from "./site";

export type FactCard = { label: string; value: string };

export type SanchackPageContent = {
  h1: string;
  kicker: string;
  intro: string;
  enc: ReturnType<typeof getSanchackEncyclopedia>;
  facts: FactCard[];
  photos: ReturnType<typeof breedPhotos>;
  gallery: PageGallery;
  localFacts: LocalRegionFacts;
  variant: ReturnType<typeof layoutVariantFor>;
  sections: SectionKey[];
  related: Breed[];
  regionIntro?: string;
  place: string;
};

function placeLabel(sido?: string, sigungu?: string, dong?: string): string {
  if (dong && sigungu) return `${displaySido(sido || "")} ${sigungu} ${dong}`;
  if (sigungu) return `${displaySido(sido || "")} ${sigungu}`;
  if (sido) return displaySido(sido);
  return "전국";
}

function h1For(breed: Breed, place: string, hasRegion: boolean): string {
  if (breed.kind === "shelter") {
    return hasRegion ? `${place} ${breed.name} 입양·보호 안내` : `${breed.name} 입양·보호 안내`;
  }
  return hasRegion ? `${place} ${breed.name}분양 알아보기` : `${breed.name} — ${breed.tag}`;
}

export function buildSanchackContent(
  breed: Breed,
  sido?: string,
  sigungu?: string,
  dong?: string
): SanchackPageContent {
  const enc = getSanchackEncyclopedia(breed);
  const hasRegion = Boolean(sido || sigungu || dong);
  const urlKey = [breed.slug, sido, sigungu, dong].filter(Boolean).join("|");
  const variant = layoutVariantFor(urlKey);
  const traits = breedTraits(breed);
  const photos = breedPhotos(breed, urlKey);
  const place = placeLabel(sido, sigungu, dong);
  const gallery = breedPageGallery(breed, urlKey, place);

  let regionIntro: string | undefined;
  if (sigungu && sido) {
    regionIntro = `${place}에서 ${breed.name}분양을 알아보시는 분께 — 품종 정보와 함께 확인할 수 있는 공공데이터를 아래에 정리했습니다.`;
  } else if (sido) {
    regionIntro = `${displaySido(sido)} 지역에서 ${breed.name}분양 정보를 찾고 계신다면, 시·군·구별 안내로 이어집니다.`;
  }

  return {
    h1: h1For(breed, place, hasRegion),
    kicker: hasRegion ? `${place} · ${SITE.brand}` : `${breed.keyword} · ${SITE.brand}`,
    intro: hasRegion ? regionIntro || enc.intro : enc.intro,
    enc,
    facts: [
      { label: "성격", value: breed.temperament },
      { label: "활동량", value: traits.activity },
      { label: "털 관리", value: traits.grooming },
      { label: "생활환경", value: traits.environment },
      { label: "체구", value: breed.size },
      { label: "털·외모", value: breed.coat },
    ],
    photos,
    gallery,
    localFacts: buildLocalRegionFacts(breed, sido, sigungu, dong),
    variant,
    sections: sectionsForVariant(variant),
    related: relatedBreeds(breed, 6),
    regionIntro,
    place,
  };
}

export function neighborLinks(breed: Breed, sido?: string, sigungu?: string) {
  if (!sido || !sigungu) return [];
  return neighborSigungus(sido, sigungu, 6).map((r) => ({
    label: r.sigungu,
    href: breedPath(breed.slug, r.sido, r.sigungu),
  }));
}
