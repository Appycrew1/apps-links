"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React, { useEffect, useMemo, useReducer, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { categoriesSeed, providersSeed } from "../../utils/seeds";
import { Button, OutlineButton, Badge, TextInput } from "../../components/UI";
import ProviderCard from "../../components/ProviderCard";
import { classNames, useLocalStorage } from "../_hooks";
import { getLogo } from "../../utils/getLogo";

const initialState = {
  q: "",
  category: "all",
  tags: new Set(),
  onlyDiscounts: false,
  sort: "relevance",
};
function reducer(state, action) {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, q: action.q };
    case "SET_CATEGORY":
      return { ...state, category: action.category };
    case "TOGGLE_TAG": {
      const tags = new Set(state.tags);
      tags.has(action.tag) ? tags.delete(action.tag) : tags.add(action.tag);
      return { ...state, tags };
    }
    case "TOGGLE_ONLY_DISCOUNTS":
      return { ...state, onlyDiscounts: !state.onlyDiscounts };
    case "SET_SORT":
      return { ...state, sort: action.sort };
    case "RESET_FILTERS":
      return { ...initialState };
    default:
      return state;
  }
}

function useProvidersAndCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(categoriesSeed);
  const [providers, setProviders] = useState(providersSeed);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const [{ data: cats, error: ce }, { data: provs, error: pe }] =
          await Promise.all([
            supabase.from("categories").select("id,label").order("label"),
            supabase
              .from("providers")
              .select("*")
              .eq("is_active", true)
              .order("is_featured", { ascending: false })
              .order("name"),
          ]);
        if (ce) throw ce;
        if (pe) throw pe;
        if (!mounted) return;

        const catList = cats?.length ? cats : categoriesSeed;
        setCategories(catList);

        const catMap = new Map(catList.map((c) => [c.id, c.label]));
        const src = provs?.length ? provs : providersSeed;
        setProviders(
          src.map((p) => ({
            id: String(p.id || p.name), // stable string id
            name: p.name,
            category: p.category_id || p.category,
            categoryLabel: catMap.get(p.category_id || p.category),
            tags: p.tags || [],
            website: p.website || "",
            summary: p.summary || "",
            details: p.details || "",
            discount: p.discount_label
              ? { label: p.discount_label, details: p.discount_details }
              : p.discount || null,
            logo: p.logo || "",
            is_featured:
              !!p.is_featured ||
              (p.feature_until ? new Date(p.feature_until) > new Date() : false),
            tier: p.tier || "free",
          }))
        );
      } catch (e) {
        setError(e.message);
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { loading, categories, providers, error };
}

export default function ProvidersPage() {
  const { loading, categories, providers, error } = useProvidersAndCategories();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [favorites, setFavorites] = useLocalStorage("favorites_providers", []);
  const [compare, setCompare] = useLocalStorage("compare_providers", []);
  const [modal, setModal] = useState(null);

  const allTags = useMemo(() => {
    const s = new Set();
    providers.forEach((p) => p.tags?.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [providers]);

  const results = useMemo(() => {
    let r = providers.slice();
    if (state.category !== "all")
      r = r.filter((p) => p.category === state.category);
    if (state.onlyDiscounts) r = r.filter((p) => p.discount);
    if (state.tags.size)
      r = r.filter((p) => p.tags?.some((t) => state.tags.has(t)));
    if (state.q.trim()) {
      const q = state.q.toLowerCase();
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q) ||
          p.details?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (state.sort === "name-asc")
      r.sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === "name-desc")
      r.sort((a, b) => b.name.localeCompare(a.name));
    if (state.sort === "relevance")
      r.sort(
        (a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
      );
    return r;
  }, [state, providers]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Browse Suppliers</h2>
        <div className="flex items-center gap-2">
          <OutlineButton onClick={() => dispatch({ type: "RESET_FILTERS" })}>
            Reset
          </OutlineButton>
          <OutlineButton onClick={() => (location.href = "/favorites")}>
            Favorites
          </OutlineButton>
          <Button onClick={() => (location.href = "/compare")}>Compare</Button>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-3 text-sm text-gray-500">
        <span>
          {loading
            ? "Loading live data…"
            : error
            ? `Using local data (error: ${error})`
            : "Live data loaded"}
        </span>
        <span className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-xs">
          Saved: {favorites.length} · Compare: {compare.length}
        </span>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-12">
        <div className="md:col-span-9">
          <div className="sticky top-4 z-10 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex flex-col items-stretch gap-3 sm:flex-row">
              <div className="relative flex-1">
                <TextInput
                  placeholder="Search by name, feature, or tag…"
                  value={state.q}
                  onChange={(e) =>
                    dispatch({ type: "SET_QUERY", q: e.target.value })
                  }
                />
                <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 sm:block">
                  🔎
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <select
                  value={state.category}
                  onChange={(e) =>
                    dispatch({ type: "SET_CATEGORY", category: e.target.value })
                  }
                  className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  value={state.sort}
                  onChange={(e) =>
                    dispatch({ type: "SET_SORT", sort: e.target.value })
                  }
                  className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="name-asc">Name A→Z</option>
                  <option value="name-desc">Name Z→A</option>
                </select>
                <label className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={state.onlyDiscounts}
                    onChange={() =>
                      dispatch({ type: "TOGGLE_ONLY_DISCOUNTS" })
                    }
                  />{" "}
                  Only discounts
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => {
              const id = String(p.id || p.name);
              const isFav = favorites.includes(id);
              const inCompare = compare.includes(id);

              const toggleFav = () => {
                const next = isFav
                  ? favorites.filter((x) => x !== id)
                  : [...favorites, id];
                setFavorites(next);
              };
              const toggleCompare = () => {
                const next = inCompare
                  ? compare.filter((x) => x !== id)
                  : compare.length < 3
                  ? [...compare, id]
                  : compare;
                setCompare(next);
              };

              return (
                <ProviderCard
                  key={id}
                  p={p}
                  onOpen={setModal}
                  onToggleFav={toggleFav}
                  isFav={isFav}
                  onCompareToggle={toggleCompare}
                  comparing={inCompare}
                />
              );
            })}
          </div>

          {!loading && results.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
              No results. Try different filters.
            </div>
          )}
        </div>

        <aside className="md:col-span-3">
          <div className="sticky top-4 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Filter by Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => {
                  const active = state.tags.has(t);
                  return (
                    <button
                      key={t}
                      onClick={() => dispatch({ type: "TOGGLE_TAG", tag: t })}
                      className={classNames(
                        "rounded-full border px-3 py-1 text-xs font-semibold",
                        active
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={getLogo(modal)}
                  alt=""
                  className="h-10 w-10 rounded-full border border-gray-200 bg-white"
                />
                <h3 className="text-xl font-semibold text-gray-900">
                  {modal.name}
                </h3>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="mb-3 flex flex-wrap gap-1">
              <Badge>{modal.categoryLabel || modal.category}</Badge>
              {modal.tags?.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
              {modal.is_featured && (
                <Badge color="bg-yellow-100 text-yellow-800">Featured</Badge>
              )}
              {modal.discount && (
                <Badge color="bg-green-100 text-green-800">
                  {modal.discount.label}
                </Badge>
              )}
            </div>
            <p className="mb-4 text-gray-700">
              {modal.details || modal.summary}
            </p>
            {modal.website && (
              <a
                href={modal.website}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Visit Website ↗
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
