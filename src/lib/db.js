import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iconiccloaths';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Successfully connected to MongoDB');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ Failed to connect to MongoDB:', err.message);
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    if (mongoose.connection.readyState !== 1) {
      cached.conn = null;
      cached.promise = null;
    }
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
  }

  return cached.conn;
}

export default connectToDatabase;
