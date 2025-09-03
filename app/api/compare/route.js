import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req) {
  try {
    const { providers, criteria } = await req.json();
    if (!Array.isArray(providers) || providers.length === 0) {
      return NextResponse.json({ error: "No providers supplied" }, { status: 400 });
    }
    const AI_URL = process.env.AI_API_URL;
    const AI_KEY = process.env.AI_API_KEY;
    const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
    if (!AI_URL || !AI_KEY) {
      return NextResponse.json({ error: "AI not configured" }, { status: 500 });
    }
    const table = providers.map((p, i) => [
      `#${i+1} ${p.name}`,
      `Category: ${p.categoryLabel || p.category}`,
      `Tags: ${(p.tags || []).join(", ") || "—"}`,
      `Website: ${p.website || "—"}`,
      `Summary: ${p.summary || "—"}`,
      `Discount: ${p.discount?.label || "—"}`
    ].join("\n")).join("\n\n");

    const system = "You compare UK moving-industry suppliers for removal companies. Be specific, concise, and unbiased.";
    const user = `Compare these suppliers against the buyer's criteria.
Criteria: ${criteria || "not provided"}
Suppliers:
${table}

Return:
- A short "Best for..." line for each supplier
- Pros & Cons bullets per supplier
- A final recommendation (1–2 sentences)
Keep it under 250 words.`;

    const payload = {
      model: AI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature: 0.2,
    };

    const r = await fetch(AI_URL, {
      method: "POST",
      headers: { "Authorization": `Bearer ${AI_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const txt = await r.text();
      return NextResponse.json({ error: `AI error: ${txt}` }, { status: 500 });
    }
    const data = await r.json();
    const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || JSON.stringify(data);
    return NextResponse.json({ ok: true, content });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
