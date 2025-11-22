import {
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/Auth/action";
import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react'

export default function RegisterUserForm({ switchTo }) {
    const baseUrl = import.meta.env.VITE_React_BASE_API_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const  {auth } = useSelector((store) => store);

  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", ""]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);



  const handleSnackbar = (msg) => {
    setSnackBarMessage(msg);
    setSnackBarOpen(true);
  };
  const handleCloseSnackbar = () => setSnackBarOpen(false);

const handleSendOtp = async () => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.startsWith("a@")) {
    return handleSnackbar("Please enter a valid and acceptable email.");
  }

  try {
    setOtpLoading(true);
const res = await axios.post(`${baseUrl}/auth/send-otp`, { email });
    // console.log("res data....", res);
    handleSnackbar(res.data.message || "OTP sent successfully!");
    setOtpSent(true);
  } catch (err) {
    // console.error("❌ OTP Send Error:", err?.response || err); // <-- Log full error
    const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to send OTP.";

    // Show special message if user already exists
    if (errorMsg.toLowerCase().includes("user already exists")) {
      handleSnackbar("User already registered. Please login.");
    } else {
      handleSnackbar(errorMsg);
    }
  } finally {
    setOtpLoading(false);
  }
};


const handleVerifyOtp = async () => {
  const enteredOtp = otpInputs.join("");
  if (enteredOtp.length !== 5) {
    return handleSnackbar("Please enter a valid 5-digit OTP.");
  }

  try {
    setVerifyingOtp(true);
    const res = await axios.post(`${baseUrl}/auth/verify-otp`, {
      email,
      otp: enteredOtp,
    });


    if (res.data.success === true) {
      // console.log("✅ Setting Email Verified to true");
      setEmailVerified(true); // 👈 This should now work
      handleSnackbar("Email verified successfully!");
    } else {
      handleSnackbar(res.data.message || "OTP verification failed.");
    }
  } catch (err) {
    handleSnackbar(err.response?.data?.message || "OTP verification failed.");
  } finally {
    setVerifyingOtp(false);
  }
};

  useEffect(() => {
  // console.log("Email verification status updated:", emailVerified);
}, [emailVerified]);


  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otpInputs];
      newOtp[index] = value;
      setOtpInputs(newOtp);

      if (value && index < 4) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!passwordRegex.test(formData.password)) {
    setPasswordError(
      "Password must be at least 8 characters, include uppercase, lowercase, number & special character."
    );
    return;
  } else {
    setPasswordError("");
  }

  try {
    setRegisterLoading(true);
    await dispatch(register({ ...formData, email }));
  } finally {
    setRegisterLoading(false);
  }
};


  useEffect(() => {
    if (auth.user) handleSnackbar("Register Success");
    if (auth.error) handleSnackbar(auth.error);
  }, [auth.user, auth.error]);

  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => !emailVerified && setEmail(e.target.value)}
              disabled={emailVerified}
              required
              fullWidth
            />
          </Grid>

          {!otpSent && !emailVerified && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSendOtp}
                disabled={otpLoading}
              >
                {otpLoading ? <CircularProgress size={24} /> : "Send OTP"}
              </Button>
            </Grid>
          )}

          {otpSent && !emailVerified && (
            <>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" gap={1}>
                  {otpInputs.map((digit, i) => (
                    <TextField
                      key={i}
                      id={`otp-${i}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center" },
                      }}
                      sx={{ width: "50px" }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp}
                >
                  {verifyingOtp ? <CircularProgress size={24} /> : "Verify OTP"}
                </Button>
              </Grid>
            </>
          )}

          {emailVerified && (
            <>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
          <TextField
  label="Password"
  type="password"
  value={formData.password}
  onChange={(e) => {
    setFormData({ ...formData, password: e.target.value });
    if (passwordError) setPasswordError(""); // Clear error on change
  }}
  error={!!passwordError}
  helperText={passwordError}
  fullWidth
  required
/>

              </Grid>
              <Grid item xs={12}>
<Button
  type="submit"
  fullWidth
  variant="contained"
  color="primary"
  disabled={!emailVerified || registerLoading}
>
  {registerLoading ? <CircularProgress size={24} color="inherit" /> : "Register"}
</Button>

              </Grid>
            </>
          )}
        </Grid>
      </form>

      <Box display="flex" justifyContent="center" mt={2}>
        <span>If you already have an account?</span>
// inside RegisterUserForm component JSX near the bottom
<Box display="flex" justifyContent="center" mt={2}>
  <span>If you already have an account?</span>
  <Button
    onClick={() => {
      if (typeof switchTo === "function") {
        switchTo("login");
      } else {
        // fallback to navigate if component used outside modal
        navigate("/login");
      }
    }}
    size="small"
  >
    Login
  </Button>
</Box>


      </Box>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
