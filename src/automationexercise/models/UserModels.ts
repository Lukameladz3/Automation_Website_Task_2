import { z } from 'zod';

const AddressSchema = z.object({
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    company: z.string(),
    country: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    mobileNumber: z.string(),
    state: z.string(),
    zipcode: z.string(),
}).strict();

export const UserSchema = z.object({
    birthDay: z.string(),
    birthMonth: z.string(),
    birthYear: z.string(),
    email: z.email(),
    name: z.string().describe('Full display name'),
    password: z.string().min(5, 'Password must be at least 5 characters long'),
    title: z.enum(['Mr', 'Mrs']),
}).extend(AddressSchema.shape).strict();

export type User = z.infer<typeof UserSchema>;

// API Response Schema validation
export const ApiResponseSchema = z.object({
    message: z.string(),
    responseCode: z.number(),
}).strict().describe('Standard API response structure');

// User detail response schema
export const UserDetailResponseSchema = z.object({
    responseCode: z.number(),
    user: z.object({
        address1: z.string(),
        address2: z.string(),
        // AutomationExercise API returns these keys (note: different from createAccount payload keys)
        birth_day: z.string(),
        birth_month: z.string(),
        birth_year: z.string(),
        city: z.string(),
        company: z.string(),
        country: z.string(),
        email: z.string(),
        first_name: z.string(),
        id: z.number(),
        last_name: z.string(),
        // Not always present in API response
        mobile_number: z.string().optional(),
        name: z.string(),
        state: z.string(),
        title: z.string(),
        zipcode: z.string(),
    }),
}).strict();

export type UserDetailResponse = z.infer<typeof UserDetailResponseSchema>;