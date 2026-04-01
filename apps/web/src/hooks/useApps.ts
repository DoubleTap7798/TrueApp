import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { AppRecord } from "../types";

/** All apps — cached for 5 minutes */
export function useAllApps() {
  return useQuery<AppRecord[]>({
    queryKey: ["apps"],
    queryFn: ({ signal }) => api.apps.findAll({ signal }),
  });
}

/** Single app by slug — cached independently */
export function useApp(slug: string | undefined) {
  return useQuery<AppRecord>({
    queryKey: ["app", slug],
    queryFn: ({ signal }) => api.apps.findBySlug(slug!, { signal }),
    enabled: Boolean(slug),
  });
}

/** Subset of apps by ID list — used for compare / alternatives */
export function useAppsByIds(ids: string[]) {
  return useQuery<AppRecord[]>({
    queryKey: ["apps", "ids", ids.join(",")],
    queryFn: ({ signal }) => api.apps.findByIds(ids, { signal }),
    enabled: ids.length > 0,
  });
}
