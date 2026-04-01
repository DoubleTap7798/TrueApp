/// <reference types="vite/client" />
import { createApiClient } from "@trueapp/api-client";

// VITE_API_URL is injected at build time.
// In dev, set it in apps/web/.env.local: VITE_API_URL=http://localhost:8080
// In production it will be the Railway API URL.
const baseUrl: string = import.meta.env.VITE_API_URL ?? "";

export const api = createApiClient(baseUrl);
