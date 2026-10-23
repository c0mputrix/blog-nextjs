import slugify from "slugify";
import artigosLocais from "@/data/artigos.json";

/**
 * URL da API no CrudCrud.
 * O endpoint gratuito expira depois de um tempo. Se isso acontecer,
 * gere um novo em https://crudcrud.com, troque só esta linha,
 * rode "npm run seed" e faça um novo deploy.
 */
export const API_URL =
  "https://crudcrud.com/api/3ee9836eea964f83b6308574017773f6/artigos";

/** Formato de um artigo como vem da fonte de dados (API ou JSON). */
type ArtigoBruto = {
  _id?: string;
  titulo: string;
  autor: string;
  dataPublicacao: string;
  resumo: string;
  conteudo: string;
};

/** Artigo já pronto para uso nas páginas, com o slug gerado. */
export type Artigo = ArtigoBruto & {
  slug: string;
};

/** Gera o slug a partir do título: "Rotas com Slug" -> "rotas-com-slug". */
export function gerarSlug(titulo: string): string {
  return slugify(titulo, { lower: true, strict: true, locale: "pt", trim: true });
}

function ehArtigoValido(item: unknown): item is ArtigoBruto {
  if (typeof item !== "object" || item === null) return false;
  const a = item as Record<string, unknown>;
  return (
    typeof a.titulo === "string" &&
    typeof a.autor === "string" &&
    typeof a.dataPublicacao === "string" &&
    typeof a.resumo === "string" &&
    typeof a.conteudo === "string"
  );
}

/** Busca os artigos no CrudCrud. Retorna null se a API falhar ou estiver vazia. */
async function buscarNaApi(): Promise<ArtigoBruto[] | null> {
  try {
    const resposta = await fetch(API_URL, {
      cache: "force-cache", // resultado guardado no build (SSG)
      signal: AbortSignal.timeout(8000),
    });

    if (!resposta.ok) {
      console.warn(`[artigos] API respondeu ${resposta.status}. Usando JSON local.`);
      return null;
    }

    const dados: unknown = await resposta.json();
    if (!Array.isArray(dados)) return null;

    const validos = dados.filter(ehArtigoValido);
    return validos.length > 0 ? validos : null;
  } catch (erro) {
    console.warn("[artigos] Não foi possível acessar a API. Usando JSON local.", erro);
    return null;
  }
}

/**
 * Retorna todos os artigos, do mais recente para o mais antigo.
 * Fonte principal: API do CrudCrud. Reserva: data/artigos.json.
 */
export async function getArtigos(): Promise<Artigo[]> {
  const brutos = (await buscarNaApi()) ?? (artigosLocais as ArtigoBruto[]);

  // Gera o slug de cada artigo e remove duplicados (mesmo título).
  const porSlug = new Map<string, Artigo>();
  for (const artigo of brutos) {
    const slug = gerarSlug(artigo.titulo);
    if (!porSlug.has(slug)) {
      porSlug.set(slug, { ...artigo, slug });
    }
  }

  return [...porSlug.values()].sort((a, b) =>
    b.dataPublicacao.localeCompare(a.dataPublicacao)
  );
}

/** Retorna um artigo pelo slug, ou undefined se não existir. */
export async function getArtigoPorSlug(slug: string): Promise<Artigo | undefined> {
  const artigos = await getArtigos();
  return artigos.find((artigo) => artigo.slug === slug);
}

/** Formata "2026-10-23" como "23 de outubro de 2026". */
export function formatarData(data: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(data));
}
