import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "";

export async function connect() {
  try {
    const db = await mongoose.connect(uri);
    console.log("Connected to database");
    return db;
  } catch (error: any) {
    console.log(`Error connecting to database: ${error.message}`);
    throw error;
  }
}
