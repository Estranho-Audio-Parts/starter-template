#!/usr/bin/env node
/**
 * Copia o template (a raiz deste repo) para cli/template/, que e o que vai
 * dentro do pacote npm.
 *
 * Rodar sempre antes de publicar. O `prepack` do cli/package.json ja faz isso.
 *
 * Por que copiar em vez de publicar a raiz direto: o pacote npm precisa conter
 * o template como DADO (arquivos a serem copiados), nao como projeto instalavel.
 */
import { cp, rm, mkdir, readdir, rename, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const destino = join(raiz, "cli", "template");

/** Nao vao para o template. */
const IGNORAR = new Set([
  ".git",
  ".next",
  "node_modules",
  "cli",
  "scripts",
  ".env",
  ".env.local",
  "package-lock.json",
  "next-env.d.ts",
  ".DS_Store",
  ".vercel",
  "tsconfig.tsbuildinfo",
]);

await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });

const entradas = await readdir(raiz, { withFileTypes: true });
let copiados = 0;

for (const entrada of entradas) {
  if (IGNORAR.has(entrada.name)) continue;
  await cp(join(raiz, entrada.name), join(destino, entrada.name), {
    recursive: true,
  });
  copiados++;
}

// O npm remove qualquer arquivo chamado .gitignore do pacote publicado.
// Guardamos com outro nome e o CLI renomeia de volta ao criar o projeto.
for (const [de, para] of [
  [".gitignore", "_gitignore"],
  ["supabase/.gitignore", "supabase/_gitignore"],
]) {
  const origem = join(destino, de);
  if (existsSync(origem)) await rename(origem, join(destino, para));
}

// Marca a versao do template usada, para o time de devs saber a origem.
await writeFile(
  join(destino, ".template-version"),
  `${JSON.parse(await import("node:fs").then((fs) => fs.promises.readFile(join(raiz, "cli", "package.json"), "utf8"))).version}\n`,
);

console.log(`template sincronizado: ${copiados} entradas em cli/template/`);
