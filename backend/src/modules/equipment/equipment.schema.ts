import { z } from "zod";
import equipmentRepository from "./equipment.repository";

export const createEquipmentSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    type: z.enum(
      ["server", "switch", "firewall", "storage", "patch", "other"],
      {
        message: "Invalid equipment type",
      },
    ),
    make: z.string().trim().min(1, "Make is required").max(50),
    tag: z.string().trim().min(1, "Tag is required").max(50),
    rack_id: z.number().int().positive().nullable().optional(),
    slot_number: z.number().int().positive().nullable().optional(),
  })
  .refine(
    (data) => {
      // if rack_id is set, slot_number must also be set and vice versa
      const hasRack = data.rack_id != null;
      const hasSlot = data.slot_number != null;
      return hasRack === hasSlot;
    },
    { message: "rack_id and slot_number must both be set or both be null" },
  )
  .refine(
    async (data) => {
      //aync database check for tag uniqueness
      const existing = await equipmentRepository.findByTag(data.tag);
      return !existing;
    },
    { message: "Equipment with this tag already exists", path: ["tag"] },
  );

export const updateEquipmentSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    type: z
      .enum(["server", "switch", "firewall", "storage", "patch", "other"])
      .optional(),
    make: z.string().trim().min(1).max(50).optional(),
    tag: z.string().trim().min(1).max(50).optional(),
    rack_id: z.number().int().positive().nullable().optional(),
    slot_number: z.number().int().positive().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;
