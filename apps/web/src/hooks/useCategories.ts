import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Category } from "../types";

/** All categories — rarely changes, long stale time */
export function useAllCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: ({ signal }) => api.categories.findAll({ signal }),
    staleTime: 30 * 60 * 1000, // 30 min
  });
}
