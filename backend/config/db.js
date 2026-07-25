import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URL or MONGO_URI is missing in environment variables.");
    }

    const connection = await mongoose.connect(mongoUri);

    console.log(`✅ Database Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDb;