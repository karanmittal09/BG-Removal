import axios from "axios";
import fs from "fs";
import FormData from "form-data";

// Controller to remove image background and deduct credit
const removeBgImage = async (req, res) => {
  try {
    // Check if user exists (from authUser middleware)
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check credit balance
    if (user.creditBalance === 0) {
      return res.status(403).json({
        success: false,
        message: "Credit Balance is zero",
        creditBalance: 0
      });
    }

    // Check if image was uploaded
    const imagePath = req.file?.path;
    if (!imagePath) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // Check if API key exists
    if (!process.env.CLIPDROP_API) {
      return res.status(500).json({ success: false, message: "API configuration error" });
    }

    // Prepare form data for API request
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(imagePath));

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

    // Convert response to base64
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

    // Deduct 1 credit and save
    user.creditBalance -= 1;
    await user.save();

    // Clean up uploaded file
    try {
      fs.unlinkSync(imagePath);
    } catch (cleanupError) {
      console.error("Could not clean up temp file:", cleanupError.message);
    }

    res.json({
      success: true,
      message: "Background removed",
      resultImage,
      creditBalance: user.creditBalance,
    });

  } catch (error) {
    console.error("Remove BG Error:", error.message);

    // Handle specific axios errors
    if (error.response) {
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
      return res.status(500).json({
        success: false,
        message: "Could not connect to background removal service"
      });
    }

    // Clean up uploaded file in case of error
    try {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cleanupError) {
      console.error("Could not clean up temp file after error:", cleanupError.message);
    }

    res.status(500).json({ 
      success: false, 
      message: "Background removal failed: " + error.message 
    });
  }
};

export { removeBgImage };