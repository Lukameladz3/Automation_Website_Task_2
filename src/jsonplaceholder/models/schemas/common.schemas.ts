import { z } from "zod";

export const PostSchema = z
  .object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
  })
  .strict();

export type Post = z.infer<typeof PostSchema>;

export const PostArraySchema = z.array(PostSchema);

export const EmptyResponseSchema = z.object({}).strict();

export type EmptyResponse = z.infer<typeof EmptyResponseSchema>;

// User Schemas
export const GeoSchema = z
  .object({
    lat: z.string(),
    lng: z.string(),
  })
  .strict();

export type Geo = z.infer<typeof GeoSchema>;

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

export const CompanySchema = z
  .object({
    bs: z.string(),
    catchPhrase: z.string(),
    name: z.string(),
  })
  .strict();

export type Company = z.infer<typeof CompanySchema>;

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
