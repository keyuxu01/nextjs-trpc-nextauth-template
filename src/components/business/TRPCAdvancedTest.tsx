"use client"; // 🚨 必需！以下所有功能都需要客户端

import { useTRPC, useTRPCClient } from "@/utils/trpc/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function TRPCAdvancedTest() {
  const [message, setMessage] = useState<string>("");

  // ❌ Server Component 中不可用：React hooks
  // 方式1: 使用 useTRPC hook（正确的 API 使用方式）
  const trpc = useTRPC(); // ❌ Server Component 不支持

  // 方式2: 使用 useTRPCClient 获取原始客户端
  const trpcClient = useTRPCClient(); // ❌ Server Component 不支持

  // 方式3: 使用 useTRPC + useQuery（推荐方式）
  // ❌ Server Component 中不可用：useQuery hook
  const {
    data: trpcData,
    isLoading: trpcLoading,
    error: trpcError,
    refetch: trpcRefetch,
  } = useQuery(trpc.hello.queryOptions()); // ❌ Server Component 不支持

  // 方式4: 传统方式 - 手动使用 React Query + tRPC 客户端
  // ❌ Server Component 中不可用：useQuery hook
  const {
    data: manualData,
    isLoading: manualLoading,
    error: manualError,
    refetch: manualRefetch,
  } = useQuery({
    queryKey: ["hello-manual"],
    queryFn: () => trpcClient.hello.query(),
  }); // ❌ Server Component 不支持

  // ❌ Server Component 中不可用：事件处理器中的异步调用
  // 手动调用示例（比如在按钮点击时）
  const handleManualCall = async () => {
    try {
      const result = await trpcClient.hello.query();
      setMessage(`Manual call result: ${result}`);
    } catch (err) {
      const error = err as Error;
      setMessage(`Manual call error: ${error.message}`);
    }
  };

  if (trpcLoading || manualLoading) return <div>Loading tRPC test...</div>;
  if (trpcError) return <div>tRPC Error: {trpcError.message}</div>;
  if (manualError)
    return <div>Manual Error: {(manualError as Error).message}</div>;

  return (
    <div className="p-4 space-y-4 border border-blue-500 rounded">
      <h3 className="font-bold text-blue-600">Advanced tRPC Test</h3>

      {/* tRPC + useQuery 结果 */}
      <div className="p-2 bg-green-50 rounded">
        <strong>tRPC + useQuery 结果:</strong> {trpcData}
        <br />
        <small className="text-gray-600">使用 trpc.hello.queryOptions()</small>
      </div>

      {/* 传统 React Query 结果 */}
      <div className="p-2 bg-blue-50 rounded">
        <strong>传统 React Query 结果:</strong> {manualData}
        <br />
        <small className="text-gray-600">使用 queryKey + queryFn</small>
      </div>

      {/* 手动调用结果 */}
      {message && <div className="p-2 bg-yellow-50 rounded">{message}</div>}

      {/* 操作按钮 */}
      <div className="space-x-2">
        <button
          onClick={() => trpcRefetch()}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          tRPC 重新获取
        </button>
        <button
          onClick={() => manualRefetch()}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          手动重新获取
        </button>
        <button
          onClick={handleManualCall}
          className="px-3 py-1 bg-purple-500 text-white rounded"
        >
          直接调用
        </button>
      </div>

      {/* API 说明 */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>推荐方式:</strong>{" "}
          <code>useQuery(trpc.hello.queryOptions())</code>
        </p>
        <p>
          <strong>传统方式:</strong>{" "}
          <code>useQuery(&#123;queryKey, queryFn&#125;)</code>
        </p>
        <p>
          <strong>手动调用:</strong> <code>trpcClient.hello.query()</code>
        </p>
        <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="font-semibold text-yellow-800">
            ⚠️ Server Component 注意事项:
          </p>
          <p className="text-yellow-700 text-xs">
            以上所有方法都需要 <code>&quot;use client&quot;</code> 指令。 在
            Server Component 中请使用 <code>appRouter.createCaller()</code>
          </p>
        </div>
      </div>
    </div>
  );
}
