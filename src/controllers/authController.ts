import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/User';
import { generateToken } from '../services/auth.service';

const client = new OAuth2Client(process.env.CLIENT_ID);

// * Register with google
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Google authentication failed' });
      return;
    }

    let user: IUser | null = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
      });
      await user.save();
    }

    if (payload.email === 'itsh2024.tec@gmail.com') {
      const token = generateToken(user._id as mongoose.Types.ObjectId).toString();
      
      res.json({
        token,
        user: {
          name: user.name,
          email: user.email,
          picture: payload.picture, 
        },
      });
    } else {
      res.status(403).json({ error: 'Acceso denegado. No eres un administrador.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error with Google authentication' });
  }
};

// * Register admin user
export const singUp = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
};

// * Login user
export const singIn = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    // if (!user.comparePassword) {
    //   res.status(400).json({ error: 'User does not have a password' });
    //   return;
    // }

    // const isMatch = await user.comparePassword(password);
    // if (!isMatch) {
    //   res.status(400).json({ error: 'Incorrect password or username' });
    //   return;
    // }

    const token = generateToken(user._id as mongoose.Types.ObjectId).toString();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};
