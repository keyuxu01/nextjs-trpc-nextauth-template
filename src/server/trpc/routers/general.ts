/**
 * General Router
 *
 * Contains general-purpose and testing procedures
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../init";

const generalRouter = router({
  /**
   * @description Hello endpoint (protected)
   */
  hello: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;

    console.log("Session in hello query:", session);

    return `Hello from tRPC, ${session.user?.name || "User"}!`;
  }),

  /**
   * @description Public health check
   */
  health: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "tRPC server is running",
    };
  }),

  /**
   * @description Echo endpoint for testing
   */
  echo: protectedProcedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return {
        echo: input.message,
        user: ctx.session.user?.name,
        timestamp: new Date().toISOString(),
      };
    }),
});

export { generalRouter };
