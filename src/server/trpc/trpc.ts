/**
 * tRPC Server Core Configuration
 * 
 * This file contains the core tRPC setup including:
 * - tRPC instance initialization
 * - Context creation
 * - Base procedures (public/protected)
 * - Common middleware
 */

import { getServerSession } from "@/server/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import type { Session } from "next-auth";

/**
 * tRPC Context Interface
 */
export interface TRPCContext {
  session: Session;
}

/**
 * Create tRPC context for each request
 * This runs for every tRPC request and provides the context
 */
export const createTRPCContext = async (): Promise<TRPCContext> => {
  const session = await getServerSession();

  console.log("Session in tRPC context:", session);

  if (!session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource.',
    });
  }

  return {
    session,
  };
};

/**
 * Initialize tRPC instance
 * This should only be done once per backend!
 */
const t = initTRPC.context<TRPCContext>().create({
  // Optional: Add custom error formatting
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Export reusable router and procedure helpers
 * Also export createCallerFactory for the new caller pattern
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;


/**
 * Authentication middleware
 * Ensures user is authenticated before proceeding
 */
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const start = Date.now();
  
  console.log("Session in isAuthenticated middleware:", ctx.session);
  
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource.',
    });
  }
  
  const result = await next({
    ctx: {
      // Infer that session is non-null
      session: ctx.session,
    },
  });
  
  const end = Date.now();
  console.log(`isAuthenticated middleware took ${end - start}ms`);
  
  return result;
});

/**
 * Protected procedure that requires authentication
 */
export const protectedProcedure = publicProcedure.use(isAuthenticated);
