import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../models/UserModel.js";

// Controller to remove image background and deduct credit
const removeBgImage = async (req, res) => {
  try {
    console.log("=== Remove BG Request Started ===");
    
    // Check if user exists (from authUser middleware)
    const user = req.user;
    if (!user) {
      console.log("❌ User not found in request");
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    console.log(`✅ User found: ${user.email}, Credits: ${user.creditBalance}`);

    // Check credit balance
    if (user.creditBalance === 0) {
      console.log("❌ User has zero credits");
      return res.status(403).json({ 
        success: false, 
        message: "Credit Balance is zero", 
        creditBalance: 0 
      });
    }

    // Check if image was uploaded
    const imagePath = req.file?.path;
    if (!imagePath) {
      console.log("❌ No image file uploaded");
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }
    
    console.log(`✅ Image uploaded: ${imagePath}`);

    // Check if API key exists
    if (!process.env.CLIPDROP_API) {
      console.log("❌ CLIPDROP_API key not found in environment variables");
      return res.status(500).json({ success: false, message: "API configuration error" });
    }

    // Prepare form data for API request
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(imagePath));

    console.log("🚀 Sending request to ClipDrop API...");

    // Make API request to remove background
    const response = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
        timeout: 30000, // 30 second timeout
      }
    );

    console.log(`✅ ClipDrop API Response Status: ${response.status}`);

    // Convert response to base64
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

    // Deduct 1 credit and save
    console.log(`💳 Deducting 1 credit. Current: ${user.creditBalance}`);
    user.creditBalance -= 1;
    await user.save();
    
    console.log(`✅ Credit deducted. New balance: ${user.creditBalance}`);

    // Clean up uploaded file
    try {
      fs.unlinkSync(imagePath);
      console.log("🗑️ Temporary file cleaned up");
    } catch (cleanupError) {
      console.log("⚠️ Could not clean up temp file:", cleanupError.message);
    }

    console.log("=== Remove BG Request Completed Successfully ===");

    res.json({
      success: true,
      message: "Background removed",
      resultImage,
      creditBalance: user.creditBalance,
    });

  } catch (error) {
    console.error("=== Remove BG Error Details ===");
    console.error("Error message:", error.message);
    
    // Handle specific axios errors
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data?.toString());
      console.error("API Response Headers:", error.response.headers);
      
      // Handle specific API errors
      if (error.response.status === 400) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid image format or API request" 
        });
      } else if (error.response.status === 401) {
        return res.status(500).json({ 
          success: false, 
          message: "API authentication failed - check your API key" 
        });
      } else if (error.response.status === 429) {
        return res.status(429).json({ 
          success: false, 
          message: "API rate limit exceeded - please try again later" 
        });
      }
    } else if (error.request) {
      console.error("No response received from API");
      console.error("Request details:", error.request);
      return res.status(500).json({ 
        success: false, 
        message: "Could not connect to background removal service" 
      });
    }
    
    console.error("Full error object:", error);
    console.error("=== End Error Details ===");

    // Clean up uploaded file in case of error
    try {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
        console.log("🗑️ Temporary file cleaned up after error");
      }
    } catch (cleanupError) {
      console.log("⚠️ Could not clean up temp file after error:", cleanupError.message);
    }

    res.status(500).json({ 
      success: false, 
      message: "Background removal failed: " + error.message 
    });
  }
};

export { removeBgImage };