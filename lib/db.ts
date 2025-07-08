import mongoose from "mongoose";    

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env variables");
}

let cached = global.mongoose;   

if(!cached) {
    cached = global.mongoose = { connection: null, promise: null };
}

export async function dbConnect() {
    if (cached.connection) {
        return cached.connection;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10, 
        }
        mongoose
        .connect(MONGODB_URI, opts)
        .then(() => mongoose.connection)       
    }
    try {
        cached.connection = await cached.promise;        
    }catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
    return cached.connection;
}