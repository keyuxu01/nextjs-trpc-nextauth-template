"use client";

import { type AppRouter } from "@/server/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import { TRPCProvider as TRPCProviderBase } from "./setup";

function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

interface TRPCProviderProps {
  children: React.ReactNode;
}

let browserQueryClient: QueryClient | undefined = undefined;


function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function TRPCProvider({ children }: TRPCProviderProps) {
  const queryClient = getQueryClient();

  /**
   * 使用 createTRPCContext 提供的 TRPCProvider（React Context 包装器）
   * 每个请求都会创建新的 QueryClient 和 tRPC client
   * 典型场景：SSR（服务端渲染） 或 需要多用户隔离缓存 的全栈框架
   */
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        // 将多个 tRPC 请求合并成一个 HTTP 请求
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // Optional: Add headers if needed
          async headers() {
            return {
              // Add authentication headers if needed
            };
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProviderBase
        trpcClient={trpcClient}
        queryClient={queryClient}
      >
        {children}
      </TRPCProviderBase>
    </QueryClientProvider>
  );
}
