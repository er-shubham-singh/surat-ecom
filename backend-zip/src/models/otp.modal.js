const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // ✅ keep this — it already creates an index
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // auto-delete after 10 minutes
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

// ❌ remove the duplicate index line
// otpSchema.index({ email: 1 });

const Otp = mongoose.model("Otp", otpSchema);
module.exports=Otp
