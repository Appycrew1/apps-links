// app/compare/CompareClient.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { providersSeed, categoriesSeed } from "../../utils/seeds";
import { Badge, Button, OutlineButton, TextArea } from "../../components/UI";
import { useLocalStorage } from "../_hooks";
import { getLogo } from "../../utils/getLogo";

// NOTE: DO NOT export `dynamic` or `revalidate` from this file.

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

export default function CompareClient() {
  const { loading, providers, error } = useLiveProviders();
  const [compare, setCompare] = useLocalStorage("compare_providers", []);

  const compareSet = useMemo(() => new Set(compare.map(String)), [compare]);
  const picks = providers.filter(p => compareSet.has(String(p.id || p.name))).slice(0, 3);

  const [criteria, setCriteria] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const remove = (id) => setCompare(compare.filter(x => String(x) !== String(id)));
  const clear  = () => setCompare([]);

  const runAI = async () => {
    setAiBusy(true); setAiResult("");
    try {
      const body = { providers: picks, criteria };
      const r = await fetch("/api/compare", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error || "AI failed");
      setAiResult(data.content);
    } catch (e) {
      setAiResult(`⚠ ${e.message || e}`);
    } finally {
      setAiBusy(false);
    }
  };

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
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {picks.map(p => {
              const id = String(p.id || p.name);
              return (
                <div key={id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src={getLogo(p)} alt="" className="h-8 w-8 rounded-full border border-gray-200 bg-white"/>
                      <h3 className="text-base font-semibold">{p.name}</h3>
                    </div>
                    {p.discount && (<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">{p.discount.label}</span>)}
                  </div>
                  <div className="mb-3 text-xs text-gray-600">{p.categoryLabel}</div>
                  <p className="mb-3 text-sm text-gray-700">{p.summary}</p>
                  <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
                    {(p.tags || []).map(t => <li key={t}>{t}</li>)}
                  </ul>
                  <div className="flex items-center gap-2">
                    {p.website && (
                      <a href={p.website} target="_blank" className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black">Visit ↗</a>
                    )}
                    <button onClick={() => remove(id)} className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">Remove</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">AI comparison</h3>
            <p className="mb-3 text-sm text-gray-600">Tell AI what matters to you (budget, fleet size, features, integrations, contract terms…)</p>
            <TextArea placeholder="e.g., We’re a 10-van firm. Need CRM + route planning. Budget £200/mo. Prefer month-to-month." value={criteria} onChange={e=>setCriteria(e.target.value)} />
            <div className="mt-3 flex items-center gap-2">
              <Button onClick={runAI} disabled={aiBusy || picks.length === 0}>{aiBusy ? "Thinking…" : "Compare with AI"}</Button>
              <span className="text-xs text-gray-500">Compares {picks.length} selected suppliers</span>
            </div>
            {aiResult && (
              <div className="mt-4 whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
                {aiResult}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
          Add up to 3 providers from the <a href="/providers" className="font-semibold underline">Suppliers</a> page to compare here.
        </div>
      )}
    </section>
  );
}
