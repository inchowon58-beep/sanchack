import type { Metadata } from "next";
import type { Breed } from "./breeds";
import { kindKo } from "./breeds";
import { breedCover, breedGalleryCards } from "./breed-images";
import { breedPath } from "./breed-paths";
import { displaySido } from "./korea-regions";
import { SITE } from "./site";

function placeLabel(sido?: string, sigungu?: string, dong?: string): string {
  if (dong && sigungu) return `${displaySido(sido || "")} ${sigungu} ${dong}`.trim();
  if (sigungu) return `${displaySido(sido || "")} ${sigungu}`.trim();
  if (sido) return displaySido(sido);
  return "전국";
}

function titleForBreed(breed: Breed, place: string, hasRegion: boolean): string {
  const b = breed.name;
  if (breed.kind === "shelter") {
    return hasRegion
      ? `${place} ${b} 입양·보호 안내 | ${SITE.brand}`
      : `${b} 입양·보호 안내 | ${SITE.brand}`;
  }
  if (breed.kind === "cat") {
    return hasRegion
      ? `${place} ${b}분양 관리·성격 정보 | ${SITE.brand}`
      : `${b}분양 성격과 관리정보 | ${SITE.brand}`;
  }
  if (hasRegion) {
    return `${place} ${b}분양 입양정보 | ${SITE.brand}`;
  }
  const patterns = [
    `${b}분양 성격과 입양 전 확인사항 | ${SITE.brand}`,
    `${b} 품종 특성·키우기 가이드 | ${SITE.brand}`,
    `${b}분양, 함께하기 전에 알아볼 것 | ${SITE.brand}`,
  ];
  let h = 0;
  for (let i = 0; i < b.length; i++) h = (h * 31 + b.charCodeAt(i)) | 0;
  return patterns[Math.abs(h) % patterns.length];
}

function descriptionFor(breed: Breed, place: string, intro: string): string {
  const base = intro.slice(0, 120);
  if (breed.kind === "shelter") {
    return `${place} ${breed.name} 입양·보호 정보. ${base}`.slice(0, 158);
  }
  return `${place} ${breed.name}분양 안내. ${base}`.slice(0, 158);
}

export function breedPageMetadata(
  breed: Breed,
  origin: string,
  intro: string,
  sido?: string,
  sigungu?: string,
  dong?: string
): Metadata {
  const place = placeLabel(sido, sigungu, dong);
  const hasRegion = Boolean(sido || sigungu || dong);
  const path = breedPath(breed.slug, sido, sigungu, dong);
  const url = origin + path;
  const salt = [sido, sigungu, dong].filter(Boolean).join("_");
  const gallery = breedGalleryCards(breed, salt, 4);
  const title = titleForBreed(breed, place, hasRegion);
  const description = descriptionFor(breed, place, intro);

  return {
    title: { absolute: title },
    description,
    keywords: [breed.keyword, breed.name, place, kindKo(breed), SITE.brand],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "ko_KR",
      siteName: SITE.brand,
      images: gallery.map((c) => ({ url: c.src, width: 800, height: 800, alt: c.name })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: gallery.map((c) => c.src),
    },
    robots: { index: true, follow: true },
  };
}

export function jsonLdBlocks(
  breed: Breed,
  origin: string,
  h1: string,
  description: string,
  faqs: { q: string; a: string }[],
  sido?: string,
  sigungu?: string,
  dong?: string
) {
  const path = breedPath(breed.slug, sido, sigungu, dong);
  const url = origin + path;
  const cover = breedCover(breed.folder);
  const crumbs = [
    { "@type": "ListItem", position: 1, name: "홈", item: origin },
    {
      "@type": "ListItem",
      position: 2,
      name: breed.kind === "cat" ? "고양이" : breed.kind === "shelter" ? "보호·입양" : "강아지",
      item: `${origin}/${breed.kind === "cat" ? "cats" : breed.kind === "shelter" ? "adoption" : "dogs"}`,
    },
    { "@type": "ListItem", position: 3, name: breed.name, item: origin + breedPath(breed.slug) },
  ];
  if (sido) {
    crumbs.push({
      "@type": "ListItem",
      position: crumbs.length + 1,
      name: displaySido(sido),
      item: origin + breedPath(breed.slug, sido),
    });
  }
  if (sigungu) {
    crumbs.push({
      "@type": "ListItem",
      position: crumbs.length + 1,
      name: sigungu,
      item: url,
    });
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.brand,
      url: origin,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.brand,
      url: origin,
      logo: SITE.logo,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs,
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: h1,
      description,
      image: cover,
      mainEntityOfPage: url,
      publisher: { "@type": "Organization", name: SITE.brand },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}
