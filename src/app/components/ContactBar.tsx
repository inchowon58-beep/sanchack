import { phoneToTel, SITE } from "@/lib/site";

export default function ContactBar() {
  const { adoption, surrender } = SITE.phones;
  return (
    <div className="walk-contact-bar" aria-label="문의 전화">
      <a href={phoneToTel(adoption.number)} className="walk-contact-btn walk-contact-adoption">
        {adoption.label}
        <span>{adoption.number}</span>
      </a>
      <a href={phoneToTel(surrender.number)} className="walk-contact-btn walk-contact-surrender">
        {surrender.label}
        <span>{surrender.number}</span>
      </a>
    </div>
  );
}
