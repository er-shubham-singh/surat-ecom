import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Login from "./auth/login";
import Register from "./auth/register";
import ForgotPassword from "./auth/ForgotPassword"; // 👈 new component

const AuthModal = ({ isOpen, onClose, startWithRegister = false }) => {
  // can be "login", "register", or "forgot"
  const [activeForm, setActiveForm] = useState("login");

  // 👇 Start with Register if passed as prop
  useEffect(() => {
    if (startWithRegister) setActiveForm("register");
  }, [startWithRegister]);

  const switchToRegister = () => setActiveForm("register");
  const switchToLogin = () => setActiveForm("login");
  const switchToForgot = () => setActiveForm("forgot");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 sm:p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              <IoClose />
            </button>

            {activeForm === "login" && (
              <Login
                onClose={onClose}
                switchToRegister={switchToRegister}
                switchToForgot={switchToForgot}
              />
            )}

            {activeForm === "register" && (
              <Register onClose={onClose} switchToLogin={switchToLogin} />
            )}

            {activeForm === "forgot" && (
              <ForgotPassword onClose={onClose} switchToLogin={switchToLogin} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
