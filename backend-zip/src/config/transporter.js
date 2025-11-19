// config/transporter.js

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const port = Number(process.env.SMTP_PORT || 587);
const secure = port === 465; // true for 465, false for others

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Optional: verify transporter at startup
transporter
  .verify()
  .then(() => {
    console.log("✅ Mail transporter verified");
  })
  .catch((err) => {
    console.warn("⚠️ Mail transporter verification failed:", err.message);
  });

module.exports = transporter;
