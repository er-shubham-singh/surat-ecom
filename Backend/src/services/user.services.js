// services/user.services.js
import bcrypt from "bcrypt";
import User from "../modal/user.modal.js";
import Otp from "../modal/otp.modal.js"; 
import * as jwtProvider from "../config/jwtProvider.js";
import transporter from "../config/transporter.js";
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 3;
const OTP_BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour

const generateOtp = () => {
  const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
  const remaining = Math.floor(Math.random() * 10000).toString().padStart(4, "0"); // 0000-9999
  return `${firstDigit}${remaining}`; // string of length 5
};

const getOtpHtmlTemplate = (otp, purpose = "verification") => {
  const appName = process.env.APP_NAME || "My App";
  const minutes = OTP_EXPIRY_MINUTES;
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.4; color:#111;">
      <h2 style="margin:0 0 8px 0;">${appName} — ${purpose === "reset" ? "Password Reset" : "Email Verification"}</h2>
      <p style="margin:0 0 16px 0;">Use the OTP below to ${purpose === "reset" ? "reset your password" : "verify your email"}. This code expires in ${minutes} minutes.</p>
      <div style="font-size:28px; font-weight:700; letter-spacing:2px; margin:12px 0; background:#f2f2f2; display:inline-block; padding:12px 18px; border-radius:6px;">
        ${otp}
      </div>
      <p style="margin-top:18px; color:#555; font-size:13px;">If you did not request this, please ignore this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0;">
      <small style="color:#888">${appName} • ${process.env.APP_URL || ""}</small>
    </div>
  `;
};

const sendOtpEmail = async (toEmail, otp, purpose = "verification") => {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const subject = purpose === "reset" ? `${process.env.APP_NAME || "App"} — Password Reset OTP` : `${process.env.APP_NAME || "App"} — Email Verification OTP`;
  const html = getOtpHtmlTemplate(otp, purpose);

  const mailOptions = {
    from,
    to: toEmail,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// ---------- Auth / User functions (unchanged) ----------
const registerUser = async (userData) => {
  try {
    const { firstName, lastName, email, password, role } = userData;

    if (!email || !password) {
      throw new Error("Email and password required");
    }

    const normalizedEmail = email.toLowerCase();

    const isExist = await User.findOne({ email: normalizedEmail });
    if (isExist) {
      throw new Error(`User already exists with email: ${normalizedEmail}`);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    const token = jwtProvider.generateToken(user._id);
    const userToReturn = user.toObject();
    delete userToReturn.password;

    return { user: userToReturn, token };
  } catch (err) {
    throw new Error(err.message);
  }
};

const login = async ({ email, password }) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwtProvider.generateToken(user._id);
    const userToReturn = user.toObject();
    delete userToReturn.password;

    return { user: userToReturn, token };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error(`User not found with ID: ${userId}`);
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const normalizedEmail = String(email).toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) throw new Error(`User not found with email: ${normalizedEmail}`);
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserByToken = async (token) => {
  try {
    const userId = jwtProvider.getUserIdFromToken(token);
    const user = await User.findById(userId).populate("addresses").select("-password");
    if (!user) throw new Error(`User not found with ID: ${userId}`);
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find().select("-password");
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
};

// ---------- OTP related services (fixed + using transporter) ----------

const verifyEmailService = async (email) => {
  try {
    const normalizedEmail = String(email).toLowerCase();

    // don't allow if user already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const now = new Date();
    const existingOtp = await Otp.findOne({ email: normalizedEmail });

    // 1) blockedUntil check
    if (existingOtp && existingOtp.blockedUntil && now < existingOtp.blockedUntil) {
      throw new Error("Too many attempts. Try again later.");
    }

    // 2) if too many attempts within last hour, block
    if (existingOtp && existingOtp.attempts >= OTP_MAX_ATTEMPTS) {
      const minutesSinceLast = (now - existingOtp.createdAt) / 1000 / 60;
      if (minutesSinceLast < 60) {
        existingOtp.blockedUntil = new Date(now.getTime() + OTP_BLOCK_DURATION_MS);
        await existingOtp.save();
        throw new Error("Too many OTP requests. Try again later.");
      }
      // else fall through and allow new OTP (reset attempts below)
    }

    // generate and persist OTP (string)
    const otp = generateOtp();
    const otpStr = String(otp);
    const upsertObj = {
      otp: otpStr,
      createdAt: now,
      attempts: (existingOtp?.attempts || 0) + 1,
      blockedUntil: null,
    };

    await Otp.findOneAndUpdate({ email: normalizedEmail }, upsertObj, { upsert: true, new: true, setDefaultsOnInsert: true });

    // send OTP email
    await sendOtpEmail(normalizedEmail, otpStr, "verification");

    return { message: "OTP sent successfully", email: normalizedEmail };
  } catch (err) {
    throw new Error(err.message);
  }
};


const confirmOtpService = async (email, userOtp) => {
  try {
    const normalizedEmail = String(email).toLowerCase();
    const otpEntry = await Otp.findOne({ email: normalizedEmail });

    if (!otpEntry) throw new Error("No OTP request found for this email");

    const now = new Date();
    const expiryTime = new Date(otpEntry.createdAt.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    if (now > expiryTime) {
      await Otp.deleteOne({ email: normalizedEmail });
      throw new Error("OTP has expired. Please request a new one.");
    }

    if (otpEntry.otp !== String(userOtp)) {
      otpEntry.attempts = (otpEntry.attempts || 0) + 1;
      if (otpEntry.attempts >= OTP_MAX_ATTEMPTS) {
        otpEntry.blockedUntil = new Date(Date.now() + OTP_BLOCK_DURATION_MS);
      }
      await otpEntry.save();
      throw new Error("Invalid OTP. Please try again.");
    }

    // success: remove OTP entry and return success
    await Otp.deleteOne({ email: normalizedEmail });
    return { success: true, message: "Email verified successfully", email: normalizedEmail };
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * sendResetOtpService
 * - checks user exists, generates OTP and emails it for password reset
 */
const sendResetOtpService = async (email) => {
  try {
    const normalizedEmail = String(email).toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new Error("No user registered with this email");
    }

    const otp = generateOtp();
    const otpStr = String(otp);

    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      { otp: otpStr, createdAt: new Date(), attempts: 0, blockedUntil: null },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOtpEmail(normalizedEmail, otpStr, "reset");

    return { message: "Reset OTP sent successfully", email: normalizedEmail };
  } catch (err) {
    throw new Error(err.message);
  }
};

const resetPasswordService = async (email, newPassword) => {
  try {
    const normalizedEmail = String(email).toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) throw new Error("No user found with this email");

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashed;
    await user.save();

    // optionally remove any lingering OTPs after password change
    await Otp.deleteOne({ email: normalizedEmail });

    return { success: true, message: "Password reset successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

export {
  registerUser,
  login,
  getUserById,
  getUserByEmail,
  getUserByToken,
  getAllUsers,
  verifyEmailService,
  confirmOtpService,
  sendResetOtpService,
  resetPasswordService,
};
