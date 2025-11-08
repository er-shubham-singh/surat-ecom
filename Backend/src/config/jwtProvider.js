import 'dotenv/config';
import jwt from 'jsonwebtoken';


const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '48h' });
};

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    return decodedToken.userId; 
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export { generateToken, getUserIdFromToken };
