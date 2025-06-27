import jwt from "jsonwebtoken";
import userModel from "../models/UserModel.js";
import dotenv from "dotenv";

// Middleware to authenticate and attach user to request
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again.",
      });
    }

    // Decode the JWT token
    const decoded = jwt.decode(token); // You can use jwt.verify() if needed for better security
    const clerkId = decoded?.sub || decoded?.clerkId;

    if (!clerkId) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token - no clerkId found" 
      });
    }

    // Find user in database
    const user = await userModel.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found in database" 
      });
    }

    // Attach user to request object for use in route handlers
    req.user = user; 
    req.clerkId = clerkId; // Also attach clerkId directly for convenience
    
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ 
      success: false, 
      message: "Authentication failed: " + error.message 
    });
  }
};

export default authUser;