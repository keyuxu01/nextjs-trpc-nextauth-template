/**
 * Main tRPC Router
 *
 * Combines all sub-routers into the main application router
 */

import { router } from "./init";
import { generalRouter } from "./routers/general";
import { userRouter } from "./routers/user";

/**
 * Main application router
 * Add new routers here as the application grows
 */
export const appRouter = router({
  /**
   * @description 通用路由
   */
  general: generalRouter,

  /**
   * @description 用户相关路由
   */
  user: userRouter,

  // Backward compatibility - keep the old hello endpoint at root level
  hello: generalRouter.hello,
});

// Export the router type for client-side usage
export type AppRouter = typeof appRouter;

// Re-export context creation for API routes
export { createTRPCContext } from "./init";
