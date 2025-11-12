// config/transporter.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.SMTP_PORT || 587);
const secure = port === 465; // true for 465, false for other ports

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// optional: verify transporter at startup (will throw if config invalid)
transporter.verify().then(() => {
  console.log("✅ Mail transporter verified");
}).catch((err) => {
  console.warn("⚠️ Mail transporter verification failed:", err.message);
});

export default transporter;
