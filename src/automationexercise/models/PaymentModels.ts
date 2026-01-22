import { z } from 'zod';

export const PaymentDetailsSchema = z.object({
    cardNumber: z.string(),
    cvc: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
    nameOnCard: z.string(),
});

export type PaymentDetails = z.infer<typeof PaymentDetailsSchema>;