import { z } from "zod";

/**
 * Base schemas for common types used across multiple resources
 */

// ==================== Geographic Location ====================

export const GeoSchema = z
  .object({
    lat: z.string(),
    lng: z.string(),
  })
  .strict();

export type Geo = z.infer<typeof GeoSchema>;

// ==================== Address ====================

export const AddressSchema = z
  .object({
    city: z.string(),
    geo: GeoSchema,
    street: z.string(),
    suite: z.string(),
    zipcode: z.string(),
  })
  .strict();

export type Address = z.infer<typeof AddressSchema>;

// ==================== Company ====================

export const CompanySchema = z
  .object({
    bs: z.string(),
    catchPhrase: z.string(),
    name: z.string(),
  })
  .strict();

export type Company = z.infer<typeof CompanySchema>;

// ==================== Empty Response ====================

export const EmptyResponseSchema = z.object({}).strict();

export type EmptyResponse = z.infer<typeof EmptyResponseSchema>;
