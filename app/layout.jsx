import "./globals.css";

export const metadata = {
  title: "Appy Link — Linking movers with suppliers",
  description: "Browse vetted UK suppliers for moving companies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  const nav = [
    ["Home", "/"],
    ["Suppliers", "/providers"],
    ["Discounts", "/discounts"],
    ["Learning", "/learning"],
    ["Submit", "/submit"],
    ["Contact", "/contact"],
    ["Admin", "/admin"],
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-content-center rounded-full bg-gray-900 font-black text-white">AL</div>
          <div className="text-sm font-extrabold tracking-wider text-gray-900">Appy Link</div>
        </a>
        <nav className="hidden items-center gap-2 md:flex">
          {nav.map(([label, href]) => (
            <a key={href} href={href} className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">{label}</a>
          ))}
        </nav>
        <div className="md:hidden"><a href="/providers" className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white">Browse</a></div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="grid h-8 w-8 place-content-center rounded-full bg-gray-900 font-black text-white">AL</div>
            <div className="text-sm font-extrabold tracking-wider text-gray-900">Appy Link</div>
          </div>
          <p className="max-w-sm text-sm text-gray-600">Linking movers with suppliers.</p>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold text-gray-900">Explore</div>
          <ul className="space-y-1 text-sm text-gray-700">
            <li><a className="hover:underline" href="/providers">Suppliers</a></li>
            <li><a className="hover:underline" href="/discounts">Discounts</a></li>
            <li><a className="hover:underline" href="/learning">Learning Center</a></li>
            <li><a className="hover:underline" href="/submit">Submit Listing</a></li>
            <li><a className="hover:underline" href="/contact">Contact</a></li>
            <li><a className="hover:underline" href="/admin">Admin</a></li>
          </ul>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold text-gray-900">Newsletter</div>
          <p className="mb-3 text-sm text-gray-600">Get occasional updates and partner discounts.</p>
          <div className="flex gap-2">
            <input placeholder="you@company.com" className="flex-1 rounded-2xl border border-gray-300 px-3 py-2 text-sm"/>
            <button className="rounded-2xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">© {new Date().getFullYear()} Appy Link. All rights reserved.</div>
    </footer>
  );
}
