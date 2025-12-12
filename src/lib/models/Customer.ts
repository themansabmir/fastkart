import mongoose, { Schema, models, model } from "mongoose";

export interface ICustomer {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  address: string;
  businessName?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    address: { type: String, required: true },
    businessName: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Index for searching customers
CustomerSchema.index({ name: "text", businessName: "text" });

export const Customer = (models.Customer as mongoose.Model<ICustomer>) ||
  model<ICustomer>("Customer", CustomerSchema);
