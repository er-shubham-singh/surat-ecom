import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import * as jwtProvider from '../config/jwtProvider.js';

//  Register a new user
const registerUser = async (userData) => {
  try {
    const { firstName, lastName, email, password, role } = userData;
    const isExist = await User.findOne({ email });
    if (isExist) {
      throw new Error(`User already exists with email: ${email}`);
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

//  Get user by ID
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error(`User not found with ID: ${userId}`);
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

//  Get user by email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

//  Get user by token
const getUserByToken = async (token) => {
  try {
    const userId = jwtProvider.getUserIdFromToken(token);
    const user = await User.findById(userId)
      .populate('addresses')
      .select('-password');

    if (!user) {
      throw new Error(`User not found with ID: ${userId}`);
    }

    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

//  Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find().select('-password');
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
};

export { registerUser, getUserById, getUserByEmail, getUserByToken, getAllUsers };
