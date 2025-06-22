import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../models/UserModel.js";

// Controller to remove image background and deduct credit
const removeBgImage = async (req, res) => {
  try {
    const user = req.user; // ✅ From authUser middleware

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.creditBalance === 0) {
      return res.status(403).json({ success: false, message: "Credit Balance is zero", creditBalance: 0 });
    }

    const imagePath = req.file?.path;
    if (!imagePath) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(imagePath)); // ✅ fix typo: comma, not dot

    const { data } = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

    // Deduct 1 credit and save
    user.creditBalance -= 1;
    await user.save();

    res.json({
      success: true,
      message: "Background removed",
      resultImage,
      creditBalance: user.creditBalance,
    });

  } catch (error) {
    console.error("Remove BG Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export { removeBgImage };
