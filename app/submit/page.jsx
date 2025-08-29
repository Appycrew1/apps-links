"use client";
import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Button, TextArea, TextInput } from "../../components/UI";
import { categoriesSeed } from "../../utils/seeds";

export default function SubmitListingPage(){
  const [values, set] = useState({ name:"", category:"software", website:"", description:"", discount:"", honey:"" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault(); setErr("");
    if (values.honey) return;
    const last = +localStorage.getItem("last_submit_ts") || 0;
    if (Date.now() - last < 30000) { setErr("Please wait a moment before submitting again."); return; }

    try {
      if (supabase) {
        const { error } = await supabase.from("listing_submissions").insert([{
          company_name: values.name,
          category_id: values.category,
          website: values.website,
          description: values.description,
          discount: values.discount
        }]);
        if (error) throw error;
        setDone(true);
        localStorage.setItem("last_submit_ts", String(Date.now()));
      } else {
        const drafts = JSON.parse(localStorage.getItem("draft_listings") || "[]");
        drafts.push({ ...values, id: `draft-${Date.now()}` });
        localStorage.setItem("draft_listings", JSON.stringify(drafts));
        setDone(true);
      }
    } catch (e) { setErr(e.message || "Submission failed"); }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Submit A Listing</h2>
      {done ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900">
          <div className="mb-2 text-lg font-semibold">Thanks! Your listing was submitted.</div>
          <p className="text-sm">We’ll review and publish if approved.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {err && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
          <div className="hidden"><input value={values.honey} onChange={(e)=>set({ ...values, honey:e.target.value })} aria-hidden/></div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-800">Company Name</label>
            <TextInput value={values.name} onChange={(e)=>set({ ...values, name:e.target.value })} required/>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">Category</label>
              <select className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm"
                value={values.category} onChange={(e)=>set({ ...values, category:e.target.value })}>
                {categoriesSeed.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">Website</label>
              <TextInput type="url" placeholder="https://" value={values.website} onChange={(e)=>set({ ...values, website:e.target.value })}/>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-800">Short Description</label>
            <TextArea value={values.description} onChange={(e)=>set({ ...values, description:e.target.value })}/>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-800">Discount (optional)</label>
            <TextInput placeholder="e.g., 50% off second month" value={values.discount} onChange={(e)=>set({ ...values, discount:e.target.value })}/>
          </div>

          <div className="pt-2">
            <Button type="submit">Submit Listing</Button>
          </div>
        </form>
      )}
    </section>
  );
}
