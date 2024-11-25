import { Document, Schema, model } from 'mongoose';
import { compareSync, hashSync, genSaltSync } from 'bcryptjs';

const userRoles = ['student', 'admin'] as const;

export interface User {
  username: string;
  email: string;
  password: string;
  role: (typeof userRoles)[number];
}

//REMINDER: Mongoose adds an _id field by default

interface UserDocument extends User, Document {
  comparePasswords(
    candidatePassword: string,
    hashInDb: string,
  ): boolean;
}
const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: userRoles,
    },
  },
  {
    collection: 'users',
  },
);
UserSchema.pre('save', function (next) {
  const user = this;
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = genSaltSync(10);
    const hash = hashSync(user.password, salt);

    user.password = hash;
    next();
  } catch (error: any) {
    console.log(error);
    return next(error);
  }
});

UserSchema.methods.comparePassword = (
  candidatePassword: string,
  hashInDb: string,
): boolean => {
  return compareSync(candidatePassword, hashInDb);
};

export const UserModel = model<UserDocument>('User', UserSchema);
