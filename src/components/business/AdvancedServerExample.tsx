/**
 * 高级 Server Component 示例
 * 展示复杂场景下的 tRPC 使用方式
 */

import {
  batchServerCalls,
  createServerCaller,
  safeServerCall,
} from "@/server/trpc/serverCaller";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// 模拟页面参数类型
interface PageProps {
  params: { id: string };
  searchParams: { tab?: string; page?: string };
}

/**
 * 用户详情卡片组件
 */
async function UserDetailCard() {
  const caller = await createServerCaller();

  const userResult = await safeServerCall(() => caller.user.getProfile());

  if (!userResult.success) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <h3 className="font-semibold text-red-700">用户信息加载失败</h3>
        <p className="text-red-600 text-sm">{userResult.error}</p>
      </div>
    );
  }

  const user = userResult.data;

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">
            加入时间: {new Date(user.createdAt).toLocaleDateString("zh-CN")}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 用户统计组件
 */
async function UserStats() {
  // 模拟用户统计数据调用
  const statsResult = await safeServerCall(async () => {
    // 这里可以调用实际的统计 API
    await new Promise((resolve) => setTimeout(resolve, 100)); // 模拟延迟
    return {
      postsCount: 42,
      likesReceived: 128,
      commentsCount: 89,
      followersCount: 156,
    };
  });

  if (!statsResult.success) {
    return (
      <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
        <p className="text-yellow-700">统计数据暂时不可用</p>
      </div>
    );
  }

  const stats = statsResult.data;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 text-center border rounded-lg bg-blue-50">
        <div className="text-2xl font-bold text-blue-600">
          {stats.postsCount}
        </div>
        <div className="text-sm text-blue-800">发布文章</div>
      </div>
      <div className="p-4 text-center border rounded-lg bg-green-50">
        <div className="text-2xl font-bold text-green-600">
          {stats.likesReceived}
        </div>
        <div className="text-sm text-green-800">获得点赞</div>
      </div>
      <div className="p-4 text-center border rounded-lg bg-purple-50">
        <div className="text-2xl font-bold text-purple-600">
          {stats.commentsCount}
        </div>
        <div className="text-sm text-purple-800">评论数</div>
      </div>
      <div className="p-4 text-center border rounded-lg bg-orange-50">
        <div className="text-2xl font-bold text-orange-600">
          {stats.followersCount}
        </div>
        <div className="text-sm text-orange-800">关注者</div>
      </div>
    </div>
  );
}

/**
 * 用户活动时间线
 */
async function UserTimeline({ page = 1 }: { page: number }) {
  // 模拟获取用户活动
  const timelineResult = await safeServerCall(async () => {
    await new Promise((resolve) => setTimeout(resolve, 200)); // 模拟延迟

    // 模拟活动数据
    const activities = Array.from({ length: 5 }, (_, i) => ({
      id: `activity-${page}-${i}`,
      type: ["post", "comment", "like"][i % 3] as "post" | "comment" | "like",
      title: `活动 ${page * 5 + i + 1}`,
      content: `这是第 ${page} 页的第 ${i + 1} 个活动内容`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));

    return {
      activities,
      hasMore: page < 3,
      totalCount: 13,
    };
  });

  if (!timelineResult.success) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-700">
          活动时间线加载失败: {timelineResult.error}
        </p>
      </div>
    );
  }

  const { activities, hasMore, totalCount } = timelineResult.data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">用户活动 (共 {totalCount} 条)</h3>
        <span className="text-sm text-gray-500">第 {page} 页</span>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 border rounded-lg"
          >
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                activity.type === "post"
                  ? "bg-blue-500"
                  : activity.type === "comment"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    activity.type === "post"
                      ? "bg-blue-100 text-blue-700"
                      : activity.type === "comment"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {activity.type === "post"
                    ? "发文章"
                    : activity.type === "comment"
                    ? "评论"
                    : "点赞"}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(activity.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <h4 className="font-medium text-gray-800 mt-1">
                {activity.title}
              </h4>
              <p className="text-gray-600 text-sm mt-1">{activity.content}</p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <a
            href={`?page=${page + 1}`}
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            加载更多
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * 标签页内容
 */
async function TabContent({ tab, page }: { tab: string; page: number }) {
  switch (tab) {
    case "stats":
      return <UserStats />;

    case "timeline":
      return <UserTimeline page={page} />;

    default:
      return (
        <div className="p-8 text-center border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">概述</h3>
          <p className="text-gray-600">
            这是用户概述页面，显示基本信息和快速统计。
          </p>
          <div className="mt-4 space-y-2">
            <Suspense
              fallback={
                <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
              }
            >
              <UserStats />
            </Suspense>
          </div>
        </div>
      );
  }
}

/**
 * 批量数据加载示例
 */
async function BatchDataExample() {
  const caller = await createServerCaller();

  // 并行加载多个数据源
  const [systemResult, userResult, healthResult] = await batchServerCalls([
    () => caller.hello(),
    () => caller.user.getProfile(),
    () => caller.general.health(),
  ]);

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold text-gray-700 mb-3">系统信息面板</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-white rounded border">
          <strong>系统问候:</strong>{" "}
          {systemResult.success ? systemResult.data : "❌ 失败"}
        </div>
        <div className="p-3 bg-white rounded border">
          <strong>当前用户:</strong>{" "}
          {userResult.success ? userResult.data.name : "❌ 未登录"}
        </div>
        <div className="p-3 bg-white rounded border">
          <strong>系统状态:</strong>{" "}
          {healthResult.success ? healthResult.data.status : "❌ 异常"}
        </div>
      </div>
    </div>
  );
}

/**
 * 主要的用户详情页面组件
 */
export default async function AdvancedServerPage({
  params,
  searchParams,
}: PageProps) {
  const { id: userId } = params;
  const { tab = "overview", page: pageStr = "1" } = searchParams;
  const page = parseInt(pageStr, 10) || 1;

  // 验证用户ID
  if (!userId || userId === "undefined") {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          高级 Server Component 示例
        </h1>
        <p className="text-gray-600">展示复杂场景下的 tRPC 调用和数据处理</p>
      </div>

      {/* 批量数据加载示例 */}
      <Suspense
        fallback={
          <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
        }
      >
        <BatchDataExample />
      </Suspense>

      {/* 用户详情卡片 */}
      <Suspense
        fallback={
          <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
        }
      >
        <UserDetailCard />
      </Suspense>

      {/* 标签页导航 */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { key: "overview", label: "概述" },
            { key: "stats", label: "统计" },
            { key: "timeline", label: "动态" },
          ].map((tabItem) => (
            <a
              key={tabItem.key}
              href={`?tab=${tabItem.key}`}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                tab === tabItem.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tabItem.label}
            </a>
          ))}
        </nav>
      </div>

      {/* 标签页内容 */}
      <div className="min-h-[400px]">
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          }
        >
          <TabContent tab={tab} page={page} />
        </Suspense>
      </div>

      {/* 页面底部信息 */}
      <div className="text-center pt-8 border-t">
        <p className="text-sm text-gray-500">
          这个示例展示了在 Server Components 中使用 tRPC 的各种模式：
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
            错误处理
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
            批量调用
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
            条件渲染
          </span>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
            分页加载
          </span>
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
            嵌套组件
          </span>
        </div>
      </div>
    </div>
  );
}
