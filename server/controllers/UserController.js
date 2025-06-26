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
          firstName: data.first_name,
          lastname: data.last_name,
          photo: data.image_url,
        };
        await userModel.create(userData);
        return res.json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
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
    console.error("❌ Clerk webhook error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get User Credits
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.body;
    const userData = await userModel.findOne({ clerkId });
    res.json({ success: true, userCredits: userData.creditBalance });
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

// ✅ Create Razorpay Order
const paymentRazorpay = async (req, res) => {
  try {
    const { clerkId, planId } = req.body;
    const userData = await userModel.findOne({ clerkId });

    if (!userData || !planId) {
      return res.json({ success: false, message: "Invalid Credentials" });
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
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log("error :>> ", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Verify Razorpay Payment
const verifyRazorPay = async (req, res) => {
  try {
    const { rezorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(rezorpay_order_id);
    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(orderInfo.receipt);
      if (transactionData.payment) {
        return res.json({ success: false, message: "Payment already processed" });
      }

      const userData = await userModel.findOne({ clerkId: transactionData.clerkId });
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
