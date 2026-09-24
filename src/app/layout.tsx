import type { Metadata, Viewport } from "next";
import ContactBar from "./components/ContactBar";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import "./globals.css";
import "./walk.css";
import { SITE } from "@/lib/site";
import { publicOrigin } from "@/lib/public-url";

function metadataOrigin(raw: string): string {
  const trimmed = raw.trim();
  try {
    return new URL(trimmed).origin;
  } catch {
    return "https://xn--2i0by3ib0hw6j.siteblog.co.kr";
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const origin = metadataOrigin(await publicOrigin());
  return {
    metadataBase: new URL(origin),
    title: {
      default: SITE.title,
      template: `%s | ${SITE.brand}`,
    },
    description: SITE.description,
    keywords: [...SITE.keywords],
    alternates: { canonical: origin },
    openGraph: {
      title: SITE.title,
      description: SITE.description,
      url: origin,
      siteName: SITE.brand,
      locale: "ko_KR",
      type: "website",
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.brand }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE.title,
      description: SITE.description,
      images: [SITE.ogImage],
    },
    robots: { index: true, follow: true },
    other: SITE.naverSiteVerification
      ? { "naver-site-verification": SITE.naverSiteVerification }
      : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href={new URL(SITE.imageBase).origin} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        {SITE.naverSiteVerification ? (
          <meta name="naver-site-verification" content={SITE.naverSiteVerification} />
        ) : null}
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <ContactBar />
      </body>
    </html>
  );
}
