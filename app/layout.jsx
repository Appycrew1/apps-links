import "./globals.css";

export const metadata = {
  title: "Appy Link – Linking movers with suppliers",
  description: "UK suppliers directory for removals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">Appy Link</a>
            <nav className="flex gap-4 text-sm">
              <a className="hover:underline" href="/providers">Suppliers</a>
              <a className="hover:underline" href="/discounts">Discounts</a>
              <a className="hover:underline" href="/learning">Learning</a>
              <a className="hover:underline" href="/favorites">Favorites</a>
              <a className="hover:underline" href="/compare">Compare</a>
              <a className="hover:underline" href="/submit">Submit</a>
              <a className="hover:underline" href="/contact">Contact</a>
              <a className="hover:underline" href="/admin">Admin</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-600 flex justify-between">
            <span>© {new Date().getFullYear()} Appy Link</span>
            <span>Made for movers</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
