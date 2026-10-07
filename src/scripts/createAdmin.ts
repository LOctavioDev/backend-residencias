// * Create or update the admin user for email/password login
// ? Usage: npm run create-admin -- <email> <password> [name]
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const run = async () => {
  const [email, password, name = 'Admin'] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Uso: npm run create-admin -- <email> <password> [name]');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI as string);

  let user = await User.findOne({ email });
  if (!user) user = new User({ email });

  user.password = password;
  user.name = name;
  user.isAdmin = true;
  await user.save();

  console.log(`Administrador listo: ${email}`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
