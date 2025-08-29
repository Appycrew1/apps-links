"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { providersSeed, categoriesSeed } from "../../utils/seeds";
import { Badge } from "../../components/UI";
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
        const catMap = new Map(catList.map(c=>[c.id,c.label]));
        const src = provs?.length ? provs : providersSeed;
        setProviders(src.map(p=>({
          ...p,
          category: p.category_id || p.category,
          categoryLabel: catMap.get(p.category_id || p.category),
          discount: p.discount_label ? { label: p.discount_label, details: p.discount_details } : p.discount || null,
        })));
      } catch(e){ setError(e.message); }
      finally { mounted && setLoading(false); }
    })();
    return ()=>{ mounted=false; };
  }, []);

  return { loading, providers, error };
}

export default function DiscountsPage() {
  const { loading, providers, error } = useLiveProviders();
  const discounted = providers.filter(p => !!p.discount);

  // If you have few explicit discounts yet, also surface "featured" partners.
  const featured = providers.filter(p => p.is_featured && !p.discount);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Partner Discounts</h2>
      <p className="mb-6 text-sm text-gray-600">
        {loading ? "Loading live data…" : error ? `Using local data (error: ${error})` : "Live data loaded"}
      </p>

      {discounted.length === 0 && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          We’re confirming partner offers. In the meantime, featured suppliers are shown below.
        </div>
      )}

      {discounted.length > 0 && (
        <>
          <h3 className="mb-3 text-lg font-semibold">Active Offers</h3>
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {discounted.map(p => (
              <div key={p.id || p.name} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={getLogo(p)} alt="" className="h-8 w-8 rounded-full border border-gray-200 bg-white"/>
                    <h3 className="truncate text-base font-semibold">{p.name}</h3>
                  </div>
                  <Badge color="bg-green-100 text-green-800">{p.discount?.label}</Badge>
                </div>
                <p className="mb-4 text-sm text-gray-600">{p.summary || p.discount?.details}</p>
                {p.website && (
                  <a href={p.website} target="_blank" className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black">
                    Redeem / Learn More ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {featured.length > 0 && (
        <>
          <h3 className="mb-3 text-lg font-semibold">Featured Partners</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(p => (
              <div key={p.id || p.name} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-3">
                  <img src={getLogo(p)} alt="" className="h-8 w-8 rounded-full border border-amber-200 bg-white"/>
                  <div className="font-semibold">{p.name}</div>
                </div>
                <div className="text-sm text-gray-700">{p.summary}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
