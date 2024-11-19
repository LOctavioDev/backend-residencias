/// <reference path="./types/express.d.ts" />

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db';
import config from './config/config';

import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

// ? Routes auth
app.use('/auth', authRoutes);

// ? Routes student
app.use('/api', studentRoutes);

// ? Home
app.get('/', (req, res) => {
  res.send('REST API Students');
});

// ? Start server
app.listen(config.port, () => {
  console.log(`Server running on port: http://localhost:${config.port}`);
});
