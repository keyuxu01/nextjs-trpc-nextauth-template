// 🚀 TanStack Query + tRPC 集成示例
import { caller, HydrateClient, prefetch, trpc } from "@/utils/trpc";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ClientGreeting } from "./ClientGreeting";

// Server Component - 使用 TanStack Query 预取数据
export async function TanStackQueryExample() {
  // 预取数据到 Query Client
  prefetch(trpc.general.hello.queryOptions());
  prefetch(trpc.general.health.queryOptions());

  // 也可以直接使用 caller 获取服务器端数据
  const serverData = await caller.general.hello();

  return (
    <div className="p-4 space-y-4 border border-blue-500 rounded">
      <h3 className="font-bold text-blue-600">
        🚀 TanStack Query + tRPC 集成示例
      </h3>

      {/* 服务器端数据 */}
      <div className="p-2 bg-blue-50 rounded">
        <strong>Server Data:</strong> {serverData}
        <br />
        <small className="text-gray-600">
          使用 caller 直接获取服务器端数据
        </small>
      </div>

      {/* 客户端组件 - 使用预取的数据 */}
      <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientGreeting />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>

      {/* 使用说明 */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>🎯 新的 TanStack Query 集成:</strong>
        </p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <code>prefetch()</code> - 预取数据到 Query Client
          </li>
          <li>
            <code>HydrateClient</code> - 将预取数据注入到客户端
          </li>
          <li>
            <code>trpc</code> - 服务器端 tRPC 代理
          </li>
          <li>
            <code>caller</code> - 直接服务器端调用
          </li>
        </ul>
      </div>
    </div>
  );
}
