import { z } from "zod";

export const parcelStatusEnum = z.enum([
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "RETURNED",
]);

export const transportModeEnum = z.enum(["AIR", "TRUCK", "TRAIN"]);

export type ParcelStatus = z.infer<typeof parcelStatusEnum>;
export type TransportMode = z.infer<typeof transportModeEnum>;

export const createParcelSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  customerName: z.string().min(1, "Customer name is required").max(100),
  customerPhone: z.string().min(1, "Customer phone is required").max(20),
  pickupAddress: z.string().min(1, "Pickup address is required").max(500),
  deliveryAddress: z.string().min(1, "Delivery address is required").max(500),
  description: z.string().min(1, "Description is required").max(1000),
  weight: z.number().positive().optional().nullable(),
  volume: z.number().positive().optional().nullable(),
  mode: transportModeEnum,
  pickupTime: z.string().optional().nullable(),
  deliveryTime: z.string().optional().nullable(),
  expectedDeliveryTime: z.string().optional().nullable(),
  status: parcelStatusEnum.default("PENDING"),
  internalNotes: z.string().max(2000).optional(),
  assignedRider: z.string().max(100).optional().nullable(),
});

export const updateParcelSchema = z.object({
  customerName: z.string().min(1).max(100).optional(),
  customerPhone: z.string().min(1).max(20).optional(),
  pickupAddress: z.string().min(1).max(500).optional(),
  deliveryAddress: z.string().min(1).max(500).optional(),
  description: z.string().min(1).max(1000).optional(),
  weight: z.number().positive().optional().nullable(),
  volume: z.number().positive().optional().nullable(),
  mode: transportModeEnum.optional().nullable(),
  pickupTime: z.string().optional().nullable(),
  deliveryTime: z.string().optional().nullable(),
  expectedDeliveryTime: z.string().optional().nullable(),
  status: parcelStatusEnum.optional(),
  internalNotes: z.string().max(2000).optional().nullable(),
  assignedRider: z.string().max(100).optional().nullable(),
});

export type CreateParcelInput = z.infer<typeof createParcelSchema>;
export type UpdateParcelInput = z.infer<typeof updateParcelSchema>;
