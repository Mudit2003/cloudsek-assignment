import mongoose from 'mongoose';
export const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI as string)
    const connection = await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000
    });
    const db = mongoose.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};