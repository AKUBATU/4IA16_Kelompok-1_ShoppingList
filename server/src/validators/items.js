import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(80),
  quantity: z.coerce.number().int().min(1).max(999).default(1),
  unit: z.string().trim().max(20).optional().nullable(),
  category: z.string().trim().max(30).optional().nullable(),
  priority: z.coerce.number().int().min(1).max(3).default(2),
  bought: z.coerce.boolean().optional().default(false),
  note: z.string().trim().max(200).optional().nullable()
});

export const updateItemSchema = createItemSchema.partial().extend({
  name: z.string().min(1).max(80).optional()
});
