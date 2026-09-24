import Link from "next/link";
import { SITE } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="walk-header">
      <div className="walk-container walk-header-inner">
        <Link href="/" className="walk-logo">
          {SITE.brand}
        </Link>
        <nav className="walk-nav" aria-label="주요 메뉴">
          <Link href="/dogs">강아지</Link>
          <Link href="/cats">고양이</Link>
          <Link href="/adoption">보호·입양</Link>
          <Link href="/regions">지역별</Link>
        </nav>
      </div>
    </header>
  );
}
