import type { MetadataRoute } from "next";
import { BREEDS } from "@/lib/breeds";
import { breedPath } from "@/lib/breed-paths";
import { KOREA_REGIONS, POPULAR_REGION_KEYS, SIDO_SHORT_NAMES } from "@/lib/korea-regions";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.siteUrl.replace(/\/+$/, "");
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/dogs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/cats`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/adoption`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/regions`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  for (const s of SIDO_SHORT_NAMES) {
    entries.push({
      url: `${base}/regions/${encodeURIComponent(s)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const b of BREEDS) {
    entries.push({
      url: `${base}${breedPath(b.slug)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const sido of SIDO_SHORT_NAMES) {
      entries.push({
        url: `${base}${breedPath(b.slug, sido)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    for (const key of POPULAR_REGION_KEYS) {
      const [short, sigungu] = key.split("_");
      const region = KOREA_REGIONS.find((r) => r.sigungu === sigungu);
      if (!region) continue;
      entries.push({
        url: `${base}${breedPath(b.slug, region.sido, region.sigungu)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.65,
      });
    }
  }

  return entries;
}
