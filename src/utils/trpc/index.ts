// Main tRPC exports
export { useTRPC, useTRPCClient } from "./hooks";
export { TRPCProvider } from "./provider";

// Server-side tRPC utilities for server components
export {
    caller, getQueryClient, HydrateClient, prefetch, trpc
} from "./server";

// Client-side tRPC utilities
export {
    TRPCProvider as ClientTRPCProvider,
    useTRPC as useClientTRPC,
    useTRPCClient as useClientTRPCClient
} from "./client";

// Type exports
export type { AppRouter } from "@/server/trpc";
