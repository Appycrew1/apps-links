"use client";
import React from "react";
import { providersSeed } from "../utils/seeds";
import { getLogo } from "../utils/getLogo";

export default function Page() {
  const featured = providersSeed.filter(p=>p.is_featured).slice(0,6);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            <span>Supplier Directory</span><span aria-hidden>•</span><span>UK movers</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Linking movers with suppliers.</h1>
          <p className="mt-4 max-w-xl text-gray-600">Browse vetted UK providers, compare options, and claim partner discounts. Submit your listing in minutes.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/providers" className="rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white">Browse UK Suppliers</a>
            <a href="/submit" className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900">Submit A Listing</a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-inner">
            <div className="grid h-full grid-rows-3 gap-3">
              <div className="rounded-2xl bg-white shadow-sm" />
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white shadow-sm" />
                <div className="rounded-2xl bg-white shadow-sm" />
                <div className="rounded-2xl bg-white shadow-sm" />
              </div>
              <div className="rounded-2xl bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {featured.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Featured suppliers</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(p => (
              <div key={p.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-3">
                  <img src={getLogo(p)} alt="" className="h-8 w-8 rounded-full border border-amber-200 bg-white"/>
                  <div className="font-semibold">{p.name}</div>
                </div>
                <div className="text-sm text-gray-700">{p.summary}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
