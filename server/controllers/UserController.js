import { Webhook } from "svix";
import userModel from "../models/UserModel.js";
import transactionModel from "../models/transactionModel.js";
import Razorpay from "razorpay";

// ✅ Clerk Webhook Handler — expects raw buffer
const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body; // raw Buffer
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = whook.verify(payload, headers);
    const { data, type } = JSON.parse(payload.toString());

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstname: data.first_name,
          lastname: data.last_name,
          photo: data.image_url,
        };
        await userModel.create(userData);
        return res.json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstname: data.first_name,
          lastname: data.last_name,
          photo: data.image_url,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        return res.json({ success: true });
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        return res.json({ success: true });
      }

      default:
        return res.status(400).json({ success: false, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Clerk webhook error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get User Credits - FIXED
const userCredits = async (req, res) => {
  try {
    // Get user data from middleware (req.user is set by authUser middleware)
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Use the user data directly from middleware
    res.json({ success: true, userCredits: req.user.creditBalance });
  } catch (error) {
    console.log("error :>> ", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Razorpay Setup
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order - FIXED
const paymentRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    
    // Get clerkId from authenticated user (req.user is set by authUser middleware)
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const clerkId = req.user.clerkId;
    const userData = req.user; // Use user data from middleware

    if (!planId) {
      return res.json({ success: false, message: "Plan ID is required" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: "Invalid Plan" });
    }

    const date = Date.now();

    const transactionData = {
      clerkId,
      plan,
      amount,
      credits,
      date,
    };

    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id.toString(),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log("Razorpay error:", error);
        return res.json({ success: false, message: error.message || "Payment order creation failed" });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log("error :>> ", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Verify Razorpay Payment - FIXED
const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body; // Fixed typo: was "rezorpay_order_id"

    if (!razorpay_order_id) {
      return res.json({ success: false, message: "Order ID is required" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    
    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(orderInfo.receipt);
      
      if (!transactionData) {
        return res.json({ success: false, message: "Transaction not found" });
      }

      if (transactionData.payment) {
        return res.json({ success: false, message: "Payment already processed" });
      }

      const userData = await userModel.findOne({ clerkId: transactionData.clerkId });
      
      if (!userData) {
        return res.json({ success: false, message: "User not found" });
      }

      const creditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id, { creditBalance });

      await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

      return res.json({ success: true, message: "Credits Added" });
    } else {
      return res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.log("error :>> ", error.message);
    res.json({ success: false, message: error.message });
  }
};

export { clerkWebhooks, userCredits, paymentRazorpay, verifyRazorPay };