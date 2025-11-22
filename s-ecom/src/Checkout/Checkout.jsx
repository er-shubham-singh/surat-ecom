

import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddDeliveryAddressForm from "./AddAddress";
import { useLocation, useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";

const steps = ["Login", "Delivery Address", "Order Summary", "Payment"];

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [skipped, setSkipped] = React.useState(new Set());
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const step = parseInt(queryParams.get("step")) || 1;
  const navigate = useNavigate();

  const handleNext = () => {
    let newSkipped = skipped;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    navigate(`/checkout?step=${step - 1}`);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handlePayment = () => {
    console.log("handle payment");
  };

  return (
    <Box className="px-3 sm:px-6 lg:px-20 py-6" sx={{ width: "100%" }}>
      {/* Stepper */}
      <div className="overflow-x-auto">
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              pt: 2,
              gap: 2,
            }}
          >
            <Button
              color="inherit"
              disabled={step === 2}
              onClick={handleBack}
              sx={{ mr: { sm: 1 } }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
          </Box>

          {/* Step Content */}
          <div className="my-5">
{step === 2 ? (
  <AddDeliveryAddressForm
    handleNext={handleNext}
    onOrderCreated={(orderId) =>
      navigate(`/checkout?step=3&order_id=${orderId}`)
    }
  />
) : (
  <OrderSummary />
)}

          </div>
        </React.Fragment>
      )}
    </Box>
  );
}
