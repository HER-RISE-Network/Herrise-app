import mongoose from 'mongoose';

export async function connectDB() {
  const uri =
    process.env.ATLAS_URI ||
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/herrise';

  console.log('Connecting to MongoDB URI:', uri);

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
