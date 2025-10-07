/**
 * User Router
 *
 * Contains all user-related tRPC procedures
 */

import { z } from "zod";
import { protectedProcedure, router } from "../init";

const userRouter = router({
  /**
   * Get current user profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;

    console.log("Getting user profile for:", session.user?.email);

    return {
      name: session.user?.name,
      email: session.user?.email,
      image: session.user?.image,
    };
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1)
          .optional(),
        email: z
          .string()
          .email()
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;

      console.log(
        "Updating profile for user:",
        session.user?.email,
        "with data:",
        input
      );

      // TODO: Implement actual database update
      return {
        success: true,
        message: "Profile updated successfully",
        data: input,
      };
    }),
});

export { userRouter };
