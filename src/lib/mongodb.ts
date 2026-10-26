import mongoose from "mongoose";
import { logger } from "./logger";

function getSanitizedMongoUri(): string {
  let uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce_turbopack";
  uri = uri.trim();
  // Strip leading variable name if accidentally copied
  if (uri.startsWith("MONGODB_URI=")) {
    uri = uri.substring("MONGODB_URI=".length).trim();
  }
  // Strip surrounding quotes if present
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1).trim();
  }
  return uri;
}

const MONGODB_URI = getSanitizedMongoUri();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    };

    logger.info("Initiating MongoDB connection...", {
      uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@"),
    });

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        logger.info("MongoDB connected successfully", {
          database: mongooseInstance.connection.name,
          host: mongooseInstance.connection.host,
        });
        return mongooseInstance;
      })
      .catch((error) => {
        logger.error("MongoDB connection failed", { error: error.message });
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
