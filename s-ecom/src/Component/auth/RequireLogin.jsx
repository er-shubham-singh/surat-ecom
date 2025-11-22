import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';

const RequireLogin = ({ message = "Please log in to access this page." }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center py-20">
      <LockIcon sx={{ fontSize: 80, color: "gray", marginBottom: 2 }} />
      <p className="text-xl font-semibold text-gray-700 mb-4">{message}</p>
      <Button variant="contained" onClick={() => navigate("/login")}>
        Login
      </Button>
    </div>
  );
};

export default RequireLogin;
