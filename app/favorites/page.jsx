// app/favorites/page.jsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import FavoritesClient from "./FavoritesClient";

export default function Page() {
  return <FavoritesClient />;
}
