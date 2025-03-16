// -------import-----------
import express from 'express';
import router from './routes/api.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongosanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config(); // Load the environment variables from .env file

// Set up the Express app
const app = new express();

// Access environment variables
const { MONGODB_STRING, MONGODB_OPTION, LIMIT_MESSAGE, JSON_SIZE, RATE_LIMIT_TIME, TIME_LIMIT_INTERVAL } = process.env;

// ----------use packages--------
// Set security HTTP headers
app.use(helmet());

// Limit repeated requests from the same IP (Prevents DDoS & brute-force attacks)
const limiter = rateLimit({
    windowMs: parseInt(RATE_LIMIT_TIME), // In milliseconds
    max: parseInt(TIME_LIMIT_INTERVAL), // Limit each IP to..times requests per windowMs
    message: LIMIT_MESSAGE,
});
app.use(limiter);

// Prevent NoSQL Injection attacks
app.use(mongosanitize());

// Prevent XSS (Cross-Site Scripting) attacks
app.use(xss());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Enable CORS
app.use(cors());

// Parse cookies from incoming requests
app.use(cookieParser());

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ limit: JSON_SIZE, extended: true }));

// Disable ETag generation to prevent caching validation overhead and manual caching management
app.set('etag', false);

// -------- MongoDB connection--------
const mongooseOptions = JSON.parse(MONGODB_OPTION);  // Parse the MongoDB options
mongoose.connect(MONGODB_STRING, mongooseOptions)
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log(err);
    });

// Use the router for API version 1 (this will handle requests to '/api/v1')
app.use("/api/v1", router);

// -----------React front-end-----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add React Front End Routing
app.use(express.static('view/dist'));
app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'view', 'dist', 'index.html'));
});

export default app;
