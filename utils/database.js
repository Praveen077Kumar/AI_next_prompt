import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

console.log('================================mongo',MONGODB_URI)

// Ensure the MONGODB_URI environment variable is defined
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global caching for the database connection:
 * - `conn`: Stores the established connection.
 * - `promise`: Stores the promise of the connection while it's being established.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    // If a connection already exists, reuse it
    if (cached.conn) {
        console.log('✅ MongoDB is already connected.');
        return cached.conn;
    }

    // If no connection promise exists, create one
    if (!cached.promise) {
        console.log('⏳ Connecting to MongoDB...');
        const opts = {
            bufferCommands: false, // Disable mongoose buffering in development
            dbName: 'share-prompt',
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('✅ MongoDB connected successfully.');
                return mongoose;
            })
            .catch((err) => {
                console.error('❌ MongoDB connection error:', err);
                throw err;
            });
    }

    try {
        // Await the promise to establish the connection
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        cached.promise = null; // Reset the cached promise in case of failure
        throw err;
    }
}

export default connectToDatabase;
