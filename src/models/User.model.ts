import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "user" | "admin";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UserDoc extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}


export interface UserModel extends mongoose.Model<UserDoc> {}


const userSchema = new mongoose.Schema<UserDoc, UserModel>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<UserDoc> =
  mongoose.model<UserDoc>("User", userSchema);

export default User;
