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
 interface TRPCContext {
  session: Session;
}

/**
 * Create tRPC context for each request
 * This runs for every tRPC request and provides the context
 */
const createTRPCContext = async (): Promise<TRPCContext> => {
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
/**
 * @description router 就是一个「procedure 的集合」，类似于传统框架里的「路由分组」或者「模块化 API」。
 */
const router = t.router;
/**
 * @description procedure 是 服务端定义的一个可调用函数。
 */
const publicProcedure = t.procedure;

/**
 * @description 用于在 Server Component 中调用 tRPC 服务端 procedure。
 * createCallerFactory 用来生成一个 caller，caller 是客户端调用服务端 procedure 的「门面」。
 * 基于 router 生成一个调用工具, 这个工具可以调用 router 中的所有 procedure。
 * 用于在 Server Component 中调用 tRPC 服务端 procedure。
 */
const createCallerFactory = t.createCallerFactory;


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
 * @description 使用 isAuthenticated 中间件来保护 procedure。
 */
const protectedProcedure = publicProcedure.use(isAuthenticated);


export { createCallerFactory, createTRPCContext, protectedProcedure, publicProcedure, router, type TRPCContext };



