// AuthModal.jsx
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginUserForm from "./login";
import RegisterUserForm from "./register";

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
  const navigate = useNavigate();
  const auth = useSelector((store) => store.auth);

  // local view state to avoid route-driven flicker
  // initialize from location so deep-linking works
  const initialView = location.pathname === "/register" ? "register" : "login";
  const [localView, setLocalView] = useState(initialView);

  useEffect(() => {
    // If user navigates in address bar while modal open, keep localView in sync
    setLocalView(location.pathname === "/register" ? "register" : "login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (auth.user) {
      handleClose?.();
      if (auth.user?.role === "ADMIN") {
        navigate("/admin");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  // pass this to child forms so they switch the modal view without changing route
  const switchTo = (view) => {
    if (view === "login" || view === "register") setLocalView(view);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        {localView === "login" ? (
          <LoginUserForm switchTo={switchTo} />
        ) : (
          <RegisterUserForm switchTo={switchTo} />
        )}
      </Box>
    </Modal>
  );
}
