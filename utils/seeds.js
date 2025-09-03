export const categoriesSeed = [
  { id: "software", label: "Software" },
  { id: "crm", label: "CRM" },
];

export const providersSeed = [
  {
    id: "seed-1",
    name: "Sample CRM",
    category: "crm",
    categoryLabel: "CRM",
    tags: ["crm", "jobs"],
    website: "https://example.com",
    summary: "Fallback provider (will be replaced by live data).",
    details: "Only used if Supabase is not configured.",
    discount: { label: "10% off" },
    logo: "",
    is_featured: true,
    tier: "free",
  },
];
