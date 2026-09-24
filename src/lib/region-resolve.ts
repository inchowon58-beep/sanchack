import { getSigunguByKey, parseSidoName } from "./korea-regions";

export function resolveRegion(raw: string) {
  const key = decodeURIComponent(raw || "").trim();
  const sigungu = getSigunguByKey(key);
  if (sigungu) return { sido: sigungu.sido, sigungu: sigungu.sigungu };
  const sido = parseSidoName(key);
  if (sido) return { sido, sigungu: undefined as string | undefined };
  return null;
}
