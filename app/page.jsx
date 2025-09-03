export default function Home(){
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">Appy Link</h1>
      <p className="mt-3 text-lg text-gray-700">Linking movers with suppliers — compare, save favourites, and get AI-assisted recommendations.</p>
      <div className="mt-6 flex gap-3">
        <a href="/providers" className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black">Browse Suppliers</a>
        <a href="/submit" className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50">Submit a Supplier</a>
      </div>
    </section>
  );
}
