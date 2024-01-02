import mongoose from "mongoose";

const connectDB = async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://levelletter:EBJJ8ZE8JldABA47@levelletter.nuctdvx.mongodb.net/?retryWrites=true&w=majority",
      );
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  };


export default connectDB;