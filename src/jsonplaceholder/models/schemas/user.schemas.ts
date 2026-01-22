import { z } from "zod";
import { AddressSchema, CompanySchema } from "./base.schemas";

/**
 * All User-related schemas
 */

// ==================== Base User Schema ====================

export const UserSchema = z
  .object({
    address: AddressSchema,
    company: CompanySchema,
    email: z.string().email(),
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    username: z.string(),
    website: z.string(),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;

export const UserArraySchema = z.array(UserSchema);

// ==================== GET Operations ====================

export const GetUserResponseSchema = UserSchema;
export const GetUsersResponseSchema = UserArraySchema;
