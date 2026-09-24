import { phoneToTel, SITE } from "@/lib/site";

export default function SiteFooter() {
  const { adoption, surrender } = SITE.phones;
  return (
    <footer className="walk-footer">
      <div className="walk-container">
        <p>
          <strong>{SITE.brand}</strong> · {SITE.brandEn}
        </p>
        <p>{SITE.description}</p>

        <div className="walk-footer-phones">
          <a href={phoneToTel(adoption.number)} className="walk-footer-phone">
            <strong>{adoption.label}</strong>
            <span>{adoption.number}</span>
          </a>
          <a href={phoneToTel(surrender.number)} className="walk-footer-phone">
            <strong>{surrender.label}</strong>
            <span>{surrender.number}</span>
          </a>
        </div>

        <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
          공공데이터 출처: 농림축산식품부 동물보호관리시스템 등 공개 목록을 바탕으로 안내합니다.
        </p>
      </div>
    </footer>
  );
}
