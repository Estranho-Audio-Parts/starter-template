/**
 * CONTROLE DE ACESSO DO SISTEMA
 * =============================
 * Este e o unico lugar onde voce decide o que e publico e o que exige login.
 * O proxy (proxy.ts) le daqui. Nao espalhe checagem de rota por outros arquivos.
 *
 * O padrao e "fechado": tudo exige login, exceto o que estiver listado abaixo.
 * Isso e proposital — e mais seguro esquecer de liberar uma pagina do que
 * esquecer de proteger uma.
 */

/** Rotas que qualquer pessoa pode abrir sem estar logada. */
export const PUBLIC_ROUTES = [
  "/", // landing page
] as const;

/** Prefixos publicos: tudo abaixo deles e liberado (ex.: /auth/login). */
export const PUBLIC_PREFIXES = [
  "/auth", // login, cadastro, recuperacao de senha, confirmacao de e-mail
] as const;

/** Para onde mandar quem tentou abrir algo protegido sem estar logado. */
export const LOGIN_PATH = "/auth/login";

/** Para onde mandar o usuario logo apos entrar no sistema. */
export const AFTER_LOGIN_PATH = "/protected";

export function isPublicPath(pathname: string): boolean {
  if ((PUBLIC_ROUTES as readonly string[]).includes(pathname)) return true;
  return (PUBLIC_PREFIXES as readonly string[]).some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
