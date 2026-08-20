#!/usr/bin/env node
/**
 * Hook PostToolUse: barra migration que cria tabela sem ligar RLS.
 *
 * Esta e a unica regra do projeto que e verificada por maquina, e nao por
 * disciplina — porque e a que causa o pior estrago quando passa batido:
 * tabela sem RLS e legivel por qualquer pessoa que abra o site, ja que a chave
 * publishable fica visivel no navegador.
 *
 * Sai com codigo 2 para devolver o erro ao agente e fazer ele corrigir.
 */
import { readFileSync } from "node:fs";

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let filePath;
  try {
    filePath = JSON.parse(raw)?.tool_input?.file_path;
  } catch {
    process.exit(0); // payload inesperado: nao atrapalha o fluxo
  }

  if (!filePath || !/supabase\/migrations\/.*\.sql$/.test(filePath)) {
    process.exit(0);
  }

  let sql;
  try {
    sql = readFileSync(filePath, "utf8");
  } catch {
    process.exit(0);
  }

  // Remove comentarios para nao casar com exemplo escrito dentro de "-- ..."
  const semComentarios = sql
    .replace(/--[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  const tabelas = [
    ...semComentarios.matchAll(
      /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?["']?(\w+)["']?/gi,
    ),
  ].map((m) => m[1]);

  if (tabelas.length === 0) process.exit(0);

  const comRls = new Set(
    [
      ...semComentarios.matchAll(
        /alter\s+table\s+(?:public\.)?["']?(\w+)["']?\s+enable\s+row\s+level\s+security/gi,
      ),
    ].map((m) => m[1]),
  );

  const semRls = tabelas.filter((t) => !comRls.has(t));
  if (semRls.length === 0) process.exit(0);

  console.error(
    [
      `BLOQUEADO: migration com tabela sem RLS em ${filePath}`,
      "",
      `Tabela(s) sem Row Level Security: ${semRls.join(", ")}`,
      "",
      "Sem RLS, qualquer pessoa que abrir o site consegue ler a tabela inteira,",
      "porque a chave publishable fica visivel no navegador.",
      "",
      "Adicione no MESMO arquivo, para cada tabela:",
      ...semRls.flatMap((t) => [
        "",
        `  alter table public.${t} enable row level security;`,
        "",
        `  create policy "${t}: dono le"`,
        `    on public.${t} for select`,
        "    to authenticated",
        "    using ((select auth.uid()) = user_id);",
      ]),
      "",
      "Uma policy por operacao (select, insert, update, delete).",
      "O passo a passo completo esta em docs/playbooks/nova-tabela.md",
    ].join("\n"),
  );
  process.exit(2);
});
