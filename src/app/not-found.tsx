import Link from "next/link";

export default function NotFound() {
  return (
    <div className="walk-container walk-section">
      <h1 className="walk-title">페이지를 찾을 수 없습니다</h1>
      <p className="walk-lead">주소를 다시 확인하거나 홈으로 돌아가 주세요.</p>
      <Link href="/">홈으로</Link>
    </div>
  );
}
