"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  filterBreeds,
  type ActivityFilter,
  type EnvFilter,
  type GroomFilter,
  type SizeFilter,
} from "@/lib/breed-filters";
import type { Breed } from "@/lib/breeds";
import { breedPath } from "@/lib/breed-paths";
import { breedCover } from "@/lib/breed-images";

type Props = {
  breeds: Breed[];
  kind: "dog" | "cat";
  initialQ?: string;
};

export default function BreedFilterGrid({ breeds, kind, initialQ = "" }: Props) {
  const [q, setQ] = useState(initialQ);
  const [size, setSize] = useState<SizeFilter | "">("");
  const [activity, setActivity] = useState<ActivityFilter | "">("");
  const [grooming, setGrooming] = useState<GroomFilter | "">("");
  const [environment, setEnvironment] = useState<EnvFilter | "">("");

  const filtered = useMemo(
    () =>
      filterBreeds(breeds, {
        kind,
        q,
        size: size || undefined,
        activity: activity || undefined,
        grooming: grooming || undefined,
        environment: environment || undefined,
      }),
    [breeds, kind, q, size, activity, grooming, environment]
  );

  return (
    <>
      <div className="filter-bar">
        <input
          type="search"
          placeholder="품종명 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="품종명 검색"
        />
        <select value={size} onChange={(e) => setSize(e.target.value as SizeFilter | "")} aria-label="크기">
          <option value="">크기</option>
          {["초소형", "소형", "중형", "대형", "다양"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityFilter | "")}
          aria-label="활동량"
        >
          <option value="">활동량</option>
          {["낮음", "보통", "높음"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={grooming}
          onChange={(e) => setGrooming(e.target.value as GroomFilter | "")}
          aria-label="털 관리"
        >
          <option value="">털 관리</option>
          {["적음", "보통", "많음"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={environment}
          onChange={(e) => setEnvironment(e.target.value as EnvFilter | "")}
          aria-label="생활환경"
        >
          <option value="">생활환경</option>
          {["실내", "실내+산책", "넓은공간"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <p className="walk-lead">{filtered.length}개 품종</p>
      <div className="breed-grid">
        {filtered.map((b) => (
          <Link href={breedPath(b.slug)} key={b.slug} className="walk-friend-card">
            <img src={breedCover(b.folder)} alt={`${b.name} 사진`} width={400} height={300} loading="lazy" />
            <div>
              <strong>{b.name}</strong>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--walk-muted)" }}>{b.tag}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
