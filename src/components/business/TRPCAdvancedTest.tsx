"use client";

import { useTRPC, useTRPCClient } from "@/utils/trpc/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function TRPCAdvancedTest() {
  const [message, setMessage] = useState<string>("");

  // ===== tRPC 客户端获取方式 =====
  const trpc = useTRPC(); // 方式1: 使用 useTRPC hook（推荐）
  const trpcClient = useTRPCClient(); // 方式2: 使用 useTRPCClient 获取原始客户端

  // ===== 数据获取方式对比 =====

  // 方式1: tRPC + React Query 集成（推荐）
  const {
    data: trpcData,
    isLoading: trpcLoading,
    error: trpcError,
    refetch: trpcRefetch,
  } = useQuery(trpc.hello.queryOptions());

  // 方式2: 传统 React Query 方式
  const {
    data: manualData,
    isLoading: manualLoading,
    error: manualError,
    refetch: manualRefetch,
  } = useQuery({
    queryKey: ["hello-manual"],
    queryFn: () => trpcClient.hello.query(),
  });

  // ===== 手动调用示例 =====
  const handleManualCall = async () => {
    try {
      const result = await trpcClient.hello.query();
      setMessage(`手动调用结果: ${result}`);
    } catch (err) {
      const error = err as Error;
      setMessage(`手动调用错误: ${error.message}`);
    }
  };

  // ===== 加载和错误状态处理 =====
  if (trpcLoading || manualLoading) return <div>加载中...</div>;
  if (trpcError) return <div>tRPC 错误: {trpcError.message}</div>;
  if (manualError)
    return <div>手动调用错误: {(manualError as Error).message}</div>;

  return (
    <div className="p-6 space-y-6 border border-gray-300 rounded-lg bg-white">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
        tRPC 高级测试 - 多种调用方式对比
      </h3>

      {/* 数据展示区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* tRPC + React Query 结果 */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">
            ✅ 推荐方式: tRPC + React Query
          </h4>
          <p className="text-green-700 mb-2">
            <strong>结果:</strong> {trpcData}
          </p>
          <code className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
            useQuery(trpc.hello.queryOptions())
          </code>
        </div>

        {/* 传统 React Query 结果 */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            🔄 传统方式: React Query
          </h4>
          <p className="text-blue-700 mb-2">
            <strong>结果:</strong> {manualData}
          </p>
          <code className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
            useQuery(&#123;queryKey, queryFn&#125;)
          </code>
        </div>
      </div>

      {/* 手动调用结果 */}
      {message && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">
            🎯 手动调用结果
          </h4>
          <p className="text-yellow-700">{message}</p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => trpcRefetch()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          🔄 tRPC 重新获取
        </button>
        <button
          onClick={() => manualRefetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔄 手动重新获取
        </button>
        <button
          onClick={handleManualCall}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          🎯 直接调用
        </button>
      </div>

      {/* API 使用说明 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">📚 API 使用说明</h4>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-green-600 font-semibold">✅ 推荐:</span>
            <div>
              <code className="bg-green-100 text-green-800 px-2 py-1 rounded">
                useQuery(trpc.hello.queryOptions())
              </code>
              <p className="text-gray-600 mt-1">类型安全，自动缓存，最佳性能</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-semibold">🔄 传统:</span>
            <div>
              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                useQuery(&#123;queryKey, queryFn&#125;)
              </code>
              <p className="text-gray-600 mt-1">更灵活，但需要手动管理类型</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-purple-600 font-semibold">🎯 手动:</span>
            <div>
              <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                trpcClient.hello.query()
              </code>
              <p className="text-gray-600 mt-1">
                直接调用，无缓存，适合一次性操作
              </p>
            </div>
          </div>
        </div>

        {/* 重要提醒 */}
        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="font-semibold text-yellow-800 mb-1">⚠️ 重要提醒</p>
          <p className="text-yellow-700 text-sm">
            以上所有方法都需要{" "}
            <code className="bg-yellow-100 px-1 rounded">
              &quot;use client&quot;
            </code>{" "}
            指令。 在 Server Component 中请使用{" "}
            <code className="bg-yellow-100 px-1 rounded">
              appRouter.createCaller()
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
