/**
 * @description tRPC API 路由处理
 * @file src/app/api/trpc/[...trpc]/route.ts 是 tRPC API 的入口文件 [...trpc] 表示动态路由, 匹配所有 /api/trpc 开头的请求, 动态参数为 trpc，将动态参数传递给 appRouter 中的 procedure。
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-routes
 */
import { appRouter as trpcRouter, createTRPCContext } from "@/server/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

// tRPC API handler
const trpcHandler = (req: NextRequest) => {
  /**
   * @description fetchRequestHandler 的作用是：把来自 /api/trpc 的 HTTP 请求交给 appRouter 里的 procedure 去处理。
   * @param endpoint: tRPC API 暴露的路径
   * @param req: 传入的 HTTP 请求对象
   * @param router: trpcRouter（所有 procedure 的集合）
   * @param createContext: 每个请求的上下文（如 db, user）
   */
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: trpcRouter,
    createContext: createTRPCContext,
  });
};

export {
  trpcHandler as DELETE,
  trpcHandler as GET,
  trpcHandler as HEAD,
  trpcHandler as OPTIONS,
  trpcHandler as PATCH,
  trpcHandler as POST,
  trpcHandler as PUT,
};
