# Utils 文件夹组织结构

## 文件结构

```
src/utils/
├── index.ts           # 主要导出文件 (服务器端配置)
├── trpc.ts           # tRPC 服务器端配置 (路由、中间件、上下文)
└── trpc/             # tRPC 客户端配置
    ├── index.ts      # 客户端主导出
    ├── setup.ts      # tRPC 客户端设置
    ├── provider.tsx  # React Provider 组件
    ├── hooks.ts      # React hooks 导出
    └── USAGE.md      # 使用指南
```

## 导入指南

### 服务器端使用

```typescript
// API 路由或服务器组件中
import { createTRPCContext, testRouter } from "@/utils";
import type { TestRouter } from "@/utils";
```

### 客户端使用

```typescript
// React 组件中
import { TRPCProvider } from "@/utils/trpc";
import { useTRPC, useTRPCClient } from "@/utils/trpc";
import { trpcClient } from "@/utils/trpc/setup";
```

### 布局中

```typescript
// app/layout.tsx
import { TRPCProvider } from "@/utils/trpc/provider";
```

## 文件职责

| 文件                      | 职责                 | 使用场景                 |
| ------------------------- | -------------------- | ------------------------ |
| `utils/index.ts`          | 统一导出服务器端配置 | API 路由、服务器组件     |
| `utils/trpc.ts`           | tRPC 服务器配置      | 定义路由、中间件、上下文 |
| `utils/trpc/index.ts`     | 客户端主导出         | 客户端组件统一导入       |
| `utils/trpc/setup.ts`     | 客户端设置           | tRPC 客户端实例          |
| `utils/trpc/provider.tsx` | React Provider       | 应用根组件包装           |
| `utils/trpc/hooks.ts`     | React hooks          | 重新导出便于导入         |

## 清理的内容

- ✅ 删除了过时的 `utils/api.ts`
- ✅ 移除了重复的 tRPC 客户端配置
- ✅ 统一了导入路径
- ✅ 明确了服务器端 vs 客户端的职责分离

## 最佳实践

1. **服务器端**: 从 `@/utils` 导入
2. **客户端**: 从 `@/utils/trpc` 导入
3. **类型**: 从 `@/utils` 导入类型定义
4. **Provider**: 从 `@/utils/trpc/provider` 导入
