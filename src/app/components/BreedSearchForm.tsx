"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function BreedSearchForm() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/dogs?q=${encodeURIComponent(term)}`);
  }

  return (
    <form className="walk-search" onSubmit={onSubmit} role="search">
      <input
        type="search"
        name="q"
        placeholder="품종 또는 지역을 검색하세요"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="품종 또는 지역 검색"
      />
      <button type="submit">찾기</button>
    </form>
  );
}
