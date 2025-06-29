# 🖥️ Server Component 中的 tRPC 使用指南

## 📋 Server Component vs Client Component

在 Next.js App Router 中，**Server Component** 和 **Client Component** 对 tRPC 的使用方式完全不同：

### ❌ **Server Component 中不能使用的（仅限客户端）**

```typescript
// ❌ 这些只能在 Client Component 中使用
import { useTRPC, useTRPCClient } from "@/utils/trpc/hooks";
import { useQuery } from "@tanstack/react-query";

// ❌ React hooks 无法在服务器端使用
const trpc = useTRPC();
const trpcClient = useTRPCClient();
const { data } = useQuery(trpc.hello.queryOptions());
```

### ✅ **Server Component 中可以使用的**

## 1. **直接调用 tRPC 路由器 (推荐)**

```typescript
// ✅ 服务器端直接调用路由器
import { appRouter, createTRPCContext } from "@/server/trpc";

export default async function ServerPage() {
  // 创建上下文
  const ctx = await createTRPCContext();

  // 创建调用器
  const caller = appRouter.createCaller(ctx);

  // 直接调用 API
  const helloMessage = await caller.hello();
  const userProfile = await caller.user.getProfile();
  const healthCheck = await caller.general.health();

  return (
    <div>
      <h1>Server Component Data</h1>
      <p>Hello: {helloMessage}</p>
      <p>User: {userProfile.name}</p>
      <p>Health: {healthCheck.status}</p>
    </div>
  );
}
```

## 2. **使用数据库和服务直接访问**

```typescript
// ✅ 服务器端直接使用数据库
import { db } from "@/server/db";
import { getServerSession } from "@/server/auth";

export default async function ServerDataPage() {
  // 直接获取 session
  const session = await getServerSession();

  // 直接查询数据库
  // const users = await db.query.users.findMany();

  return (
    <div>
      <h1>Direct Database Access</h1>
      <p>User: {session?.user?.name}</p>
    </div>
  );
}
```

## 3. **vanilla tRPC 客户端 (特殊情况)**

```typescript
// ✅ 仅在特殊情况下使用 - 不推荐
import { trpcClient } from "@/utils/trpc/setup";

export default async function ServerClientPage() {
  try {
    // 这会发起 HTTP 请求到自己的 API
    const data = await trpcClient.general.health.query();

    return (
      <div>
        <h1>Server-side HTTP Call</h1>
        <p>Health: {data.status}</p>
      </div>
    );
  } catch (error) {
    return <div>Error fetching data</div>;
  }
}
```

## 🛠️ **封装的 serverCaller 工具**

为了简化 Server Component 中的 tRPC 调用，我们提供了一系列封装好的工具函数：

### 1. **createServerCaller() - 简化调用器创建**

```typescript
// ✅ 最简单的使用方式
import { createServerCaller } from "@/server/trpc/serverCaller";

export default async function ServerPage() {
  const caller = await createServerCaller();

  const hello = await caller.hello();
  const profile = await caller.user.getProfile();

  return <div>{hello}</div>;
}
```

### 2. **safeServerCall() - 带错误处理的安全调用**

```typescript
// ✅ 自动错误处理
import { createServerCaller, safeServerCall } from "@/server/trpc/serverCaller";

export default async function ServerPage() {
  const caller = await createServerCaller();

  const result = await safeServerCall(() => caller.hello());

  if (result.success) {
    return <div>{result.data}</div>;
  } else {
    return <div>Error: {result.error}</div>;
  }
}
```

### 3. **batchServerCalls() - 批量调用多个 API**

```typescript
// ✅ 批量调用，自动错误处理
import {
  createServerCaller,
  batchServerCalls,
} from "@/server/trpc/serverCaller";

export default async function ServerPage() {
  const caller = await createServerCaller();

  const [hello, profile, health] = await batchServerCalls([
    () => caller.hello(),
    () => caller.user.getProfile(),
    () => caller.general.health(),
  ]);

  return (
    <div>
      {hello.success && <p>{hello.data}</p>}
      {profile.success && <p>{profile.data.name}</p>}
      {health.success && <p>{health.data.status}</p>}
    </div>
  );
}
```

### 4. **getServerData() - 预配置的常用数据获取**

```typescript
// ✅ 一键获取常用数据
import { getServerData } from "@/server/trpc/serverCaller";

export default async function ServerPage() {
  const data = await getServerData();

  return (
    <div>
      {data.hello.success && <p>{data.hello.data}</p>}
      {data.profile.success && <p>{data.profile.data.name}</p>}
      {data.health.success && <p>{data.health.data.status}</p>}
    </div>
  );
}
```

## 📊 **对比总结（更新版）**

| 功能                         | Server Component | Client Component |
| ---------------------------- | ---------------- | ---------------- |
| **React Hooks**              | ❌ 不支持        | ✅ 支持          |
| **useTRPC()**                | ❌ 不支持        | ✅ 支持          |
| **useTRPCClient()**          | ❌ 不支持        | ✅ 支持          |
| **useQuery()**               | ❌ 不支持        | ✅ 支持          |
| **appRouter.createCaller()** | ✅ 支持          | ❌ 不需要        |
| **createServerCaller()**     | ✅ **推荐**      | ❌ 不需要        |
| **safeServerCall()**         | ✅ **推荐**      | ❌ 不需要        |
| **batchServerCalls()**       | ✅ **推荐**      | ❌ 不需要        |
| **getServerData()**          | ✅ **便利**      | ❌ 不需要        |
| **直接数据库访问**           | ✅ 支持          | ❌ 不支持        |
| **vanilla trpcClient**       | ⚠️ 可以但不推荐  | ✅ 支持          |
| **封装的 serverCaller 工具** | ✅ 简化调用      | ❌ 不适用        |

## 🎯 **最佳实践**

### 1. **Server Component 推荐模式（使用 serverCaller）**

```typescript
// ✅ 最佳实践：使用封装的 serverCaller
import {
  createServerCaller,
  batchServerCalls,
} from "@/server/trpc/serverCaller";

export default async function OptimalServerPage() {
  const caller = await createServerCaller();

  // 并行获取数据，自动错误处理
  const [hello, profile, health] = await batchServerCalls([
    () => caller.hello(),
    () => caller.user.getProfile(),
    () => caller.general.health(),
  ]);

  return (
    <div>
      {hello.success && <h1>{hello.data}</h1>}
      {profile.success && <UserProfile data={profile.data} />}
      {health.success && <HealthStatus status={health.data} />}
    </div>
  );
}
```

### 2. **传统方式（仍然支持）**

```typescript
// ✅ 传统方式：直接调用路由器
import { appRouter, createTRPCContext } from "@/server/trpc";

export default async function TraditionalServerPage() {
  const ctx = await createTRPCContext();
  const caller = appRouter.createCaller(ctx);

  // 并行获取数据
  const [hello, profile, health] = await Promise.all([
    caller.hello(),
    caller.user.getProfile(),
    caller.general.health(),
  ]);

  return (
    <div>
      <h1>{hello}</h1>
      <UserProfile data={profile} />
      <HealthStatus status={health} />
    </div>
  );
}
```

### 2. **为什么不推荐 vanilla client？**

```typescript
// ⚠️ 不推荐：会发起不必要的 HTTP 请求
import { trpcClient } from "@/utils/trpc/setup";

export default async function SuboptimalPage() {
  // 这会从服务器发 HTTP 请求到自己的 API - 性能差
  const data = await trpcClient.hello.query();

  return <div>{data}</div>;
}

// ✅ 推荐：直接调用，无 HTTP 开销
import { appRouter, createTRPCContext } from "@/server/trpc";

export default async function OptimalPage() {
  const ctx = await createTRPCContext();
  const caller = appRouter.createCaller(ctx);

  // 直接函数调用，性能最佳
  const data = await caller.hello();

  return <div>{data}</div>;
}
```

## 🔧 **实际应用示例**

### Server Component 获取初始数据（使用 serverCaller）

```typescript
// app/dashboard/page.tsx
import { getServerData } from "@/server/trpc/serverCaller";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  // 使用预配置的数据获取
  const data = await getServerData();

  // 提取成功的数据，处理错误
  const initialData = {
    profile: data.profile.success ? data.profile.data : null,
    health: data.health.success ? data.health.data : null,
    hello: data.hello.success ? data.hello.data : null,
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {/* 显示错误信息 */}
      {!data.profile.success && (
        <div className="text-red-600">Profile Error: {data.profile.error}</div>
      )}

      {/* 传递初始数据给客户端组件 */}
      <DashboardClient initialData={initialData} />
    </div>
  );
}
```

### 更灵活的服务器端数据获取

```typescript
// app/advanced/page.tsx
import { createServerCaller, safeServerCall } from "@/server/trpc/serverCaller";

export default async function AdvancedPage() {
  const caller = await createServerCaller();

  // 安全调用，自动错误处理
  const userResult = await safeServerCall(() => caller.user.getProfile());
  const healthResult = await safeServerCall(() => caller.general.health());

  return (
    <div>
      <h1>Advanced Dashboard</h1>

      {userResult.success ? (
        <div>Welcome, {userResult.data.name}!</div>
      ) : (
        <div className="text-red-600">
          Failed to load user: {userResult.error}
        </div>
      )}

      {healthResult.success ? (
        <div className="text-green-600">
          System Status: {healthResult.data.status}
        </div>
      ) : (
        <div className="text-red-600">
          Health Check Failed: {healthResult.error}
        </div>
      )}
    </div>
  );
}
```

### Client Component 处理交互

```typescript
// app/dashboard/DashboardClient.tsx
"use client";
import { useTRPC } from "@/utils/trpc/hooks";
import { useQuery } from "@tanstack/react-query";

interface Props {
  initialData: {
    profile: any;
    health: any;
  };
}

export function DashboardClient({ initialData }: Props) {
  const trpc = useTRPC();

  // 客户端处理用户交互和实时更新
  const { data: profile, refetch } = useQuery({
    ...trpc.user.getProfile.queryOptions(),
    initialData: initialData.profile,
  });

  return (
    <div>
      <p>Profile: {profile.name}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

## 📝 **总结**

- **Server Component**: 使用 `appRouter.createCaller()` 直接调用
- **Client Component**: 使用 React hooks (`useTRPC`, `useQuery`)
- **性能**: Server Component 直接调用性能最佳
- **交互**: Client Component 处理用户交互和实时更新

这样的架构既发挥了 Server Component 的 SSR 优势，又保持了 Client Component 的交互能力！
