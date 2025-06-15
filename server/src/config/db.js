import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    if (process.env.NODE_ENV == "development") {
      mongoose.set("debug", true);
    }

    console.log(`MongoDB connected ${con.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed!!", error.message);
  }
};

export default connectDB;
