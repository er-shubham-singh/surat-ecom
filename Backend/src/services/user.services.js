// services/user.services.js
import bcrypt from 'bcrypt';
import User from '../modal/user.modal.js';
import * as jwtProvider from '../config/jwtProvider.js';

const SALT_ROUNDS = 10;

// Register a new user
const registerUser = async (userData) => {
  try {
    const { firstName, lastName, email, password, role } = userData;

    if (!email || !password) {
      throw new Error('Email and password required');
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

// Login
const login = async ({ email, password }) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new Error('Invalid email or password'); 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwtProvider.generateToken(user._id);
    const userToReturn = user.toObject();
    delete userToReturn.password;

    return { user: userToReturn, token };
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get user by ID
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error(`User not found with ID: ${userId}`);
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get user by email (returns full user; use carefully)
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

// Get user by token
const getUserByToken = async (token) => {
  try {
    const userId = jwtProvider.getUserIdFromToken(token);
    const user = await User.findById(userId).populate('addresses').select('-password');
    if (!user) throw new Error(`User not found with ID: ${userId}`);
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find().select('-password');
    return users;
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
};
