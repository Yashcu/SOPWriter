import { z } from "zod";

export const detailsSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number is required"),
    notes: z.string().max(1000).optional(),
});
