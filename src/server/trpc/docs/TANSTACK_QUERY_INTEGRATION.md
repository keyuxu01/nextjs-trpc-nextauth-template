# TanStack Query + tRPC 集成指南

本指南展示了如何在 Next.js App Router 中使用 TanStack Query 和 tRPC 进行服务器端渲染和客户端数据获取。

## 🚀 新功能概览

基于 [tRPC 官方文档](https://trpc.io/docs/client/tanstack-react-query/server-components)，我们实现了以下功能：

### 服务器端工具

- **`getQueryClient()`** - 创建稳定的 Query Client 实例
- **`trpc`** - 服务器端 tRPC 代理，用于预取数据
- **`prefetch()`** - 预取查询数据到 Query Client
- **`HydrateClient`** - 将预取数据注入到客户端组件
- **`caller`** - 直接服务器端调用，不经过 Query Client

### 客户端工具

- **`useTRPC()`** - 客户端 tRPC hook
- **`useSuspenseQuery()`** - 支持 Suspense 的数据获取
- **`TRPCProvider`** - 客户端 tRPC 提供者

## 📁 文件结构

```
src/utils/trpc/
├── query-client.ts    # Query Client 工厂函数
├── server.tsx         # 服务器端 tRPC 工具
├── client.tsx         # 客户端 tRPC 工具
└── index.ts           # 统一导出

src/components/business/
├── TanStackQueryExample.tsx  # 服务器组件示例
└── ClientGreeting.tsx        # 客户端组件示例
```

## 🎯 使用方式

### 1. 服务器组件 - 预取数据

```tsx
// Server Component
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, prefetch, trpc, caller } from "@/utils/trpc";

export async function MyServerComponent() {
  // 预取数据到 Query Client
  prefetch(trpc.general.hello.queryOptions());
  prefetch(trpc.general.health.queryOptions());

  // 直接获取服务器端数据
  const serverData = await caller.general.hello();

  return (
    <div>
      {/* 服务器端数据 */}
      <div>Server: {serverData}</div>

      {/* 客户端组件 - 使用预取的数据 */}
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientComponent />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
```

### 2. 客户端组件 - 使用预取数据

```tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc/client";

export function ClientComponent() {
  const trpc = useTRPC();

  // 使用 Suspense 模式获取预取的数据
  const { data: helloData } = useSuspenseQuery(
    trpc.general.hello.queryOptions()
  );

  const { data: healthData } = useSuspenseQuery(
    trpc.general.health.queryOptions()
  );

  return (
    <div>
      <div>Hello: {helloData}</div>
      <div>Health: {healthData.status}</div>
    </div>
  );
}
```

### 3. 传统客户端组件 - 不使用预取

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc/client";

export function TraditionalClientComponent() {
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery(
    trpc.general.hello.queryOptions()
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Hello: {data}</div>;
}
```

## 🔧 配置说明

### Query Client 配置

```tsx
// src/utils/trpc/query-client.ts
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30秒缓存时间
      },
      dehydrate: {
        serializeData: superjson.serialize, // 序列化
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize, // 反序列化
      },
    },
  });
}
```

### 服务器端 tRPC 代理

```tsx
// src/utils/trpc/server.tsx
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
```

## 🎨 最佳实践

### 1. 数据获取策略

- **服务器端数据**: 使用 `caller` 直接调用，适用于 SEO 关键数据
- **客户端数据**: 使用 `prefetch` + `HydrateClient`，适用于交互性数据
- **实时数据**: 使用客户端 `useQuery`，适用于需要实时更新的数据

### 2. 错误处理

```tsx
// 使用 ErrorBoundary 处理客户端错误
<ErrorBoundary fallback={<ErrorComponent />}>
  <Suspense fallback={<LoadingComponent />}>
    <ClientComponent />
  </Suspense>
</ErrorBoundary>
```

### 3. 性能优化

- 使用 `staleTime` 控制缓存时间
- 合理使用 `prefetch` 预取关键数据
- 避免在服务器端过度预取数据

## 🔍 示例组件

查看以下示例组件了解完整用法：

- `src/components/business/TanStackQueryExample.tsx` - 服务器组件示例
- `src/components/business/ClientGreeting.tsx` - 客户端组件示例

## 📚 相关文档

- [tRPC 官方文档](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [TanStack Query 文档](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🚨 注意事项

1. **Node.js 版本**: 需要 Node.js 16+ 支持 superjson
2. **React 版本**: 需要 React 18+ 支持 Suspense
3. **类型安全**: 确保 tRPC 路由类型正确导出
4. **缓存策略**: 根据数据特性选择合适的缓存时间
