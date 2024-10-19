import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, (process.env.JWT_SECRET as string) || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token is not valid' });
  }
};
