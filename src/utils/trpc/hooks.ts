// Re-export tRPC hooks for easy importing throughout the app
export { useTRPC, useTRPCClient } from "./setup";

// Usage examples: useTRPC
// const trpc = useTRPC();
// useQuery(trpc.hello.queryOptions());

// Usage examples: useTRPCClient
// const trpcClient = useTRPCClient();
// const { data, isLoading } = useQuery({
//   queryKey: ["hello"],
//   queryFn: () => trpcClient.hello.query(),
// });
