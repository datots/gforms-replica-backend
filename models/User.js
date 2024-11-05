// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // User's first name
  lastName: { type: String, required: true }, // User's last name
  email: { type: String, unique: true, required: true }, // Unique email address
  password: { type: String, required: true }, // User's password
  role: {
    type: String,
    enum: ["user", "admin", "template_creator"], // User roles including template creator
    default: "user", // Default role is 'user'
  },
  isActive: { type: Boolean, default: true }, // Status indicating if the user is active
  isBlocked: { type: Boolean, default: false }, // Blocked status of the user
  createdAt: { type: Date, default: Date.now }, // Timestamp for user creation
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare provided password with stored hashed password
};

// Pre-save middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Only hash the password if it has been modified
    this.password = await bcrypt.hash(this.password, 10); // Hash password with 10 salt rounds
  }
  next();
});

// Export the User model
export default mongoose.model("User", userSchema);
