import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    // Arquivos gerados nunca devem ser lintados, senao o CI quebra sozinho.
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "lib/supabase/database.types.ts",
      "supabase/.temp/**",
      "cli/template/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // Codigo gerado pelo shadcn (`npx shadcn@latest add ...`). O CLI reescreve
    // estes arquivos, entao corrigir a mao volta a quebrar na proxima vez.
    // Desligamos apenas as duas regras que o codigo do shadcn viola, e apenas
    // aqui — o codigo que a equipe escreve continua sendo cobrado por elas.
    files: ["components/ui/**", "hooks/use-mobile.ts"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
