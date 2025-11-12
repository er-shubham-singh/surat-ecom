import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Register from "../register";
import Login from "../login";
import ForgotPassword from "../ForgotPassword"; // ✅ use your actual file

const RegisterModal = ({ isOpen, onClose }) => {
  const [activeView, setActiveView] = useState("register");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl w-[90%] sm:w-[400px] p-6 sm:p-8 flex flex-col items-center"
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

            {/* Animated view switch */}
            <AnimatePresence mode="wait">
              {activeView === "register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <Register
                    onClose={onClose}
                    switchToLogin={() => setActiveView("login")}
                  />
                </motion.div>
              )}

              {activeView === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <Login
                    onClose={onClose}
                    switchToRegister={() => setActiveView("register")}
                    switchToForgot={() => setActiveView("forgot")}
                  />
                </motion.div>
              )}

              {activeView === "forgot" && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <ForgotPassword
                    switchToLogin={() => setActiveView("login")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
