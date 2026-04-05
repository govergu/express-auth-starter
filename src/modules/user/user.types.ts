export type UserRole = "buyer" | "seller" | "admin" | "superadmin";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;

  avatar?: string;
  verified: boolean;
  reputation: number;

  refreshToken: string;

  emailVerificationToken: string | undefined;
  emailVerificationExpires: Date | undefined;

  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;

  createdAt?: Date;
  updatedAt?: Date;
}
