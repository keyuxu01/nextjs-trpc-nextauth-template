// transform the db schema to zod
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./schema";

// Create a Zod schema for inserting users
const insertUserSchema = createInsertSchema(users, {
  // Specify the fields that are required for insertion
  // email need meet the email format
  email: (schema) => schema.email().optional(),
});

// update the user schema
const updateUserEmailSchema = insertUserSchema.pick({
  email: true,
});

const queryUserSchema = createSelectSchema(users);

export { insertUserSchema, queryUserSchema, updateUserEmailSchema };
