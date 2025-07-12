import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// console.log("MONGO_URI:", process.env.MONGODB_URL); // remove this in production!

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URL, {
       autoIndex: false,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    // console.log("✅ Connected to DB:", mongoose.connection.name);


    if (process.env.NODE_ENV == "development") {
      mongoose.set("debug", true);
    }

    console.log(`MongoDB connected ${con.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed!!", error.message);
  }
};

export default connectDB;
