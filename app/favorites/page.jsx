"use client";
import React, { useEffect, useState } from "react";
import ProviderCard from "../../components/ProviderCard";
import { supabase } from "../../lib/supabaseClient";
import { providersSeed, categoriesSeed } from "../../utils/seeds";

function useLiveProviders() {
  const [providers, setProviders] = useState(providersSeed);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) { setLoading(false); return; }
      const [{ data: cats }, { data: provs }] = await Promise.all([
        supabase.from("categories").select("id,label"),
        supabase.from("providers").select("*").eq("is_active", true)
      ]);
      if (!mounted) return;
      const catList = cats?.length ? cats : categoriesSeed;
      const catMap = new Map(catList.map(c=>[c.id,c.label]));
      const src = provs?.length ? provs : providersSeed;
      setProviders(src.map(p=>({ ...p, category: p.category_id || p.category, categoryLabel: catMap.get(p.category_id || p.category) })));
      setLoading(false);
    })();
    return ()=>{ mounted=false; };
  }, []);

  return { providers, loading };
}

export default function FavoritesPage(){
  const [favorites, setFavorites] = useState([]);
  const { providers } = useLiveProviders();

  useEffect(()=>{ try { setFavorites(JSON.parse(localStorage.getItem("favorites_providers") || "[]")); } catch {} }, []);
  const favs = providers.filter(p => favorites.includes(p.id || p.name));

  const remove = (id) => {
    const next = favorites.filter(x => x !== id);
    setFavorites(next);
    localStorage.setItem("favorites_providers", JSON.stringify(next));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Favorites</h2>
        <button onClick={()=>{ setFavorites([]); localStorage.setItem("favorites_providers","[]"); }} className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold">Clear All</button>
      </div>

      {favs.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favs.map(p => (
            <ProviderCard
              key={p.id || p.name}
              p={p}
              onToggleFav={()=>remove(p.id || p.name)}
              isFav={true}
              onOpen={()=>{}}
              onCompareToggle={()=>{}}
              comparing={false}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
          No favorites yet. Go to <a href="/providers" className="font-semibold underline">Suppliers</a> and tap “Save”.
        </div>
      )}
    </section>
  );
}
