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

    const decoded = jwt.decode(token); // You can use jwt.verify() if needed
    const clerkId = decoded?.sub || decoded?.clerkId;

    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await userModel.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
