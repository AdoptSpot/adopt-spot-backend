import config from "config";
import mongoose, { connect } from "mongoose";

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    const mongoURI: string = config.get("mongoURI");
    await connect(mongoURI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
