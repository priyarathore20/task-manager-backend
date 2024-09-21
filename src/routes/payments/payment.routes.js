import { Router } from "express";
import Razorpay from "razorpay";
import { randomBytes, createHmac } from "crypto";

const paymentRouter = Router();

// Initialize Razorpay instance with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY_ID",
  key_secret: "YOUR_RAZORPAY_SECRET_KEY",
});

// Route to create an order
paymentRouter.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100, // amount in the smallest currency unit (e.g., paisa for INR)
    currency: currency,
    receipt: randomBytes(10).toString("hex"), // unique receipt ID
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Route to verify payment signature
paymentRouter.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = createHmac("sha256", "YOUR_RAZORPAY_SECRET_KEY")
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ message: "Payment verified successfully!" });
  } else {
    res.status(400).json({ message: "Invalid signature" });
  }
});

export default paymentRouter;
