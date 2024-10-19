import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// * Register admin user
export const register = async (req: Request, res: Response): Promise<void> => {
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
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ error: 'Incorrect password' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
};
