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
    const { email, password } = req.body;
    const { user, token } = await userServices.login({ email, password });
    return res.status(200).json({ user, token, message: 'Login successful' });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

export { register, login };
