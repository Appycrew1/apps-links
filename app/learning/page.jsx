"use client";
import React from "react";

const learningSeed = [
  { id:"the-mover", type:"magazine", title:"The Mover – UK & global industry news", href:"https://www.themover.co.uk/", blurb:"Independent news, features and insights for the moving & relocation industry." },
  { id:"bar-news", type:"article", title:"British Association of Removers – News & Guidance", href:"https://bar.co.uk/news/", blurb:"Updates from the UK’s leading removals trade association, including best practice and events." },
  { id:"movers-storers", type:"event", title:"Movers & Storers Show – UK trade expo", href:"https://moversandstorershow.com/", blurb:"The UK’s biggest removals & storage trade show with seminars and suppliers." },
];

export default function LearningPage(){
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Learning Center</h2>
      <p className="mb-8 max-w-2xl text-gray-600">Interviews, how-to guides, and marketing tips to help your moving business grow.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {learningSeed.map(i => (
          <a key={i.id} href={i.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">{i.type}</div>
            <div className="text-base font-semibold text-gray-900 group-hover:underline">{i.title}</div>
            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{i.blurb}</p>
            <div className="mt-3 text-sm font-semibold text-gray-800">Read / Listen ↗</div>
          </a>
        ))}
      </div>
    </section>
  );
}
