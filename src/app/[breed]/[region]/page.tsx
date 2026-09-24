import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreedMagazine from "../../components/BreedMagazine";
import { BREEDS, getBreed, isBreedSlug } from "@/lib/breeds";
import { breedPath } from "@/lib/breed-paths";
import { POPULAR_REGION_KEYS, SIDO_SHORT_NAMES } from "@/lib/korea-regions";
import { publicOrigin } from "@/lib/public-url";
import { resolveRegion } from "@/lib/region-resolve";
import { buildSanchackContent } from "@/lib/sanchack-content";
import { breedPageMetadata, jsonLdBlocks } from "@/lib/sanchack-meta";

type Props = { params: Promise<{ breed: string; region: string }> };

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const params: { breed: string; region: string }[] = [];
  for (const breed of BREEDS) {
    for (const sido of SIDO_SHORT_NAMES) {
      params.push({ breed: breed.slug, region: sido });
    }
    for (const key of POPULAR_REGION_KEYS) {
      params.push({ breed: breed.slug, region: key });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { breed: raw, region } = await params;
  const breed = getBreed(raw);
  if (!breed || !isBreedSlug(raw)) return { title: "페이지 없음" };
  const resolved = resolveRegion(region);
  if (!resolved) return { title: "페이지 없음" };
  const content = buildSanchackContent(breed, resolved.sido, resolved.sigungu);
  return breedPageMetadata(
    breed,
    await publicOrigin(),
    content.enc.intro,
    resolved.sido,
    resolved.sigungu
  );
}

export default async function BreedRegionPage({ params }: Props) {
  const { breed: raw, region } = await params;
  const breed = getBreed(raw);
  if (!breed || !isBreedSlug(raw)) notFound();

  const resolved = resolveRegion(region);
  if (!resolved) notFound();

  const origin = await publicOrigin();
  const content = buildSanchackContent(breed, resolved.sido, resolved.sigungu);
  const pagePath = breedPath(breed.slug, resolved.sido, resolved.sigungu);
  const jsonLd = jsonLdBlocks(
    breed,
    origin,
    content.h1,
    content.enc.intro,
    content.enc.faq,
    resolved.sido,
    resolved.sigungu
  );

  return (
    <>
      {jsonLd.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
      <BreedMagazine
        breed={breed}
        content={content}
        pagePath={pagePath}
        sido={resolved.sido}
        sigungu={resolved.sigungu}
      />
    </>
  );
}
