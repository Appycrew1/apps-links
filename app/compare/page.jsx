// app/compare/page.jsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import CompareClient from "./CompareClient";

export default function Page() {
  return <CompareClient />;
}
