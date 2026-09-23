import { QueryClient, type DefaultOptions } from "@tanstack/react-query";

/**
 * Dados de carta mudam pouco e a API pública tem limite de taxa.
 * O cache evita repetir a mesma busca ao reabrir um resultado.
 */
const defaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
} satisfies DefaultOptions;

/**
 * Um cliente novo a cada chamada. O provider guarda uma instância no browser.
 * Um singleton de módulo compartilharia o cache entre requisições no servidor.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions });
}
