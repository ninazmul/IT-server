import { app } from "./app";
import { initSocketServer } from "./socketServer";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const server = http.createServer(app);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Initialize Socket.IO server
initSocketServer(server);

// Start the server
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is not defined

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); // Connect to the database once the server starts
});
