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

    const admin = await User.findOne({ isAdmin: true });

    if (!admin) {
      res
        .status(500)
        .json({ error: 'No hay un administrador registrado en el sistema.' });
      return;
    }

    if (payload.email === admin.email) {
      admin.googleId = payload.sub;
      await admin.save();

      const token = generateToken(admin._id as mongoose.Types.ObjectId).toString();

      res.json({
        token,
        user: {
          name: admin.name,
          email: admin.email,
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

// * Update admin
export const updateAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, name } = req.body;

  try {
    const admin = await User.findOne({ isAdmin: true });

    if (!admin) {
      res
        .status(500)
        .json({ error: 'No hay un administrador registrado en el sistema.' });
      return;
    }

    if (email) admin.email = email;
    if (name) admin.name = name;

    await admin.save();

    res.json({ message: 'Administrador actualizado con éxito.', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar al administrador.' });
  }
};

// * Register admin user

export const createAdminUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    const isUser = await User.findOne({ email });
    if (isUser) {
      res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ email, password, name });
    await user.save();
    res.status(201).json({ message: 'Admin user created' });
  } catch (error) {
    res.status(400).json({ error: 'Error creating admin user' });
  }
};

// * Register  user
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
