import { z } from 'zod';

// Brand schema
export const BrandSchema = z.object({
    brand: z.string(),
    id: z.number(),
}).strict();

// Brands list response schema
export const BrandsListResponseSchema = z.object({
    brands: z.array(BrandSchema),
    responseCode: z.number(),
}).strict();

export type Brand = z.infer<typeof BrandSchema>;
export type BrandsListResponse = z.infer<typeof BrandsListResponseSchema>;


