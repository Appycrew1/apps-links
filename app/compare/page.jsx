"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { providersSeed, categoriesSeed } from "../../utils/seeds";
import { Badge } from "../../components/UI";
import { getLogo } from "../../utils/getLogo";

function useLiveProviders() {
  const [providers, setProviders] = useState(providersSeed);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) return;
      const [{ data: cats }, { data: provs }] = await Promise.all([
        supabase.from("categories").select("id,label"),
        supabase.from("providers").select("*").eq("is_active", true)
      ]);
      if (!mounted) return;
      const catList = cats?.length ? cats : categoriesSeed;
      const catMap = new Map(catList.map(c=>[c.id,c.label]));
      const src = provs?.length ? provs : providersSeed;
      setProviders(src.map(p=>({ ...p, category: p.category_id || p.category, categoryLabel: catMap.get(p.category_id || p.category) })));
    })();
    return ()=>{ mounted=false; };
  }, []);

  return providers;
}

export default function ComparePage(){
  const [compare, setCompare] = useState([]);
  const providers = useLiveProviders();

  useEffect(()=>{ try { setCompare(JSON.parse(localStorage.getItem("compare_providers") || "[]")); } catch {} }, []);
  const picks = providers.filter(p => compare.includes(p.id || p.name));

  const clear = () => { setCompare([]); localStorage.setItem("compare_providers","[]"); };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Compare Providers</h2>
        <button onClick={clear} className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold">Clear</button>
      </div>

      {picks.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {picks.map(p => (
            <div key={p.id || p.name} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img src={getLogo(p)} alt="" className="h-8 w-8 rounded-full border border-gray-200 bg-white"/>
                  <h3 className="text-base font-semibold">{p.name}</h3>
                </div>
                {p.discount && (<Badge color="bg-green-100 text-green-800">{p.discount.label}</Badge>)}
              </div>
              <div className="mb-3 text-xs text-gray-600">{p.categoryLabel}</div>
              <p className="mb-3 text-sm text-gray-700">{p.summary}</p>
              <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">{(p.tags||[]).map(t => <li key={t}>{t}</li>)}</ul>
              {p.website && (<a href={p.website} target="_blank" className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg:black">Visit ↗</a>)}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
          Add up to 3 providers from the <a href="/providers" className="font-semibold underline">Suppliers</a> page to compare here.
        </div>
      )}
    </section>
  );
}
