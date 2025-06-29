// 🖥️ Server Component 示例 - 展示 serverCaller 的使用方式
import {
  createServerCaller,
  getServerData,
  safeServerCall,
} from "@/server/trpc/serverCaller";

export async function ServerComponentExample() {
  try {
    // ✅ 方式1: 使用封装的 createServerCaller
    const caller = await createServerCaller();
    const helloMessage = await caller.hello();

    // ✅ 方式2: 使用安全调用包装器
    const healthResult = await safeServerCall(() => caller.general.health());

    // ✅ 方式3: 使用预配置的数据获取
    const serverData = await getServerData();

    return (
      <div className="p-4 space-y-4 border border-green-500 rounded">
        <h3 className="font-bold text-green-600">
          ✅ Server Component + serverCaller 示例
        </h3>

        {/* 方式1: 直接调用 */}
        <div className="p-2 bg-green-50 rounded">
          <strong>Direct Call:</strong> {helloMessage}
          <br />
          <small className="text-gray-600">
            使用 createServerCaller().hello()
          </small>
        </div>

        {/* 方式2: 安全调用 */}
        <div className="p-2 bg-blue-50 rounded">
          <strong>Safe Call:</strong>
          {healthResult.success ? (
            <span className="text-green-600"> {healthResult.data.status}</span>
          ) : (
            <span className="text-red-600"> Error: {healthResult.error}</span>
          )}
          <br />
          <small className="text-gray-600">
            使用 safeServerCall() 包装错误处理
          </small>
        </div>

        {/* 方式3: 批量获取 */}
        <div className="p-2 bg-yellow-50 rounded">
          <strong>Batch Data:</strong>
          <div className="ml-2 text-sm">
            <div>
              Hello:{" "}
              {serverData.hello.success
                ? String(serverData.hello.data)
                : "Error"}
            </div>
            <div>
              Profile:{" "}
              {serverData.profile.success
                ? typeof serverData.profile.data === "object" &&
                  serverData.profile.data &&
                  "name" in serverData.profile.data
                  ? String(serverData.profile.data.name)
                  : "Unknown"
                : "Error"}
            </div>
            <div>
              Health:{" "}
              {serverData.health.success
                ? typeof serverData.health.data === "object" &&
                  serverData.health.data &&
                  "status" in serverData.health.data
                  ? String(serverData.health.data.status)
                  : "Unknown"
                : "Error"}
            </div>
          </div>
          <small className="text-gray-600">
            使用 getServerData() 批量获取常用数据
          </small>
        </div>

        {/* 使用说明 */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>🚀 新的 serverCaller 工具:</strong>
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <code>createServerCaller()</code> - 简化的调用器创建
            </li>
            <li>
              <code>safeServerCall()</code> - 带错误处理的安全调用
            </li>
            <li>
              <code>getServerData()</code> - 预配置的常用数据获取
            </li>
            <li>
              <code>batchServerCalls()</code> - 批量调用多个 API
            </li>
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 border border-red-500 rounded">
        <h3 className="font-bold text-red-600">Server Component Error</h3>
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }
}
