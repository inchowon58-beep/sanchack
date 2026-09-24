import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreedMagazine from "../components/BreedMagazine";
import { BREEDS, getBreed, isBreedSlug } from "@/lib/breeds";
import { breedPath } from "@/lib/breed-paths";
import { publicOrigin } from "@/lib/public-url";
import { buildSanchackContent } from "@/lib/sanchack-content";
import { breedPageMetadata, jsonLdBlocks } from "@/lib/sanchack-meta";

type Props = { params: Promise<{ breed: string }> };

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return BREEDS.map((b) => ({ breed: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { breed: raw } = await params;
  const breed = getBreed(raw);
  if (!breed || !isBreedSlug(raw)) return { title: "페이지 없음" };
  const content = buildSanchackContent(breed);
  return breedPageMetadata(breed, await publicOrigin(), content.enc.intro);
}

export default async function BreedPage({ params }: Props) {
  const { breed: raw } = await params;
  const breed = getBreed(raw);
  if (!breed || !isBreedSlug(raw)) notFound();

  const origin = await publicOrigin();
  const content = buildSanchackContent(breed);
  const pagePath = breedPath(breed.slug);
  const jsonLd = jsonLdBlocks(
    breed,
    origin,
    content.h1,
    content.enc.intro,
    content.enc.faq
  );

  return (
    <>
      {jsonLd.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
      <BreedMagazine breed={breed} content={content} pagePath={pagePath} />
    </>
  );
}
