import Link from "next/link";

export default function NotFound() {
  return (
    <section className="nao-encontrado">
      <h1>Página não encontrada</h1>
      <p>O artigo que você procura não existe ou foi removido.</p>
      <Link href="/" className="card-link">
        ← Voltar para os artigos
      </Link>
    </section>
  );
}
