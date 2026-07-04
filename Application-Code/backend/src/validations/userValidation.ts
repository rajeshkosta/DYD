import { z } from "zod";

export const addressSchema = z.object({
    house: z.string().min(1, "House number is required"),
    name: z.string().optional(),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().optional(),
    zipCode: z.string().min(5, "Zip Code is required"),
    number: z.string().optional(),
});
