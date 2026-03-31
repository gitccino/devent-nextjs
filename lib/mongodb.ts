import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

/**
 * Cached connection stored on the global object to survive
 * hot-reloads in development without spawning duplicate connections.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the NodeJS global type to hold our cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = (global.mongooseCache ??= {
  conn: null,
  promise: null,
});

export async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection if already established
  if (cached.conn) return cached.conn;

  // Reuse an in-flight connection promise to avoid race conditions
  // when multiple requests arrive before the first connection resolves
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, {
        // Maintain up to 10 sockets — tune based on expected concurrency
        maxPoolSize: 10,
      })
      .then((instance) => {
        console.log("[MongoDB] Connected");
        return instance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear the failed promise so the next call retries the connection
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
