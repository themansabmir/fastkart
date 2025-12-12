import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "OWNER" | "ADMIN";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["OWNER", "ADMIN"], default: "OWNER" },
  },
  { timestamps: true }
);

export const User = (models.User as mongoose.Model<IUser>) ||
  model<IUser>("User", UserSchema);
