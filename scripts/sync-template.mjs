#!/usr/bin/env node
/**
 * Copia o template (a raiz deste repo) para cli/template/, que e o que vai
 * dentro do pacote npm. O `prepack` do cli/package.json roda isto sozinho.
 *
 * A lista do que copiar vem do GIT, nao do disco. Isso e proposital: qualquer
 * arquivo ignorado pelo .gitignore fica automaticamente fora do pacote.
 * A versao anterior varria o disco e chegou a empacotar supabase/.temp/, que
 * guarda segredos do ambiente local — exatamente o tipo de vazamento que uma
 * lista de exclusao escrita a mao deixa passar.
 */
import { cp, rm, mkdir, rename, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const destino = join(raiz, "cli", "template");

/** Pastas do repo que sao do TEMPLATE, e nao do sistema que o funcionario cria. */
const SO_DO_TEMPLATE = [
  "cli/", // o proprio gerador
  "scripts/", // este script
  "docs/examples/", // capturas de referencia, 3,4 MB — o projeto ja nasce no padrao
  ".github/", // o CI do template; o projeto ganha o seu, mais simples
  "LICENSE", // a licenca e do template, nao do sistema do funcionario
  "README.md", // o README da raiz e a vitrine publica; o projeto ganha o seu
];

const versionados = execFileSync("git", ["ls-files", "-z"], {
  cwd: raiz,
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean)
  .filter((arquivo) => !SO_DO_TEMPLATE.some((p) => arquivo.startsWith(p)));

await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });

for (const arquivo of versionados) {
  const alvo = join(destino, arquivo);
  await mkdir(dirname(alvo), { recursive: true });
  await cp(join(raiz, arquivo), alvo);
}

// O README do projeto fala com o funcionario que vai construir o sistema.
// O da raiz fala com quem chega no repositorio publico — sao publicos diferentes.
await cp(
  join(raiz, "cli", "extras", "README-do-projeto.md"),
  join(destino, "README.md"),
);

// O projeto gerado ganha o proprio CI, mais simples que o do template.
await mkdir(join(destino, ".github", "workflows"), { recursive: true });
await cp(
  join(raiz, "cli", "extras", "ci-do-projeto.yml"),
  join(destino, ".github", "workflows", "ci.yml"),
);

// O npm remove qualquer arquivo chamado .gitignore do pacote publicado.
// Guardamos com outro nome; o CLI renomeia de volta ao criar o projeto.
for (const [de, para] of [
  [".gitignore", "_gitignore"],
  ["supabase/.gitignore", "supabase/_gitignore"],
]) {
  const origem = join(destino, de);
  if (existsSync(origem)) await rename(origem, join(destino, para));
}

// Marca a versao do template, para o time de devs saber a origem do projeto.
const pkg = JSON.parse(
  await readFile(join(raiz, "cli", "package.json"), "utf8"),
);
await writeFile(join(destino, ".template-version"), `${pkg.version}\n`);

console.log(`template sincronizado: ${versionados.length} arquivos versionados`);
