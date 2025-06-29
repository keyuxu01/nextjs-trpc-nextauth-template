# 🖥️ Server Component 中使用 tRPC 完整指南

本指南详细说明如何在 Next.js Server Components 中使用 tRPC，包括最佳实践和常见模式。

## 📋 目录

- [基础概念](#基础概念)
- [ServerCaller 工具](#servercaller-工具)
- [使用方式](#使用方式)
- [错误处理](#错误处理)
- [性能优化](#性能优化)
- [实际示例](#实际示例)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 基础概念

### Server Components vs Client Components

在 Next.js App Router 中：

- **Server Components**: 在服务器端渲染，可以直接访问数据库和服务器资源
- **Client Components**: 在客户端渲染，需要通过 API 调用获取数据

### tRPC 在 Server Components 中的优势

```typescript
// ❌ 传统方式 - 需要创建 API 路由
async function getData() {
  const response = await fetch("/api/user/profile");
  return response.json();
}

// ✅ tRPC 方式 - 直接调用类型安全的方法
import { createServerCaller } from "@/server/trpc/serverCaller";

async function getData() {
  const caller = await createServerCaller();
  return caller.user.getProfile(); // 完全类型安全！
}
```

## ServerCaller 工具

我们提供了多个实用工具来简化 Server Component 中的 tRPC 调用：

### 1. `createServerCaller()`

基础调用器，创建一个 tRPC 调用实例：

```typescript
import { createServerCaller } from "@/server/trpc/serverCaller";

export default async function MyServerComponent() {
  const caller = await createServerCaller();

  // 直接调用任何 tRPC 方法
  const hello = await caller.hello();
  const profile = await caller.user.getProfile();
  const health = await caller.general.health();

  return (
    <div>
      <p>{hello}</p>
      <p>用户: {profile.name}</p>
      <p>状态: {health.status}</p>
    </div>
  );
}
```

### 2. `safeServerCall()`

安全调用包装器，自动处理错误：

```typescript
import { createServerCaller, safeServerCall } from "@/server/trpc/serverCaller";

export default async function SafeComponent() {
  const caller = await createServerCaller();

  // 安全调用，不会抛出错误
  const result = await safeServerCall(() => caller.user.getProfile());

  if (result.success) {
    return <div>用户: {result.data.name}</div>;
  } else {
    return <div>错误: {result.error}</div>;
  }
}
```

### 3. `batchServerCalls()`

批量并行调用多个方法：

```typescript
import {
  createServerCaller,
  batchServerCalls,
} from "@/server/trpc/serverCaller";

export default async function BatchComponent() {
  const caller = await createServerCaller();

  // 并行执行多个调用
  const [hello, profile, health] = await batchServerCalls([
    () => caller.hello(),
    () => caller.user.getProfile(),
    () => caller.general.health(),
  ]);

  return (
    <div>
      {hello.success && <p>{hello.data}</p>}
      {profile.success && <p>用户: {profile.data.name}</p>}
      {health.success && <p>状态: {health.data.status}</p>}
    </div>
  );
}
```

### 4. `getServerData()`

预配置的常用数据获取：

```typescript
import { getServerData } from "@/server/trpc/serverCaller";

export default async function QuickComponent() {
  // 一次调用获取多个常用数据
  const data = await getServerData();

  return (
    <div>
      {data.hello.success && <p>{data.hello.data}</p>}
      {data.profile.success && <p>用户: {data.profile.data.name}</p>}
      {data.health.success && <p>状态: {data.health.data.status}</p>}
    </div>
  );
}
```

## 使用方式

### 基础用法

```typescript
// src/app/dashboard/page.tsx
import { createServerCaller } from "@/server/trpc/serverCaller";

export default async function DashboardPage() {
  const caller = await createServerCaller();

  try {
    const userProfile = await caller.user.getProfile();
    const systemHealth = await caller.general.health();

    return (
      <div>
        <h1>仪表板</h1>
        <p>欢迎, {userProfile.name}!</p>
        <p>系统状态: {systemHealth.status}</p>
      </div>
    );
  } catch (error) {
    return <div>加载失败: {error.message}</div>;
  }
}
```

### 带错误处理的用法

```typescript
// src/app/profile/page.tsx
import { createServerCaller, safeServerCall } from "@/server/trpc/serverCaller";

export default async function ProfilePage() {
  const caller = await createServerCaller();

  const profileResult = await safeServerCall(() => caller.user.getProfile());
  const settingsResult = await safeServerCall(() => caller.user.getSettings());

  return (
    <div>
      <h1>用户资料</h1>

      {profileResult.success ? (
        <div>
          <h2>{profileResult.data.name}</h2>
          <p>{profileResult.data.email}</p>
        </div>
      ) : (
        <div>无法加载用户资料: {profileResult.error}</div>
      )}

      {settingsResult.success ? (
        <div>
          <h3>设置</h3>
          <pre>{JSON.stringify(settingsResult.data, null, 2)}</pre>
        </div>
      ) : (
        <div>设置加载失败: {settingsResult.error}</div>
      )}
    </div>
  );
}
```

### 批量调用用法

```typescript
// src/app/admin/page.tsx
import {
  createServerCaller,
  batchServerCalls,
} from "@/server/trpc/serverCaller";

export default async function AdminPage() {
  const caller = await createServerCaller();

  // 同时获取多个管理员数据
  const [users, stats, logs, health] = await batchServerCalls([
    () => caller.admin.getAllUsers(),
    () => caller.admin.getStats(),
    () => caller.admin.getSystemLogs(),
    () => caller.general.health(),
  ]);

  return (
    <div className="admin-dashboard">
      <h1>管理面板</h1>

      {/* 系统健康状态 */}
      <div className="health-status">
        {health.success ? (
          <span className="status-ok">系统正常 ({health.data.status})</span>
        ) : (
          <span className="status-error">系统异常</span>
        )}
      </div>

      {/* 统计信息 */}
      <div className="stats">
        {stats.success ? (
          <div>
            <h2>系统统计</h2>
            <p>总用户数: {stats.data.totalUsers}</p>
            <p>活跃用户: {stats.data.activeUsers}</p>
          </div>
        ) : (
          <p>统计数据加载失败</p>
        )}
      </div>

      {/* 用户列表 */}
      <div className="users">
        {users.success ? (
          <div>
            <h2>用户列表</h2>
            {users.data.map((user) => (
              <div key={user.id}>
                {user.name} - {user.email}
              </div>
            ))}
          </div>
        ) : (
          <p>用户列表加载失败</p>
        )}
      </div>

      {/* 系统日志 */}
      <div className="logs">
        {logs.success ? (
          <div>
            <h2>系统日志</h2>
            {logs.data.map((log) => (
              <div key={log.id}>
                {log.timestamp}: {log.message}
              </div>
            ))}
          </div>
        ) : (
          <p>日志加载失败</p>
        )}
      </div>
    </div>
  );
}
```

## 错误处理

### 全局错误处理

```typescript
// src/app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>出错了!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>重试</button>
    </div>
  );
}
```

### 组件级错误处理

```typescript
// src/components/UserProfile.tsx
import { createServerCaller, safeServerCall } from "@/server/trpc/serverCaller";

export async function UserProfile({ userId }: { userId: string }) {
  const caller = await createServerCaller();

  const result = await safeServerCall(() =>
    caller.user.getById({ id: userId })
  );

  if (!result.success) {
    return (
      <div className="error-card">
        <h3>用户加载失败</h3>
        <p>原因: {result.error}</p>
        <details>
          <summary>技术详情</summary>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </details>
      </div>
    );
  }

  return (
    <div className="user-card">
      <h3>{result.data.name}</h3>
      <p>{result.data.email}</p>
      <p>注册时间: {result.data.createdAt}</p>
    </div>
  );
}
```

### 条件渲染错误处理

```typescript
export async function ConditionalComponent({
  showDetails,
}: {
  showDetails: boolean;
}) {
  const caller = await createServerCaller();

  // 基础数据总是获取
  const basicData = await safeServerCall(() => caller.general.health());

  // 详细数据根据条件获取
  const detailedData = showDetails
    ? await safeServerCall(() => caller.admin.getDetailedStats())
    : { success: false as const, data: null, error: "Not requested" };

  return (
    <div>
      {basicData.success ? (
        <p>系统状态: {basicData.data.status}</p>
      ) : (
        <p>无法获取系统状态</p>
      )}

      {showDetails && detailedData.success && (
        <div>
          <h3>详细统计</h3>
          <pre>{JSON.stringify(detailedData.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

## 性能优化

### 1. 并行调用

```typescript
// ❌ 串行调用 - 慢
export async function SlowComponent() {
  const caller = await createServerCaller();

  const user = await caller.user.getProfile(); // 等待 100ms
  const posts = await caller.user.getPosts(); // 等待 200ms
  const comments = await caller.user.getComments(); // 等待 150ms
  // 总计: 450ms
}

// ✅ 并行调用 - 快
export async function FastComponent() {
  const caller = await createServerCaller();

  const [userResult, postsResult, commentsResult] = await batchServerCalls([
    () => caller.user.getProfile(),
    () => caller.user.getPosts(),
    () => caller.user.getComments(),
  ]);
  // 总计: ~200ms (最慢的一个)
}
```

### 2. 条件调用

```typescript
// 只在需要时调用
export async function ConditionalDataComponent({
  includeStats = false,
  includeLogs = false,
}) {
  const caller = await createServerCaller();

  // 构建调用列表
  const calls = [() => caller.general.health()];

  if (includeStats) {
    calls.push(() => caller.admin.getStats());
  }

  if (includeLogs) {
    calls.push(() => caller.admin.getLogs());
  }

  const results = await batchServerCalls(calls);

  return (
    <div>
      {results[0].success && <p>状态: {results[0].data.status}</p>}
      {includeStats && results[1]?.success && (
        <div>统计: {JSON.stringify(results[1].data)}</div>
      )}
      {includeLogs && results[2]?.success && (
        <div>日志: {results[2].data.length} 条</div>
      )}
    </div>
  );
}
```

### 3. 缓存策略

```typescript
// 使用 Next.js 缓存
import { cache } from "react";

const getCachedUserProfile = cache(async (userId: string) => {
  const caller = await createServerCaller();
  return safeServerCall(() => caller.user.getById({ id: userId }));
});

export async function CachedUserProfile({ userId }: { userId: string }) {
  // 在同一请求中，相同 userId 的调用会被缓存
  const result = await getCachedUserProfile(userId);

  if (!result.success) {
    return <div>用户加载失败</div>;
  }

  return <div>{result.data.name}</div>;
}
```

## 实际示例

### 博客文章页面

```typescript
// src/app/blog/[slug]/page.tsx
import {
  createServerCaller,
  batchServerCalls,
} from "@/server/trpc/serverCaller";
import { notFound } from "next/navigation";

interface BlogPageProps {
  params: { slug: string };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const caller = await createServerCaller();

  // 并行获取文章和相关数据
  const [postResult, commentsResult, relatedResult] = await batchServerCalls([
    () => caller.blog.getPostBySlug({ slug: params.slug }),
    () => caller.blog.getComments({ slug: params.slug }),
    () => caller.blog.getRelatedPosts({ slug: params.slug, limit: 3 }),
  ]);

  // 如果文章不存在，显示 404
  if (!postResult.success) {
    notFound();
  }

  const post = postResult.data;

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <p>作者: {post.author.name}</p>
        <p>发布时间: {new Date(post.createdAt).toLocaleDateString()}</p>
      </header>

      <main>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>

      <aside>
        <h3>相关文章</h3>
        {relatedResult.success ? (
          <ul>
            {relatedResult.data.map((relatedPost) => (
              <li key={relatedPost.id}>
                <a href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>无相关文章</p>
        )}
      </aside>

      <section>
        <h3>评论</h3>
        {commentsResult.success ? (
          <div>
            {commentsResult.data.map((comment) => (
              <div key={comment.id} className="comment">
                <p>
                  <strong>{comment.author.name}</strong>
                </p>
                <p>{comment.content}</p>
                <p>
                  <small>{new Date(comment.createdAt).toLocaleString()}</small>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>评论加载失败</p>
        )}
      </section>
    </article>
  );
}
```

### 用户仪表板

```typescript
// src/app/dashboard/page.tsx
import {
  createServerCaller,
  batchServerCalls,
} from "@/server/trpc/serverCaller";
import { Suspense } from "react";

export default async function DashboardPage() {
  const caller = await createServerCaller();

  const [
    profileResult,
    statsResult,
    notificationsResult,
  ] = await batchServerCalls([
    () => caller.user.getProfile(),
    () => caller.user.getStats(),
    () => caller.user.getNotifications({ limit: 5 }),
  ]);

  return (
    <div className="dashboard">
      <h1>用户仪表板</h1>

      {/* 用户信息卡片 */}
      {profileResult.success ? (
        <div className="profile-card">
          <h2>欢迎回来, {profileResult.data.name}!</h2>
          <p>邮箱: {profileResult.data.email}</p>
          <p>
            加入时间:{" "}
            {new Date(profileResult.data.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div className="error-card">
          <p>无法加载用户信息</p>
        </div>
      )}

      {/* 统计信息 */}
      {statsResult.success && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>发布文章</h3>
            <p className="stat-number">{statsResult.data.postsCount}</p>
          </div>
          <div className="stat-card">
            <h3>获得点赞</h3>
            <p className="stat-number">{statsResult.data.likesCount}</p>
          </div>
          <div className="stat-card">
            <h3>评论数</h3>
            <p className="stat-number">{statsResult.data.commentsCount}</p>
          </div>
        </div>
      )}

      {/* 通知 */}
      <div className="notifications">
        <h3>最新通知</h3>
        {notificationsResult.success ? (
          <ul>
            {notificationsResult.data.map((notification) => (
              <li
                key={notification.id}
                className={notification.read ? "read" : "unread"}
              >
                <p>{notification.message}</p>
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>通知加载失败</p>
        )}
      </div>
    </div>
  );
}
```

## 最佳实践

### 1. 错误边界

```typescript
// src/components/ErrorBoundary.tsx
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>出错了</h2>
            <details>
              <summary>错误详情</summary>
              <pre>{this.state.error?.stack}</pre>
            </details>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// 使用方式
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="app-layout">{children}</div>
    </ErrorBoundary>
  );
}
```

### 2. Loading 状态

```typescript
// src/components/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>加载中...</p>
    </div>
  );
}

// 在页面中使用 Suspense
export default function MyPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DataComponent />
    </Suspense>
  );
}
```

### 3. 类型安全

```typescript
// 确保类型安全的 Server Component
import { createServerCaller } from '@/server/trpc/serverCaller';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/server/trpc';

// 提取返回类型
type UserProfile = inferProcedureOutput<AppRouter['user']['getProfile']>;
type HealthStatus = inferProcedureOutput<AppRouter['general']['health']>;

export async function TypeSafeComponent() {
  const caller = await createServerCaller();

  const profile: UserProfile = await caller.user.getProfile();
  const health: HealthStatus = await caller.general.health();

  return (
    <div>
      <p>用户: {profile.name}</p>
      <p>状态: {health.status}</p>
    </div>
  );
}
```

### 4. 测试

```typescript
// src/components/__tests__/ServerComponent.test.tsx
import { createServerCallerWithContext } from "@/server/trpc/serverCaller";
import { ServerComponentExample } from "../ServerComponentExample";

// Mock context for testing
const mockContext = {
  session: {
    user: { id: "1", name: "Test User", email: "test@example.com" },
  },
};

describe("ServerComponentExample", () => {
  it("should render user data", async () => {
    // 使用 mock context 创建测试用的 caller
    const caller = createServerCallerWithContext(mockContext);

    // 测试组件渲染
    const component = await ServerComponentExample();

    expect(component).toContain("Test User");
  });
});
```

## 常见问题

### Q: Server Component 中可以使用 useState 吗？

A: 不可以。Server Components 在服务器端运行，不能使用客户端状态管理。如需状态管理，请使用 Client Components (`'use client'`)。

### Q: 如何在 Server Component 中处理用户交互？

A: Server Components 不能处理用户交互。需要交互的部分应该是 Client Components，或使用 Server Actions。

### Q: tRPC 调用失败会导致整个页面崩溃吗？

A: 如果不做错误处理，会的。建议使用 `safeServerCall` 或 try-catch 来处理错误。

### Q: 可以在 Server Component 中使用 useQuery 吗？

A: 不可以。`useQuery` 是客户端 hook，只能在 Client Components 中使用。

### Q: 如何在 Server Component 中获取用户认证信息？

A: 通过 `getServerSession` 或在 tRPC context 中访问 session 信息：

```typescript
import { getServerSession } from "@/server/auth/helpers";

export async function AuthenticatedComponent() {
  const session = await getServerSession();

  if (!session) {
    return <div>请先登录</div>;
  }

  const caller = await createServerCaller();
  const profile = await caller.user.getProfile();

  return <div>欢迎, {profile.name}!</div>;
}
```

### Q: Server Component 的数据会被缓存吗？

A: Next.js 会自动缓存 Server Components 的输出。可以使用 `cache()` 函数或 `revalidate` 选项控制缓存行为。

---

## 📚 相关文档

- [📖 USAGE.md](./USAGE.md) - 客户端 tRPC 使用指南
- [🏗️ ARCHITECTURE.md](./ARCHITECTURE.md) - 项目架构说明
- [📁 STRUCTURE.md](./STRUCTURE.md) - 文件结构说明
- [⚡ OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md) - 性能优化总结

---

> 💡 **提示**: 这个模板提供了完整的 Server Component + tRPC 解决方案，包括类型安全、错误处理和性能优化。如有问题，请查看示例代码或提交 issue。
