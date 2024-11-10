import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  password?: string; 
  email: string;
  googleId?: string;
  name?: string; 
  comparePassword?: (password: string) => Promise<boolean>; 
}


const UserSchema: Schema<IUser> = new Schema({
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  }
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// * Hash de la contraseña antes de guardar en la base de datos
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt); 
    next();
  } catch (err: any) {
    next(err);
  }
});


export default mongoose.model<IUser>('User', UserSchema);
