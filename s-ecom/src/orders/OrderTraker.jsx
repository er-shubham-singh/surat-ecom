import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReplayIcon from '@mui/icons-material/Replay';
import { keyframes } from '@emotion/react';
import CancelIcon from "@mui/icons-material/Cancel";


const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
`;

// const steps = [
//   "Placed",
//   "Order Confirmed",
//   "Shipped",
//   "Out For Delivery",
//   "Delivered",
//   "Return Requested", // 👈 added step
//    "Return Rejected",
// ];



const CustomStepIcon = ({ icon, active, completed }) => {
  const iconStyle = {
    animation: active ? `${blink} 1s infinite` : "none",
  };

  const icons = {
    1: <ShoppingCartIcon sx={{ color: completed || active ? "#9155FD" : "#ccc", ...iconStyle }} />,
    2: <TaskAltIcon sx={{ color: completed || active ? "#9155FD" : "#ccc", ...iconStyle }} />,
    3: <LocalShippingIcon sx={{ color: completed || active ? "#1976d2" : "#ccc", ...iconStyle }} />,
    4: <DirectionsBikeIcon sx={{ color: completed || active ? "#FB8C00" : "#ccc", ...iconStyle }} />,
    5: <DoneAllIcon sx={{ color: completed || active ? "green" : "#ccc", ...iconStyle }} />,
    6: <ReplayIcon sx={{ color: "#FB8C00", ...iconStyle }} />, // animated return icon
  7: <CancelIcon sx={{ color: "#9e9e9e", ...iconStyle }} />, // Return Rejected
  8: <TaskAltIcon sx={{ color: "green", ...iconStyle }} />, // ✅ Return Accepted
  };

  return <Box>{icons[icon]}</Box>;
};

export default function OrderTraker({ activeStep, steps = [] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        {steps.map((label, index) => (
          <Step key={label} completed={index <= activeStep}>
            <StepLabel
              StepIconComponent={(props) =>
                <CustomStepIcon icon={index + 1} active={index === activeStep} completed={props.completed} />
              }
              sx={{
                ".MuiStepLabel-label": {
                  fontSize: isMobile ? "0.75rem" : "1rem",
                  textAlign: "center",
                  whiteSpace: "pre-line",
                  color: "#9155FD",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
