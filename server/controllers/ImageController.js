import axios from "axios";
import fs from "fs";
import FormData from 'form-data'
import userModel from "../models/UserModel.js";

// Controller func to remove background
const removeBgImage = async (req, res) => {
  try {
    
  } 
  catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export {removeBgImage}
