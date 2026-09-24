import { headers } from "next/headers";
import { SITE } from "./site";

export function stripTrailingSlash(url: string): string {
  return (url || "").trim().replace(/\/+$/, "");
}

function isLocalHost(host: string): boolean {
  const h = host.toLowerCase();
  return h.startsWith("localhost") || h.startsWith("127.0.0.1") || h.endsWith(".local");
}

/** canonical/og — 신규 도메인 우선, 요청 호스트가 신규 도메인일 때만 동적 반영 */
export async function publicOrigin(): Promise<string> {
  const fallback = stripTrailingSlash(SITE.siteUrl);
  try {
    const h = await headers();
    const host = (h.get("x-forwarded-host") || h.get("host") || "")
      .split(",")[0]
      .trim()
      .toLowerCase();
    if (host && !isLocalHost(host)) {
      if (host.includes("dearpet") || host.includes("deatpet") || host.includes("dognme")) {
        return fallback;
      }
      return `https://${host}`;
    }
  } catch {
    /* static gen */
  }
  return fallback;
}

export function absoluteUrl(origin: string, path = ""): string {
  const base = stripTrailingSlash(origin);
  const p = (path || "").trim();
  if (!p || p === "/") return base;
  const normalized = p.startsWith("/") ? p : `/${p}`;
  return `${base}${stripTrailingSlash(normalized)}`;
}
