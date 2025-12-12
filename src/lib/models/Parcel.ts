import mongoose, { Schema, models, model } from "mongoose";

export type ParcelStatus =
  | "PENDING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED";

export type TransportMode = "AIR" | "TRUCK" | "TRAIN";

export interface IParcel {
  _id: mongoose.Types.ObjectId;
  publicId: string; // UUID used in public URLs
  trackingId: string; // human-friendly tracking code
  customer: mongoose.Types.ObjectId; // Reference to Customer
  customerName: string; // Denormalized for backward compatibility
  customerPhone: string; // Denormalized for backward compatibility
  pickupAddress: string;
  deliveryAddress: string;
  description: string;
  weight?: number | null; // in kg
  volume?: number | null; // in cubic meters
  mode?: TransportMode | null; // transport mode
  pickupTime?: Date | null;
  deliveryTime?: Date | null;
  expectedDeliveryTime?: Date | null; // estimated delivery time for customer
  status: ParcelStatus;
  internalNotes?: string;
  assignedRider?: string | null;
  proofUrls: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ParcelSchema = new Schema<IParcel>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    trackingId: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    description: { type: String, required: true },
    weight: { type: Number },
    volume: { type: Number },
    mode: {
      type: String,
      enum: ["AIR", "TRUCK", "TRAIN"],
    },
    pickupTime: { type: Date },
    deliveryTime: { type: Date },
    expectedDeliveryTime: { type: Date },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PICKED_UP",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "RETURNED",
      ],
      default: "PENDING",
      index: true,
    },
    internalNotes: { type: String },
    assignedRider: { type: String },
    proofUrls: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Parcel = (models.Parcel as mongoose.Model<IParcel>) ||
  model<IParcel>("Parcel", ParcelSchema);
