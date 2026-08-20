/**
 * Impede "open redirect": um link do tipo
 *   /auth/confirm?next=https://site-malicioso.com
 * levaria o usuario para fora do sistema logo apos ele confirmar a conta,
 * numa pagina que parece ser sua. Classico vetor de phishing.
 *
 * So aceitamos caminhos internos: precisam comecar com "/" e nao podem
 * comecar com "//" nem "/\" (ambos viram URL absoluta no navegador).
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/",
): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
