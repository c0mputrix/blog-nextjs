import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatarData, getArtigoPorSlug, getArtigos } from "@/lib/artigos";

// Estratégia de renderização: SSG.
// Todas as páginas de artigo são geradas no build.
export const dynamic = "force-static";

// Slugs que não foram gerados no build retornam 404.
export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string }>;
};

// Informa ao Next.js quais URLs /artigos/[slug] devem ser geradas no build.
export async function generateStaticParams() {
  const artigos = await getArtigos();
  return artigos.map((artigo) => ({ slug: artigo.slug }));
}

// Metadados de SEO únicos para cada artigo.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artigo = await getArtigoPorSlug(slug);

  if (!artigo) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: artigo.titulo,
    description: artigo.resumo,
    authors: [{ name: artigo.autor }],
    openGraph: {
      title: artigo.titulo,
      description: artigo.resumo,
      type: "article",
      publishedTime: artigo.dataPublicacao,
      authors: [artigo.autor],
    },
  };
}

// Server Component assíncrono: busca o artigo direto no servidor.
export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params;
  const artigo = await getArtigoPorSlug(slug);

  if (!artigo) {
    notFound();
  }

  const paragrafos = artigo.conteudo.split("\n\n");

  return (
    <article className="artigo">
      <Link href="/" className="voltar">
        ← Todos os artigos
      </Link>

      <header className="artigo-cabecalho">
        <h1>{artigo.titulo}</h1>
        <p className="artigo-meta">
          Por <strong>{artigo.autor}</strong> ·{" "}
          <time dateTime={artigo.dataPublicacao}>
            {formatarData(artigo.dataPublicacao)}
          </time>
        </p>
        <p className="artigo-resumo">{artigo.resumo}</p>
      </header>

      <div className="artigo-conteudo">
        {paragrafos.map((paragrafo, indice) => (
          <p key={indice}>{paragrafo}</p>
        ))}
      </div>
    </article>
  );
}
