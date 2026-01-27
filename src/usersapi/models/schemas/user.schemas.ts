import { z } from "zod";

/**
 * User schema with optional age field
 * Note: Based on API exploration, age is optional for some users
 */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  age: z.number().int().positive().optional(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Strict user schema requiring age field
 */
export const StrictUserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  age: z.number().int().positive(),
});

export type StrictUser = z.infer<typeof StrictUserSchema>;

/**
 * Users list schema
 */
export const UsersListSchema = z.array(UserSchema);

export type UsersList = z.infer<typeof UsersListSchema>;

/**
 * Strict users list schema (all users must have age)
 */
export const StrictUsersListSchema = z.array(StrictUserSchema);

/**
 * Union schema for getUserById response
 * Can be either a User or an ErrorResponse
 */
export const GetUserByIdResponseSchema = UserSchema;
