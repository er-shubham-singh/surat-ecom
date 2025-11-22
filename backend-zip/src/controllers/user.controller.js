// controllers/auth.controller.js

const userServices = require('../services/user.service');

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
    if (!email || !otp || !newPassword)
      return res.status(400).json({ error: 'email, otp and newPassword are required' });

    // confirm OTP first
    await userServices.confirmOtpService(email, otp);

    // reset password
    const result = await userServices.resetPasswordService(email, newPassword);
    return res.status(200).json({ message: result.message });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUserProfile=async (req,res)=>{
    try {
        const jwt= req.headers.authorization?.split(' ')[1];

        if(!jwt){
            return res.status(404).send({error:"token not found"})
        }
        const user=await userServices.getUserProfileByToken(jwt)

        return res.status(200).send(user)

    
    } catch (error) {
        console.log("error from controller - ",error)
        return res.status(500).send({error:error.message})
    }
}


const getAllUsers = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;

    const result = await userServices.getAllUsers({ pageNumber, pageSize });

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
module.exports = {
  getUserProfile,
  getAllUsers,
  register,
  login,
  requestVerifyOtp,
  confirmVerifyOtp,
  requestResetOtp,
  resetPassword,
};
