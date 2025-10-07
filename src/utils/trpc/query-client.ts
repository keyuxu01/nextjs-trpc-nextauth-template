import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";

/**
 * Create a QueryClient instance for server-side usage
 * This follows the tRPC documentation pattern for server components
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Set a reasonable stale time for server-side queries
        staleTime: 30 * 1000, // 30 seconds
      },
      dehydrate: {
        // Use superjson for better serialization of complex data types
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        // Use superjson for deserialization
        deserializeData: superjson.deserialize,
      },
    },
  });
}
