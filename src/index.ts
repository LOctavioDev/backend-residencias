/// <reference path="./types/express.d.ts" />

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db';
import config from './config/config';
import logger from './logger';

import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan('combined', {
    stream: {
      write: (message: any) => logger.info(message.trim()),
    },
  })
);
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
  logger.info(`Server running on port ${config.port}`);
});
