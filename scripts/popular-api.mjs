// Envia os artigos de data/artigos.json para a API do CrudCrud.
// Uso: npm run seed
// Artigos com título já cadastrado na API são ignorados (não duplica).

import { readFile } from "node:fs/promises";

// Mantenha igual à API_URL de lib/artigos.ts
const API_URL =
  "https://crudcrud.com/api/3ee9836eea964f83b6308574017773f6/artigos";

const arquivo = new URL("../data/artigos.json", import.meta.url);
const artigos = JSON.parse(await readFile(arquivo, "utf-8"));

const respostaAtual = await fetch(API_URL);
if (!respostaAtual.ok) {
  console.error(
    `Erro ao acessar a API (status ${respostaAtual.status}). ` +
      "O endpoint pode ter expirado: gere um novo em https://crudcrud.com"
  );
  process.exit(1);
}

const existentes = await respostaAtual.json();
const titulosExistentes = new Set(existentes.map((a) => a.titulo));

let enviados = 0;
for (const artigo of artigos) {
  if (titulosExistentes.has(artigo.titulo)) {
    console.log(`- Já existe: ${artigo.titulo}`);
    continue;
  }

  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(artigo),
  });

  if (resposta.ok) {
    enviados++;
    console.log(`+ Enviado: ${artigo.titulo}`);
  } else {
    console.error(`x Falhou (${resposta.status}): ${artigo.titulo}`);
  }
}

console.log(`\nPronto! ${enviados} artigo(s) enviado(s) para a API.`);
