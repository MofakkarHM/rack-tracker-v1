import { z } from "zod";

export const createRackSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  location: z.string().trim().min(1, "Location is required").max(100),
  total_slots: z
    .number({ error: "total_slots must be a number" })
    .int()
    .min(1)
    .max(42, "A rack cannot exceed 42U"),
});

export const updateRackSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    location: z.string().trim().min(1).max(100).optional(),
    total_slots: z.number().int().min(1).max(42).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateRackInput = z.infer<typeof createRackSchema>;
export type UpdateRackInput = z.infer<typeof updateRackSchema>;
