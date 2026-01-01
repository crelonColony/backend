import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Event from "../models/Event.js";
import User from "../models/User.js";
// import { sendMail } from "../utils/mailer.js";




dotenv.config();

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================
// 🧩 CREATE ORDER
// =========================
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    res.status(500).json({ msg: "Payment initiation failed" });
  }
};

// =========================
// 🧩 VERIFY PAYMENT & REGISTER EVENT
// =========================
// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       eventId,
//     } = req.body;

//     // Validate signature
//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign.toString())
//       .digest("hex");

//     if (razorpay_signature !== expectedSign) {
//       return res.status(400).json({ msg: "Invalid payment signature" });
//     }

//     // ✅ Payment verified successfully
//     const event = await Event.findById(eventId);
//     if (!event) return res.status(404).json({ msg: "Event not found" });

//     // ✅ Register the user for this event
//     if (event.registeredStudents.includes(req.user._id)) {
//       return res.status(400).json({ msg: "Already registered for this event" });
//     }

//     event.registeredStudents.push(req.user._id);
//     await event.save();

//     // ✅ Optional: Save this event to user's registeredEvents array
//     const user = await User.findById(req.user._id);
//     if (user) {
//       if (!user.registeredEvents.includes(eventId)) {
//         user.registeredEvents.push(eventId);
//         await user.save();
//       }
//     }

//     // ✅ Optionally send a confirmation email here (nodemailer)
//     // Example:
//     await sendEmail({
//       to: user.email,
//       subject: `Payment Successful: ${event.title}`,
//       text: `Hi ${user.name},\n\nYour payment for "${event.title}" of ₹${event.price} was successful.\nThank you!`,
//     });
//     // await sendRegistrationEmail(user.email, event.title, event.date);

//     res.status(200).json({
//       msg: "Payment verified and registered for event successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.error("❌ Error verifying payment:", error);
//     res.status(500).json({ msg: "Payment verification failed" });
//   }
// };


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId } = req.body;

    console.log("Payment Data:", req.body);
    console.log("User:", req.user);

    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ msg: "Invalid payment signature" });
    }

    // ✅ Save event registration
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Avoid duplicates
    if (!user.registeredEvents.includes(eventId)) {
      user.registeredEvents.push(eventId);
      await user.save();
    }

    // Also update Event registeredStudents
    const event = await Event.findById(eventId);
    if (event && !event.registeredStudents.includes(req.user._id)) {
      event.registeredStudents.push(req.user._id);
      await event.save();
    }

    res.status(200).json({ msg: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ msg: error.message });
  }
};
