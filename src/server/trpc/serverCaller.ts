/**
 * Server Caller Utility
 *
 * Simplified wrapper for tRPC server-side calls in Server Components
 * Using the new createCallerFactory pattern for better performance
 */

import {
  appRouter,
  createCallerFactory,
  createTRPCContext,
} from "@/server/trpc";

// Create caller factory instance (cached for performance)
const callerFactory = createCallerFactory(appRouter);

/**
 * Create a server-side tRPC caller using the new factory pattern
 *
 * @returns Promise<tRPC caller instance>
 *
 * @example
 * ```typescript
 * // In a Server Component
 * import { createServerCaller } from "@/server/trpc/serverCaller";
 *
 * export default async function ServerPage() {
 *   const caller = await createServerCaller();
 *
 *   const hello = await caller.hello();
 *   const profile = await caller.user.getProfile();
 *
 *   return <div>{hello}</div>;
 * }
 * ```
 */
export async function createServerCaller() {
  const ctx = await createTRPCContext();
  return callerFactory(ctx);
}

/**
 * Server Caller type for better TypeScript support
 */
export type ServerCaller = Awaited<ReturnType<typeof createServerCaller>>;

/**
 * Utility function to safely call tRPC procedures with error handling
 *
 * @param procedureCall - The tRPC procedure call
 * @returns Promise with data or error
 *
 * @example
 * ```typescript
 * import { createServerCaller, safeServerCall } from "@/server/trpc/serverCaller";
 *
 * export default async function ServerPage() {
 *   const caller = await createServerCaller();
 *
 *   const result = await safeServerCall(() => caller.hello());
 *
 *   if (result.success) {
 *     return <div>{result.data}</div>;
 *   } else {
 *     return <div>Error: {result.error}</div>;
 *   }
 * }
 * ```
 */
export async function safeServerCall<T>(
  procedureCall: () => Promise<T>
): Promise<
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: string }
> {
  try {
    const data = await procedureCall();
    return { success: true, data, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Server tRPC call failed:", errorMessage);
    return { success: false, data: null, error: errorMessage };
  }
}

/**
 * Batch multiple server calls with error handling
 *
 * @param calls - Array of tRPC procedure calls
 * @returns Promise with array of results
 *
 * @example
 * ```typescript
 * import { createServerCaller, batchServerCalls } from "@/server/trpc/serverCaller";
 *
 * export default async function ServerPage() {
 *   const caller = await createServerCaller();
 *
 *   const [hello, profile, health] = await batchServerCalls([
 *     () => caller.hello(),
 *     () => caller.user.getProfile(),
 *     () => caller.general.health(),
 *   ]);
 *
 *   return (
 *     <div>
 *       {hello.success && <p>{hello.data}</p>}
 *       {profile.success && <p>{profile.data.name}</p>}
 *       {health.success && <p>{health.data.status}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export async function batchServerCalls<
  T extends readonly (() => Promise<unknown>)[]
>(
  calls: T
): Promise<
  {
    [K in keyof T]: T[K] extends () => Promise<infer R>
      ?
          | { success: true; data: R; error: null }
          | { success: false; data: null; error: string }
      : never;
  }
> {
  const results = await Promise.allSettled(calls.map((call) => call()));

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return { success: true, data: result.value, error: null };
    } else {
      const errorMessage =
        result.reason instanceof Error
          ? result.reason.message
          : "Unknown error";
      console.error("Batch server call failed:", errorMessage);
      return { success: false, data: null, error: errorMessage };
    }
  }) as {
    [K in keyof T]: T[K] extends () => Promise<infer R>
      ?
          | { success: true; data: R; error: null }
          | { success: false; data: null; error: string }
      : never;
  };
}

/**
 * Pre-configured server caller with common procedures
 * Useful for frequently used endpoints
 *
 * @example
 * ```typescript
 * import { getServerData } from "@/server/trpc/serverCaller";
 *
 * export default async function ServerPage() {
 *   const data = await getServerData();
 *
 *   return (
 *     <div>
 *       {data.hello.success && <p>{data.hello.data}</p>}
 *       {data.profile.success && <p>{data.profile.data.name}</p>}
 *       {data.health.success && <p>{data.health.data.status}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export async function getServerData() {
  const caller = await createServerCaller();

  const [hello, profile, health] = await batchServerCalls([
    () => caller.hello(),
    () => caller.user.getProfile(),
    () => caller.general.health(),
  ]);

  return {
    hello,
    profile,
    health,
  };
}

/**
 * Create a server caller with custom context
 * Useful for testing or special scenarios
 *
 * @param customContext - Custom tRPC context
 * @returns tRPC caller instance
 *
 * @example
 * ```typescript
 * import { createServerCallerWithContext } from "@/server/trpc/serverCaller";
 *
 * // For testing
 * const mockContext = { session: mockSession };
 * const caller = createServerCallerWithContext(mockContext);
 * ```
 */
export function createServerCallerWithContext(
  customContext: Parameters<typeof appRouter.createCaller>[0]
) {
  return appRouter.createCaller(customContext);
}
