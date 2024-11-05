import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust the path if necessary

// Middleware to authenticate the token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Store the user info in the request
    next();
  });
};

// Middleware to check if the user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.sendStatus(404); // User not found

    if (user.role !== "admin") {
      return res.sendStatus(403); // Forbidden
    }

    next(); // User is admin, proceed to the next middleware/route handler
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal Server Error
  }
};

// Middleware to authorize roles
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming you have user info in req.user
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};
