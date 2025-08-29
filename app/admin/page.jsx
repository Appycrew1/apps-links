"use client";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Button, OutlineButton, TextInput } from "../../components/UI";

const BOOTSTRAP = process.env.NEXT_PUBLIC_BOOTSTRAP_ADMIN_EMAIL?.toLowerCase?.();

export default function AdminPage(){
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session || null);
      setChecking(false);
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s)=> setSession(s || null));
      return () => sub?.subscription?.unsubscribe?.();
    })();
  }, []);

  if (!supabase) return NotConfigured();
  if (checking) return <Section>Checking session…</Section>;
  if (!session) return <Login />;

  return <Dashboard />;
}

/* ---------- Small pieces ---------- */

function NotConfigured(){
  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <h2 className="mb-2 text-2xl font-bold">Supabase not configured</h2>
      <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
        <li>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Vercel (Preview + Production).</li>
        <li>Redeploy.</li>
        <li>Supabase → Auth → URL Config: add <code>{typeof window!=="undefined"?window.location.origin:""}/admin</code> to Redirect URLs.</li>
      </ol>
    </section>
  );
}

function Section({ children }){ return <section className="mx-auto max-w-5xl px-4 py-10">{children}</section>; }

function Login(){
  const [mode, setMode] = useState("magic"); // magic | signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const redirectTo = typeof window !== "undefined" ? window.location.origin + "/admin" : undefined;

  const sendMagic = async (e) => {
    e.preventDefault(); setMsg("");
    const { error } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: redirectTo }});
    setMsg(error ? error.message : "Check your email for a magic link.");
  };
  const signIn = async (e) => {
    e.preventDefault(); setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : "Signed in.");
  };
  const signUp = async (e) => {
    e.preventDefault(); setMsg("");
    const { error } = await supabase.auth.signUp({ email, password, options:{ emailRedirectTo: redirectTo }});
    setMsg(error ? error.message : "Account created. Check your email to confirm if required.");
  };
  const reset = async () => {
    setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setMsg(error ? error.message : "Password reset email sent.");
  };

  return (
    <Section>
      <h2 className="mb-4 text-2xl font-bold">Admin Access</h2>
      <div className="mb-4 inline-flex rounded-2xl border border-gray-300 bg-white p-1 text-sm font-semibold">
        {["magic","signin","signup"].map(m => (
          <button key={m} onClick={()=>setMode(m)} className={`px-3 py-1.5 rounded-xl ${mode===m?"bg-gray-900 text-white":"text-gray-800"}`}>
            {m==="magic"?"Magic Link":m==="signin"?"Password":"Sign Up"}
          </button>
        ))}
      </div>

      {mode==="magic" && (
        <form onSubmit={sendMagic} className="space-y-3 max-w-sm">
          <TextInput type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <Button type="submit">Send magic link</Button>
        </form>
      )}
      {mode==="signin" && (
        <form onSubmit={signIn} className="space-y-3 max-w-sm">
          <TextInput type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <TextInput type="password" placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <div className="flex gap-2">
            <Button type="submit">Sign in</Button>
            <OutlineButton type="button" onClick={reset} disabled={!email}>Forgot password?</OutlineButton>
          </div>
        </form>
      )}
      {mode==="signup" && (
        <form onSubmit={signUp} className="space-y-3 max-w-sm">
          <TextInput type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <TextInput type="password" placeholder="Create a strong password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <Button type="submit">Create account</Button>
        </form>
      )}

      {msg && <p className="mt-3 text-sm text-gray-700">{msg}</p>}
    </Section>
  );
}

function Dashboard(){
  const [tab, setTab] = useState("submissions");
  const [subs, setSubs] = useState([]);
  const [prov, setProv] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const load = async () => {
    setLoading(true);
    const [sRes, pRes, cRes] = await Promise.all([
      supabase.from("listing_submissions").select("*").order("created_at",{ascending:false}),
      supabase.from("providers").select("*").order("created_at",{ascending:false}),
      supabase.from("categories").select("*").order("label",{ascending:true}),
    ]);
    setSubs(sRes.data||[]); setProv(pRes.data||[]); setCats(cRes.data||[]); setLoading(false);
  };

  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ (async ()=>{
    try{
      const { data:{ user } } = await supabase.auth.getUser();
      if (!user) { setIsAdmin(false); return; }
      const { data: prof } = await supabase.from("profiles").select("role,email").eq("id", user.id).maybeSingle();
      const boot = BOOTSTRAP && user.email?.toLowerCase() === BOOTSTRAP;
      setIsAdmin(boot || prof?.role === "admin");
    }catch{ setIsAdmin(false); }
  })(); },[]);

  // actions
  const approve = async (id)=>{ await supabase.rpc("approve_submission",{ sub_id:id, publish:true }); await load(); };
  const reject  = async (id)=>{ await supabase.from("listing_submissions").update({ status:"rejected" }).eq("id",id); await load(); };

  const toggleShow = async (id,on)=>{ await supabase.from("providers").update({ is_active:on }).eq("id",id); await load(); };
  const delProv    = async (id)=>{ if (confirm("Delete provider?")) { await supabase.from("providers").delete().eq("id",id); await load(); } };
  const addProv    = async ()=>{ const name=prompt("Company name?"); if(!name)return; const website=prompt("Website (https://)")||null; const category_id=prompt("Category id", cats[0]?.id || "software")||"software"; await supabase.from("providers").insert([{ name, website, category_id, is_active:false }]); await load(); };
  const editProv   = async (row)=>{ const name=prompt("Name",row.name)??row.name; const website=prompt("Website",row.website??"")??row.website; const category_id=prompt("Category id",row.category_id??"")??row.category_id; const logo=prompt("Logo URL",row.logo??"")??row.logo; const tier=prompt("Tier (free/featured/sponsor)",row.tier??"free")??row.tier; const is_featured=tier!=="free"?true:row.is_featured; await supabase.from("providers").update({ name,website,category_id,logo,tier,is_featured }).eq("id",row.id); await load(); };

  const addCat = async ()=>{ const id=prompt("Category id (letters only)"); if(!id)return; const label=prompt("Label",id)||id; await supabase.from("categories").insert([{ id,label }]); await load(); };
  const editCat = async (row)=>{ const idNew=prompt("Category id",row.id)??row.id; const label=prompt("Label",row.label)??row.label; if(idNew!==row.id){ await supabase.from("categories").insert([{ id:idNew, label }]); await supabase.from("providers").update({ category_id:idNew }).eq("category_id",row.id); await supabase.from("categories").delete().eq("id",row.id); } else { await supabase.from("categories").update({ label }).eq("id",row.id); } await load(); };
  const deleteCat = async (row)=>{ const inUse = prov.filter(p=>p.category_id===row.id).length; if(inUse>0){ alert(`Cannot delete: ${inUse} provider(s) use this category.`); return; } if(confirm(`Delete category "${row.label}"?`)){ await supabase.from("categories").delete().eq("id",row.id); await load(); } };

  if (loading) return <Section>Loading…</Section>;

  return (
    <Section>
      {!isAdmin && <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">You’re signed in but not marked as <strong>admin</strong>. Read-only features will work; writes may be blocked.</div>}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin</h2>
        <div className="flex flex-wrap gap-2">
          <OutlineButton onClick={()=>setTab("submissions")}>Submissions</OutlineButton>
          <OutlineButton onClick={()=>setTab("suppliers")}>Suppliers</OutlineButton>
          <OutlineButton onClick={()=>setTab("categories")}>Categories</OutlineButton>
          <Button onClick={async ()=>{ await supabase.auth.signOut(); location.reload(); }}>Sign out</Button>
        </div>
      </div>

      {tab==="submissions" && (
        <div className="space-y-3">
          {subs.length===0 && <div className="rounded-xl border border-dashed border-gray-300 p-6 text-gray-600">No submissions.</div>}
          {subs.map(s=>(
            <div key={s.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{s.company_name}</div>
                <span className="text-xs">{s.status ?? "new"}</span>
              </div>
              <div className="mt-1 text-sm text-gray-600">{s.website}</div>
              <div className="mt-2 text-sm">{s.description}</div>
              <div className="mt-3 flex gap-2">
                <Button onClick={()=>approve(s.id)}>Approve & Publish</Button>
                <OutlineButton onClick={()=>reject(s.id)}>Reject</OutlineButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="suppliers" && (
        <div className="space-y-4">
          <div className="flex justify-end"><Button onClick={addProv}>Add Provider</Button></div>
          <div className="grid grid-cols-1 gap-3">
            {prov.map(p=>(
              <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={p.logo || ""} className="h-8 w-8 rounded-full border border-gray-200 bg-white" alt=""/>
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.category_id} · {p.website || "—"} {p.is_featured?"· Featured":""} {p.tier && p.tier!=="free"?`· ${p.tier}`:""}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <OutlineButton onClick={()=>editProv(p)}>Edit</OutlineButton>
                    <OutlineButton onClick={()=>toggleShow(p.id,!p.is_active)}>{p.is_active?"Hide":"Show"}</OutlineButton>
                    <Button onClick={()=>delProv(p.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
            {prov.length===0 && <div className="rounded-xl border border-dashed border-gray-300 p-6 text-gray-600">No providers yet.</div>}
          </div>
        </div>
      )}

      {tab==="categories" && (
        <div className="space-y-4">
          <div className="flex justify-end"><Button onClick={addCat}>Add Category</Button></div>
          <div className="grid grid-cols-1 gap-3">
            {cats.map(c=>(
              <div key={c.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{c.label}</div>
                    <div className="text-xs text-gray-500">id: {c.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <OutlineButton onClick={()=>editCat(c)}>Edit</OutlineButton>
                    <Button onClick={()=>deleteCat(c)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
            {cats.length===0 && <div className="rounded-xl border border-dashed border-gray-300 p-6 text-gray-600">No categories.</div>}
          </div>
        </div>
      )}
    </Section>
  );
}
