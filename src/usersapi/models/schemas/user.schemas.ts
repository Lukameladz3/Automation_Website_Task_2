import { z } from "zod";

/**
 * User schema
 */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  age: z.number().int().positive(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Users list schema
 */
export const UsersListSchema = z.array(UserSchema);

export type UsersList = z.infer<typeof UsersListSchema>;

/**
 * Union schema for getUserById response
 * Can be either a User or an ErrorResponse
 */
export const GetUserByIdResponseSchema = UserSchema;
