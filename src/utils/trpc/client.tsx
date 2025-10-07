'use client';

import { type AppRouter } from '@/server/trpc';
import { createTRPCContext } from '@trpc/tanstack-react-query';

// Create tRPC context for React Query integration
const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

// Export the React hooks and provider
export { TRPCProvider, useTRPC, useTRPCClient };

 