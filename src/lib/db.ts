import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: typeof mongoose | undefined;
}

async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Please define MONGODB_URI in your .env file (e.g. mongodb+srv://USER:PASSWORD@cluster.mongodb.net/ngo-db)"
    );
  }

  if (global.mongooseConnection) {
    return global.mongooseConnection;
  }

  const conn = await mongoose.connect(uri);
  console.log("[MongoDB] Connected successfully");
  global.mongooseConnection = conn;
  return conn;
}

export default connectDB;
