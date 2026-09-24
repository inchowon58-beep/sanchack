type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

/** 기본 접힘 — native details/summary */
export default function CollapsibleSection({ title, children, className = "" }: Props) {
  return (
    <details className={`mag-collapse ${className}`.trim()}>
      <summary>{title}</summary>
      <div className="mag-collapse-body">{children}</div>
    </details>
  );
}
