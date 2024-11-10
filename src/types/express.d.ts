import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;         
      userId?: mongoose.Types.ObjectId;   
    }
  }
}
