import { z } from 'zod';

// Product schema
export const ProductSchema = z.object({
    brand: z.string(),
    category: z.object({
        category: z.string(),
        usertype: z.object({
            usertype: z.string(),
        }).optional(),
    }).optional(),
    id: z.number(),
    name: z.string(),
    price: z.string(),
}).strict();

// Products list response schema
export const ProductsListResponseSchema = z.object({
    products: z.array(ProductSchema),
    responseCode: z.number(),
}).strict();

// Product detail response (for search)
export const SearchProductResponseSchema = z.object({
    products: z.array(ProductSchema),
    responseCode: z.number(),
}).strict();

export type Product = z.infer<typeof ProductSchema>;
export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;
export type SearchProductResponse = z.infer<typeof SearchProductResponseSchema>;
