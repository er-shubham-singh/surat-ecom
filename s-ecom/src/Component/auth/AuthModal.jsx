import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import RegisterUserForm from "./register";
import React,{ useEffect } from "react";
import LoginUserForm from "./login";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400, md: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, md: 4 },
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function AuthModal({ handleClose, open }) {
  const location = useLocation();
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      handleClose();
      if (auth.user?.role === "ADMIN") {
        navigate("/admin");
      }
    }
  }, [auth.user]);

  return (
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
  className="modal-overlay"
>
  <Box sx={style}>
    {location.pathname === "/login" ? (
      <LoginUserForm />
    ) : (
      <RegisterUserForm />
    )}
  </Box>
</Modal>

  );
}
