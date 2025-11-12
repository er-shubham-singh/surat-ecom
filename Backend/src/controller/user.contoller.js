// controllers/auth.controller.js
import * as userServices from '../services/user.services.js';

const register = async (req, res) => {
  try {
    const userData = req.body;
    const { user, token } = await userServices.registerUser(userData);
    return res.status(201).json({ user, token, message: 'Registered successfully' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    console.log("req data :", req.body);
    const { email, password } = req.body;
    const { user, token } = await userServices.login({ email, password });
    return res.status(200).json({ user, token, message: 'Login successful' });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

const requestVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const result = await userServices.verifyEmailService(email);
    return res.status(200).json({ message: result.message, email: result.email });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const confirmVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and otp are required' });

    const result = await userServices.confirmOtpService(email, otp);
    return res.status(200).json({ message: result.message, email: result.email });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const requestResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const result = await userServices.sendResetOtpService(email);
    return res.status(200).json({ message: result.message, email: result.email });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ error: 'email, otp and newPassword are required' });

    // confirm otp first
    await userServices.confirmOtpService(email, otp);

    // if confirm succeeds, reset password
    const result = await userServices.resetPasswordService(email, newPassword);
    return res.status(200).json({ message: result.message });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export {
  register,
  login,
  requestVerifyOtp,
  confirmVerifyOtp,
  requestResetOtp,
  resetPassword,
};
