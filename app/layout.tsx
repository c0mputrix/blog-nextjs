import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Blog Next.js | Leonardo Domingues",
    template: "%s | Blog Next.js",
  },
  description:
    "Artigos sobre Next.js, App Router, Server Components, renderização e SEO.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="topo">
          <div className="container topo-conteudo">
            <Link href="/" className="logo">
              Blog<span>.next</span>
            </Link>
            <span className="topo-descricao">Next.js na prática</span>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="rodape">
          <div className="container">
            Feito com Next.js App Router · Leonardo Domingues
          </div>
        </footer>
      </body>
    </html>
  );
}
