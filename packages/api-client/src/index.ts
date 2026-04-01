import type {
  ApiListResponse,
  ApiSingleResponse,
  AppRecord,
  Category,
} from "@trueapp/shared";

export type { ApiListResponse, ApiSingleResponse, AppRecord, Category };

export interface ApiClientOptions {
  /** Base URL including scheme, e.g. "https://api.example.com" or "" for same-origin */
  baseUrl: string;
  /** Optional abort signal forwarded to every request */
  signal?: AbortSignal;
}

export interface TrueAppApiClient {
  apps: {
    findAll(opts?: { signal?: AbortSignal }): Promise<AppRecord[]>;
    findBySlug(
      slug: string,
      opts?: { signal?: AbortSignal }
    ): Promise<AppRecord>;
    findByIds(
      ids: string[],
      opts?: { signal?: AbortSignal }
    ): Promise<AppRecord[]>;
    compare(
      ids: [string, string],
      opts?: { signal?: AbortSignal }
    ): Promise<AppRecord[]>;
  };
  categories: {
    findAll(opts?: { signal?: AbortSignal }): Promise<Category[]>;
  };
}

async function request<T>(
  baseUrl: string,
  path: string,
  signal?: AbortSignal
): Promise<T> {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`[TrueApp API] ${res.status} ${res.statusText} — ${url}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export function createApiClient(baseUrl: string): TrueAppApiClient {
  // Strip trailing slash once
  const base = baseUrl.replace(/\/$/, "");

  return {
    apps: {
      findAll({ signal } = {}) {
        return request<ApiListResponse<AppRecord>>(base, "/api/apps", signal).then(
          (r) => r.data
        );
      },
      findBySlug(slug, { signal } = {}) {
        return request<ApiSingleResponse<AppRecord>>(
          base,
          `/api/apps/${encodeURIComponent(slug)}`,
          signal
        ).then((r) => r.data);
      },
      findByIds(ids, { signal } = {}) {
        if (!ids.length) return Promise.resolve([]);
        const q = ids.map(encodeURIComponent).join(",");
        return request<ApiListResponse<AppRecord>>(
          base,
          `/api/apps?ids=${q}`,
          signal
        ).then((r) => r.data);
      },
      compare(ids, { signal } = {}) {
        const q = ids.map(encodeURIComponent).join(",");
        return request<{ data: AppRecord[] }>(
          base,
          `/api/compare?ids=${q}`,
          signal
        ).then((r) => r.data);
      },
    },
    categories: {
      findAll({ signal } = {}) {
        return request<ApiListResponse<Category>>(
          base,
          "/api/categories",
          signal
        ).then((r) => r.data);
      },
    },
  };
}

