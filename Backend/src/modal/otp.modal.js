import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // automatically delete after 10 minutes (600 sec)
  },
  attempts: {
    type: Number,
    default: 0,
  },
  blockedUntil: {
    type: Date,
    default: null,
  },
});

// Optional: Add an index for faster lookup
otpSchema.index({ email: 1 });

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
