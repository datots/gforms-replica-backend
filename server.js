// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Import database connection
import authRoutes from "./routes/authRoutes.js"; // Import combined authentication routes
import userRoutes from "./routes/user.js"; // Import user routes
import templateRoutes from "./routes/templateRoutes.js"; // Import template routes
import analyticsRouter from "./routes/analytics.js";

// Configure environment variables
dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // Add the user routes if needed
app.use("/api/template", templateRoutes); // Add the template routes
app.use("/api/analytics", analyticsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An error occurred" });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
