"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const socketServer_1 = require("./socketServer");
const db_1 = __importDefault(require("./utils/db"));
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const server = http_1.default.createServer(app_1.app);
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
// Initialize Socket.IO server
(0, socketServer_1.initSocketServer)(server);
// Start the server
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is not defined
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    (0, db_1.default)(); // Connect to the database once the server starts
});
