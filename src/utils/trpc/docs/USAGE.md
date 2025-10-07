# tRPC v11 使用指南

## 正确的使用方式

### 1. 推荐方式：useTRPC + queryOptions ⭐

```tsx
"use client";
import { useTRPC } from "@/utils/trpc/hooks";
import { useQuery } from "@tanstack/react-query";

export function MyComponent() {
  const trpc = useTRPC();

  // 推荐：使用 queryOptions
  const { data, isLoading, error } = useQuery(trpc.hello.queryOptions());

  // 带参数的查询
  const { data: userData } = useQuery(
    trpc.getUser.queryOptions({ id: "user_123" })
  );

  return <div>{data}</div>;
}
```

### 2. 传统方式：useTRPCClient + useQuery

```tsx
"use client";
import { useTRPCClient } from "@/utils/trpc/hooks";
import { useQuery } from "@tanstack/react-query";

export function MyComponent() {
  const trpcClient = useTRPCClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["hello"],
    queryFn: () => trpcClient.hello.query(),
  });

  return <div>{data}</div>;
}
```

### 3. 手动调用：useTRPCClient

```tsx
"use client";
import { useTRPCClient } from "@/utils/trpc/hooks";

export function MyComponent() {
  const trpcClient = useTRPCClient();

  const handleClick = async () => {
    try {
      const result = await trpcClient.hello.query();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleClick}>Call tRPC</button>;
}
```

## Hooks 说明

### `useTRPC()`

- 返回一个 tRPC 对象，包含所有路由的 `queryOptions` 方法
- 用于与 `useQuery` 配合使用
- **推荐用法**：`useQuery(trpc.routeName.queryOptions(params))`

### `useTRPCClient()`

- 返回原始的 tRPC 客户端实例
- 用于手动调用 API 或在事件处理器中使用
- **用法**：`trpcClient.routeName.query(params)`

## 常见错误 vs 正确用法

| ❌ 错误用法              | ✅ 正确用法                           |
| ------------------------ | ------------------------------------- |
| `trpc.hello.useQuery()`  | `useQuery(trpc.hello.queryOptions())` |
| 混合不同版本的 tRPC 包   | 保持所有 @trpc/\* 包版本一致          |
| 忘记 `"use client"` 指令 | 在客户端组件中添加指令                |
| 直接导入 vanilla client  | 使用 `useTRPCClient()` hook           |

## 最佳实践

1. **优先使用 `queryOptions`** - 提供最好的类型推断和缓存
2. **手动调用使用 `useTRPCClient()`** - 适用于事件处理器
3. **确保包版本一致** - 避免兼容性问题
4. **正确配置 Provider** - 在 root layout 中包装应用
