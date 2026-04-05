import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./user.types";

interface IuserMethods {
  comparePassword(candidate: string): Promise<Boolean>;
}

type UserModel = Model<IUser, {}, IuserMethods>;

const userSchema = new Schema<IUser, UserModel, IuserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin", "superadmin"],
      default: "buyer",
    },
    avatar: String,
    verified: {
      type: Boolean,
      default: false,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
      select: false,
    },

    emailVerificationToken: String,
    emailVerificationExpires: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
