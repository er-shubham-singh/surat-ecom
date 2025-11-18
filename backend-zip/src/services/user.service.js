const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const jwtProvider=require("../config/jwtProvider")
const nodemailer = require("nodemailer");
const crypto = require("crypto")
const Otp = require("../models/otpSchema.js")

const createUser = async (userData)=>{
    try {

        let {firstName,lastName,email,password,role}=userData;

        const isUserExist=await User.findOne({email});


        if(isUserExist){
            throw new Error("user already exist with email : ",email)
        }

        password=await bcrypt.hash(password,8);
    
        const user=await User.create({firstName,lastName,email,password,role})

        console.log("user ",user)
    
        return user;
        
    } catch (error) {
        console.log("error - ",error.message)
        throw new Error(error.message)
    }

}

const findUserById=async(userId)=>{
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new Error("user not found with id : ",userId)
        }
        return user;
    } catch (error) {
        console.log("error :------- ",error.message)
        throw new Error(error.message)
    }
}

const getUserByEmail=async(email)=>{
    try {

        const user=await User.findOne({email});

        if(!user){
            throw new Error("user found with email : ",email)
        }

        return user;
        
    } catch (error) {
        console.log("error - ",error.message)
        throw new Error(error.message)
    }
}

const getUserProfileByToken=async(token)=>{
    try {

        const userId=jwtProvider.getUserIdFromToken(token)

        console.log("userr id ",userId)


        const user= (await findUserById(userId)).populate("addresses");
        user.password=null;
        
        if(!user){
            throw new Error("user not exist with id : ",userId)
        }
        return user;
    } catch (error) {
        console.log("error ----- ",error.message)
        throw new Error(error.message)
    }
}

const getAllUsers=async()=>{
    try {
        const users=await User.find();
        return users;
    } catch (error) {
        console.log("error - ",error)
        throw new Error(error.message)
    }
}


const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shubham.singh7985@gmail.com",
      pass: "eyyi jjfk neka foit", // Use App Password if 2FA is enabled
    },
  });

  const mailOptions = {
    from: "Fluteon <shubham.singh7985@gmail.com>",
    to: email,
    subject: "Your OTP for Fluteon Account Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #5c4dff;">Welcome to Fluteon!</h2>
        <p>Thank you for using our platform. Please use the OTP below to verify your email address:</p>
        <h1 style="letter-spacing: 5px; background: #f0f0f0; padding: 10px 20px; display: inline-block; border-radius: 5px;">
          ${otp}
        </h1>
        <p style="margin-top: 20px;">⚠️ <strong>Do not share this OTP</strong> with anyone. It will expire in <strong>10 minute</strong>.</p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 0.9em; color: #777;">If you did not request this OTP, please ignore this email.</p>
        <p style="color: #aaa;">— Team Fluteon</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


const generateOtp = () => {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remaining = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return parseInt(`${firstDigit}${remaining}`);
};

const verifyEmailService = async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const existingOtp = await Otp.findOne({ email });
  const now = new Date();

  // 1. Block sending if blockedUntil is in future
  if (existingOtp && existingOtp.blockedUntil && now < existingOtp.blockedUntil) {
    throw new Error("Too many attempts. Try again after 1 hour.");
  }

  // 2. Restrict max 3 attempts in short window
  if (existingOtp && existingOtp.createdAt) {
    const minutesSinceLast = (now - existingOtp.createdAt) / 1000 / 60;
    if (existingOtp.attempts >= 3 && minutesSinceLast < 1) {
      existingOtp.blockedUntil = new Date(now.getTime() + 1 * 60 * 1000); // 1 hour block
      await existingOtp.save();
      throw new Error("Too many OTP requests. Try again after 1 hour.");
    }
  }

  const otp = generateOtp();
  const otpStr = otp.toString();

  await Otp.findOneAndUpdate(
    { email },
    {
      otp: otpStr,
      createdAt: new Date(),
      attempts: (existingOtp?.attempts || 0) + 1,
      blockedUntil: null,
    },
    { upsert: true }
  );

  await sendEmail(email, otpStr);

  return { message: "OTP sent successfully", email };
};


const confirmOtpService = async (email, userOtp) => {
  const otpEntry = await Otp.findOne({ email });

  if (!otpEntry) throw new Error("No OTP request found for this email");

  const now = new Date();
  const expiryTime = new Date(otpEntry.createdAt.getTime() + 10 * 60 * 1000); // 10 minute

  if (now > expiryTime) {
    await Otp.deleteOne({ email });
    throw new Error("OTP has expired. Please request a new one.");
  }

  if (otpEntry.otp !== userOtp) {
    otpEntry.attempts += 1;
    if (otpEntry.attempts >= 3) {
      otpEntry.blockedUntil = new Date(Date.now() + 60 * 60 * 1000); // block 1 hour
    }
    await otpEntry.save();
    throw new Error("Invalid OTP. Please try again.");
  }

  await Otp.deleteOne({ email });
  return { success: true, message: "Email verified successfully", email };
};


const sendResetOtpService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No user registered with this email");
  }

  const otp = generateOtp();
  const otpStr = otp.toString();

  await Otp.findOneAndUpdate(
    { email },
    { otp: otpStr, createdAt: new Date(), attempts: 0, blockedUntil: null },
    { upsert: true }
  );

  await sendEmail(email, otpStr);

  return { message: "Reset OTP sent successfully", email };
};

const resetPasswordService = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No user found with this email");

  const hashed = await bcrypt.hash(newPassword, 8);
  user.password = hashed;
  await user.save();

  return { success: true, message: "Password reset successfully" };
};

module.exports={
    createUser,
    findUserById,
    getUserProfileByToken,
    getUserByEmail,
    getAllUsers,
    verifyEmailService,
    confirmOtpService,
    sendResetOtpService,
    resetPasswordService
}