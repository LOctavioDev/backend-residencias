import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// * Register admin user
export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
};

// * Login user
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string || 'secret', { expiresIn: '1d' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
}