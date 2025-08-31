// components/ProviderCard.jsx
"use client";
import React from "react";
import { Badge } from "./UI";
import { getLogo } from "../utils/getLogo";

export default function ProviderCard({
  p,
  onOpen,
  onToggleFav,
  isFav,
  onCompareToggle,
  comparing,
}) {
  const id = String(p.id || p.name);

  const handleFav = (e) => { e.preventDefault(); e.stopPropagation(); onToggleFav?.(); };
  const handleCompare = (e) => { e.preventDefault(); e.stopPropagation(); onCompareToggle?.(); };
  const openDetails = (e) => { e.preventDefault(); onOpen?.(p); };

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img src={getLogo(p)} alt="" className="h-10 w-10 rounded-full object-cover border border-gray-200 bg-white"/>
          <h3 className="truncate text-base font-semibold text-gray-900">{p.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          {p.is_featured && <Badge color="bg-yellow-100 text-yellow-800">Featured</Badge>}
          {p.discount && <Badge color="bg-green-100 text-green-800">{p.discount.label}</Badge>}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        <Badge>{p.categoryLabel || p.category}</Badge>
        {p.tags?.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
      </div>

      <p className="mb-4 line-clamp-3 text-sm text-gray-600">{p.summary}</p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <button
          onClick={openDetails}
          className="inline-flex flex-1 items-center justify-center rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          Details
        </button>
        <button
          onClick={handleFav}
          className={`inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-sm font-semibold shadow-sm ${
            isFav ? "border-amber-600 bg-amber-50 text-amber-700" : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
          }`}
          aria-pressed={isFav}
          title={isFav ? "Remove from favourites" : "Save to favourites"}
        >
          {isFav ? "★ Saved" : "☆ Save"}
        </button>
        <button
          onClick={handleCompare}
          className={`inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-sm font-semibold shadow-sm ${
            comparing ? "border-black bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
          }`}
          aria-pressed={comparing}
          title="Add to compare"
        >
          ⇄ Compare
        </button>
      </div>
    </div>
  );
}
