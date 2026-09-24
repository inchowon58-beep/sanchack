import { SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="walk-footer">
      <div className="walk-container">
        <p>
          <strong>{SITE.brand}</strong> · {SITE.brandEn}
        </p>
        <p>{SITE.description}</p>
        <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
          공공데이터 출처: 농림축산식품부 동물보호관리시스템 등 공개 목록을 바탕으로 안내합니다.
        </p>
      </div>
    </footer>
  );
}
