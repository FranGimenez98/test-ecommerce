import mongoose from "mongoose";

const uri = process.env.MONGODB_URI ?? "";

async function connect() {
  try {
    const db = await mongoose.connect(uri);
    console.log("Connected to database");
    return db
  } catch (error) {
    console.log("Error connecting to database:", error);
  }
}
async function disconnect() {
  try {
    const db_disconnect = await mongoose.disconnect();
    console.log("Disconnected from database");
    return db_disconnect
  } catch (error) {
    console.log("Error disconnecting from database:", error);
  }
}

const db = {connect, disconnect}
export default db