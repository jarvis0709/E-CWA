import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, mongod: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    let uri = process.env.MONGODB_URI;

    // If no URI is provided, spin up an in-memory database automatically!
    if (!uri) {
      if (!cached.mongod) {
        cached.mongod = await MongoMemoryServer.create();
      }
      uri = cached.mongod.getUri();
      console.log("Started in-memory MongoDB at", uri);
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("Connected to MongoDB successfully");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
