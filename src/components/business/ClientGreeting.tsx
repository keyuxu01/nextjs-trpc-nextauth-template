"use client";

import { useTRPC } from "@/utils/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

// 客户端组件 - 使用 useSuspenseQuery
export function ClientGreeting() {
  const trpc = useTRPC();

  // 使用 Suspense 模式获取数据
  const { data: helloData } = useSuspenseQuery(
    trpc.general.hello.queryOptions()
  );

  const { data: healthData } = useSuspenseQuery(
    trpc.general.health.queryOptions()
  );

  return (
    <div className="p-2 bg-green-50 rounded">
      <strong>Client Data (Suspense):</strong>
      <div className="ml-2 text-sm">
        <div>Hello: {helloData}</div>
        <div>Health: {healthData.status}</div>
      </div>
      <br />
      <small className="text-gray-600">
        使用 useSuspenseQuery 获取预取的数据
      </small>
    </div>
  );
}
