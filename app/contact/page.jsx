"use client";
import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Button, TextArea, TextInput } from "../../components/UI";

export default function ContactPage(){
  const [values, set] = useState({ name:"", email:"", message:"", honey:"" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault(); setErr("");
    if (values.honey) return;
    try {
      if (supabase) {
        const { error } = await supabase.from("contact_messages").insert([{ name: values.name, email: values.email, message: values.message }]);
        if (error) throw error;
        setSent(true);
      } else {
        const drafts = JSON.parse(localStorage.getItem("contact_messages") || "[]");
        drafts.push({ ...values, id: `local-${Date.now()}` });
        localStorage.setItem("contact_messages", JSON.stringify(drafts));
        setSent(true);
      }
    } catch (e) { setErr(e.message || "Could not send message"); }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Contact Us</h2>
      {sent ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900">
          <div className="mb-2 text-lg font-semibold">Message sent!</div>
          <p className="text-sm">We will reply to your email shortly.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {err && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
          <div className="hidden"><input value={values.honey} onChange={(e)=>set({ ...values, honey:e.target.value })} aria-hidden/></div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-800">Name</label>
            <TextInput value={values.name} onChange={(e)=>set({ ...values, name:e.target.value })} required/>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-800">Email</label>
            <TextInput type="email" value={values.email} onChange={(e)=>set({ ...values, email:e.target.value })} required/>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-800">Message</label>
            <TextArea value={values.message} onChange={(e)=>set({ ...values, message:e.target.value })} required/>
          </div>
          <div className="pt-2"><Button type="submit">Send Message</Button></div>
        </form>
      )}
    </section>
  );
}
