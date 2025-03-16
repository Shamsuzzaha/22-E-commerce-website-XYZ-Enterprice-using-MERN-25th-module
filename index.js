// Import necessary packages and configurations
import app from "./app.js";

// Load environment variables
import dotenv from 'dotenv';
dotenv.config(); // Load the environment variables from the .env file

// Use the PORT environment variable (fall back to 5030 if not defined)
const PORT = process.env.PORT || 5030;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
