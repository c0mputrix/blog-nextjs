import Link from "next/link";
import { formatarData, getArtigos } from "@/lib/artigos";

// Estratégia de renderização: SSG.
// A página inicial é gerada uma única vez, no build.
export const dynamic = "force-static";

// Server Component assíncrono: os dados são buscados no servidor,
// sem useEffect e sem useState.
export default async function HomePage() {
  const artigos = await getArtigos();

  return (
    <>
      <section className="hero">
        <h1>Artigos</h1>
        <p>
          Conteúdos sobre rotas dinâmicas, Server Components, estratégias de
          renderização e SEO no Next.js.
        </p>
      </section>

      {artigos.length === 0 ? (
        <p className="vazio">Nenhum artigo publicado ainda.</p>
      ) : (
        <ul className="lista-artigos">
          {artigos.map((artigo) => (
            <li key={artigo.slug}>
              <Link href={`/artigos/${artigo.slug}`} className="card">
                <span className="card-meta">
                  {formatarData(artigo.dataPublicacao)} · {artigo.autor}
                </span>
                <h2>{artigo.titulo}</h2>
                <p>{artigo.resumo}</p>
                <span className="card-link">Ler artigo →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
