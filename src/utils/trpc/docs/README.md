# tRPC Configuration

这个项目使用 tRPC v11 与 TanStack Query 集成来提供类型安全的 API 调用。

## 文件结构

```
src/utils/trpc/
├── setup.ts          # tRPC 客户端和提供者配置
├── provider.tsx      # React 提供者组件
├── hooks.ts          # 导出的 React hooks
└── index.ts          # 主要导出文件
```

## 配置说明

### 1. 服务器端配置 (`src/utils/trpc.ts`)

- 定义 tRPC 路由器
- 设置认证中间件
- 创建 tRPC 上下文

### 2. 客户端配置 (`src/utils/trpc/setup.ts`)

- 使用 `createTRPCContext` 创建 React 集成
- 配置 vanilla tRPC 客户端用于服务器端调用

### 3. 提供者配置 (`src/utils/trpc/provider.tsx`)

- 封装 TanStack Query 和 tRPC 提供者
- 配置查询客户端默认选项

## 使用示例

### 在组件中使用 tRPC

```tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc/setup";

export function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["hello"],
    queryFn: () => trpcClient.hello.query(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data}</div>;
}
```

### API 路由 (`src/app/api/trpc/[...trpc]/route.ts`)

- 使用 `fetchRequestHandler` 处理 tRPC 请求
- 正确配置 context 创建函数

## 环境要求

- `@trpc/client`: ^11.4.2
- `@trpc/server`: ^11.4.2
- `@trpc/tanstack-react-query`: ^11.4.2
- `@tanstack/react-query`: ^5.81.2

## 注意事项

1. 确保所有 tRPC 包版本一致
2. 在 root layout 中包装 `<TRPCProvider>`
3. 客户端组件需要使用 `"use client"` 指令
4. 服务器端可以直接使用 `trpcClient`
