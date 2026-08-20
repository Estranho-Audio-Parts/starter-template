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
];

export default eslintConfig;
