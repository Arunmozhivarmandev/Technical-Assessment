import mongoose from "mongoose";

let isConnected = false; // Track connection status

export const connectDB = async () => {
  if (isConnected) {
    console.log("🟢 MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.DB_NAME || "technical_assessment",
    });

    isConnected = !!conn.connections[0].readyState;

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("🔴 MongoDB connection failed:", error);

    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔴 MongoDB connection closed due to app termination");
  process.exit(0);
});
