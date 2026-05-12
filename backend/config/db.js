const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MongoDB not connected: MONGO_URI is missing.");
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    if (error.message.includes("querySrv")) {
      console.error(
        "MongoDB Atlas SRV lookup failed. Check your DNS/network, or use the non-SRV mongodb:// connection string from Atlas."
      );
    }

    console.error("Server will continue running without MongoDB.");
    return null;
  }
};

module.exports = connectDB;
