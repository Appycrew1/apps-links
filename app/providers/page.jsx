// app/providers/page.jsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import ProvidersClient from "./ProvidersClient";

export default function Page() {
  // No React hooks here. This stays server-only and forces runtime rendering.
  return <ProvidersClient />;
}
