import User from "../models/User.js"; // Adjust the path as necessary
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error); // Log error for debugging
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt for email:", email); // Debug log

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found"); // Debug log
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      console.log("User is blocked"); // Debug log
      return res.status(403).json({ message: "User is blocked" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password"); // Debug log
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful, token generated"); // Debug log
    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Error logging in:", error); // Log error for debugging
    res.status(500).json({ message: "Error logging in" });
  }
};
