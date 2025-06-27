// checkRazorpayKey.js
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

instance.orders.all({ count: 1 }, (err, orders) => {
  if (err) {
    console.log("❌ Razorpay authentication failed:");
    console.error(err.error || err.message || err);
  } else {
    console.log("✅ Razorpay keys are valid.");
    console.log("Sample order fetched:", orders);
  }
});
