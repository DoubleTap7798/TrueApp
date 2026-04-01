import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — data stays fresh, no refetch on tab focus
      gcTime: 15 * 60 * 1000,   // 15 min — keep in cache after unmount
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
