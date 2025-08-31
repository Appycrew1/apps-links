"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { providersSeed, categoriesSeed } from "../../utils/seeds";
import { Badge, Button, OutlineButton } from "../../components/UI";
import { useLocalStorage } from "../_hooks";
import { getLogo } from "../../utils/getLogo";

function useLiveProviders() {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState(providersSeed);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) { setLoading(false); return; }
      try {
        const [{ data: cats, error: ce }, { data: provs, error: pe }] = await Promise.all([
          supabase.from("categories").select("id,label").order("label"),
          supabase.from("providers").select("*").eq("is_active", true).order("is_featured",{ascending:false}).order("name")
        ]);
        if (ce) throw ce; if (pe) throw pe;
        if (!mounted) return;

        const catList = cats?.length ? cats : categoriesSeed;
        const catMap = new Map(catList.map(c => [c.id, c.label]));
        const src = provs?.length ? provs : providersSeed;

        setProviders(src.map(p => ({
          id: String(p.id || p.name),
          name: p.name,
          category: p.category_id || p.category,
          categoryLabel: catMap.get(p.category_id || p.category),
          tags: p.tags || [],
          website: p.website || "",
          summary: p.summary || "",
          details: p.details || "",
          discount: p.discount_label ? { label: p.discount_label, details: p.discount_details } : p.discount || null,
          logo: p.logo || "",
          is_featured: !!p.is_featured || (p.feature_until ? new Date(p.feature_until) > new Date() : false),
          tier: p.tier || "free",
        })));
      } catch (e) { setError(e.message); }
      finally { mounted && setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  return { loading, providers, error };
}

export default function ComparePage() {
  const { loading, providers, error } = useLiveProviders();
  const [compare, setCompare] = useLocalStorage("compare_providers", []);

  // Filter selected ids
  const compareSet = useMemo(() => new Set(compare.map(String)), [compare]);
  const picks = providers.filter(p => compareSet.has(String(p.id || p.name))).slice(0, 3);

  const remove = (id) => {
    const next = compare.filter(x => String(x) !== String(id));
    setCompare(next);
  };
  const clear = () => setCompare([]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Compare Providers</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{loading ? "Loading live data…" : error ? `Using local data (error: ${error})` : "Live data loaded"}</span>
          <span className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-xs">Compare: {compare.length}</span>
          <OutlineButton onClick={clear}>Clear</OutlineButton>
        </div>
      </div>

      {picks.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {picks.map(p => {
            const id = String(p.id || p.name);
            return (
              <div key={id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img src={getLogo(p)} alt="" className="h-8 w-8 rounded-full border border-gray-200 bg-white"/>
                    <h3 className="text-base font-semibold">{p.name}</h3>
                  </div>
                  {p.discount && (<Badge color="bg-green-100 text-green-800">{p.discount.label}</Badge>)}
                </div>
                <div className="mb-3 text-xs text-gray-600">{p.categoryLabel}</div>
                <p className="mb-3 text-sm text-gray-700">{p.summary}</p>
                <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
                  {(p.tags || []).map(t => <li key={t}>{t}</li>)}
                </ul>
                <div className="flex items-center gap-2">
                  {p.website && (
                    <a href={p.website} target="_blank" className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black">
                      Visit ↗
                    </a>
                  )}
                  <button onClick={() => remove(id)} className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
          Add up to 3 providers from the <a href="/providers" className="font-semibold underline">Suppliers</a> page to compare here.
        </div>
      )}
    </section>
  );
}
