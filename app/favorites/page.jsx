"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { providersSeed, categoriesSeed } from "../../utils/seeds";
import ProviderCard from "../../components/ProviderCard";
import { useLocalStorage } from "../_hooks";

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

export default function FavoritesPage() {
  const { loading, providers, error } = useLiveProviders();
  const [favorites, setFavorites] = useLocalStorage("favorites_providers", []);
  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const favs = providers.filter(p => favSet.has(String(p.id || p.name)));

  const remove = (id) => {
    const next = favorites.filter(x => x !== id);
    setFavorites(next);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Favorites</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{loading ? "Loading live data…" : error ? `Using local data (error: ${error})` : "Live data loaded"}</span>
          <span className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-xs">Saved: {favorites.length}</span>
          <button
            onClick={() => setFavorites([])}
            className="rounded-2xl border border-gray-300 bg-white px-4 py-2 font-semibold hover:bg-gray-50"
          >
            Clear All
          </button>
        </div>
      </div>

      {favs.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favs.map(p => {
            const id = String(p.id || p.name);
            return (
              <ProviderCard
                key={id}
                p={p}
                onOpen={() => {}}
                onToggleFav={() => remove(id)}
                isFav={true}
                onCompareToggle={() => {}}
                comparing={false}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
          No favourites yet. Go to <a href="/providers" className="font-semibold underline">Suppliers</a> and tap “Save”.
        </div>
      )}
    </section>
  );
}
