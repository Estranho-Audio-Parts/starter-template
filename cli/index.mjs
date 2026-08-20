#!/usr/bin/env node
/**
 * Cria um projeto novo a partir do template padrao do grupo.
 *
 *   npx @grupo/criar-sistema meu-sistema
 */
import { cp, readdir, rename, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const AQUI = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(AQUI, "template");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  verde: "\x1b[32m",
  azul: "\x1b[36m",
  amarelo: "\x1b[33m",
  vermelho: "\x1b[31m",
};
const log = (m = "") => console.log(m);
const erro = (m) => console.error(`${c.vermelho}erro:${c.reset} ${m}`);

/** Regras do npm para nome de pasta/pacote. */
function nomeValido(nome) {
  return /^[a-z0-9][a-z0-9-]*$/.test(nome);
}

async function perguntarNome() {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    while (true) {
      const resposta = (
        await rl.question(`${c.bold}Nome do sistema${c.reset} ${c.dim}(ex.: controle-de-frota)${c.reset}: `)
      ).trim();
      if (nomeValido(resposta)) return resposta;
      log(`${c.amarelo}Use apenas letras minusculas, numeros e hifen.${c.reset}`);
    }
  } finally {
    rl.close();
  }
}

async function main() {
  log();
  log(`${c.bold}Template padrao do grupo${c.reset} ${c.dim}Next.js + Supabase${c.reset}`);
  log();

  let nome = process.argv[2];
  if (nome && !nomeValido(basename(nome))) {
    erro(`"${nome}" nao serve como nome. Use letras minusculas, numeros e hifen.`);
    process.exit(1);
  }
  if (!nome) nome = await perguntarNome();

  const destino = resolve(process.cwd(), nome);
  const pastaNome = basename(destino);

  if (existsSync(destino) && (await readdir(destino)).length > 0) {
    erro(`a pasta "${pastaNome}" ja existe e nao esta vazia.`);
    process.exit(1);
  }

  if (!existsSync(TEMPLATE)) {
    erro("template nao encontrado dentro do pacote. Reinstale o CLI.");
    process.exit(1);
  }

  log(`${c.dim}Criando em ${destino}${c.reset}`);
  await mkdir(destino, { recursive: true });
  await cp(TEMPLATE, destino, { recursive: true });

  // Devolve os nomes que o npm nao deixa publicar.
  for (const [de, para] of [
    ["_gitignore", ".gitignore"],
    ["supabase/_gitignore", "supabase/.gitignore"],
  ]) {
    const origem = join(destino, de);
    if (existsSync(origem)) await rename(origem, join(destino, para));
  }

  // Nome do projeto no package.json.
  const pkgPath = join(destino, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
  pkg.name = pastaNome;
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  // .env.local ja pronto para preencher — evita o esquecimento mais comum.
  const exemplo = join(destino, ".env.example");
  const local = join(destino, ".env.local");
  if (existsSync(exemplo) && !existsSync(local)) {
    await cp(exemplo, local);
  }

  const run = (cmd, args) =>
    spawnSync(cmd, args, { cwd: destino, stdio: "ignore", shell: process.platform === "win32" });

  log(`${c.dim}Iniciando o repositorio git...${c.reset}`);
  run("git", ["init", "-q"]);

  log(`${c.dim}Instalando as dependencias (demora um pouco)...${c.reset}`);
  const instalou = run("npm", ["install", "--no-audit", "--no-fund"]);

  log();
  log(`${c.verde}${c.bold}Pronto.${c.reset} Sistema criado em ${c.bold}${pastaNome}${c.reset}`);
  log();
  log(`${c.bold}Agora faca assim:${c.reset}`);
  log();
  log(`  ${c.azul}1.${c.reset} Crie o banco em ${c.bold}https://database.new${c.reset}`);
  log(`     Escolha a regiao South America (Sao Paulo).`);
  log();
  log(`  ${c.azul}2.${c.reset} Copie a URL e a chave publishable para o arquivo ${c.bold}.env.local${c.reset}`);
  log(`     ${c.dim}(ja criado dentro da pasta, e so preencher)${c.reset}`);
  log();
  log(`  ${c.azul}3.${c.reset} Abra a pasta com sua ferramenta de IA e peca:`);
  log(`     ${c.dim}"leia o AGENTS.md e me ajude a configurar o projeto"${c.reset}`);
  log();
  log(`  ${c.azul}4.${c.reset} Para rodar:`);
  log(`     ${c.bold}cd ${pastaNome}${c.reset}`);
  if (instalou?.status !== 0) {
    log(`     ${c.bold}npm install${c.reset} ${c.amarelo}(a instalacao automatica falhou)${c.reset}`);
  }
  log(`     ${c.bold}npm run dev${c.reset}`);
  log();
}

main().catch((e) => {
  erro(e?.message ?? String(e));
  process.exit(1);
});
