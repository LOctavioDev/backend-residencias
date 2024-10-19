import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 11111;

// ? Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

// ? Routes base
app.get('/', (req, res) => {
  res.send('REST API Students');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
