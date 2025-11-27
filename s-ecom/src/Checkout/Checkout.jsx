import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddDeliveryAddressForm from "./AddAddress";
import { useLocation, useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const steps = [
  { label: "Login", icon: ShoppingBagOutlinedIcon },
  { label: "Delivery Address", icon: LocalShippingOutlinedIcon },
  { label: "Order Summary", icon: AssignmentOutlinedIcon },
  { label: "Payment", icon: PaymentOutlinedIcon },
];

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

  return (
    <div className="min-h-screen bg-[#FFFDF6] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#111111] flex items-center gap-3">
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: { xs: 32, lg: 40 }, color: "#111111" }}
            />
            Secure Checkout
          </h1>
          <p className="text-[#111111]/60 mt-2 text-sm lg:text-base font-medium">
            Complete your order in a few simple steps
          </p>
        </div>

        {/* Custom Stepper */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl  shadow-lg p-6 lg:p-10">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-[#DFF200]/30 hidden lg:block">
                <div
                  className="h-full bg-[#DFF200] transition-all duration-500"
                  style={{
                    width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
                {steps.map((stepItem, index) => {
                  const StepIcon = stepItem.icon;
                  const stepNumber = index + 1;
                  const isActive = step === stepNumber;
                  const isCompleted = step > stepNumber;

                  return (
                    <div
                      key={stepItem.label}
                      className="flex flex-col items-center"
                    >
                      {/* Icon Circle */}
                      <div
                        className={`
                          w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center
                          transition-all duration-300 border-2 mb-3
                          ${
                            isCompleted
                              ? "bg-[#DFF200] border-[#CBE600]"
                              : isActive
                              ? "bg-[#DFF200] border-[#CBE600] ring-4 ring-[#DFF200]/30"
                              : "bg-white border-[#DFF200]/50"
                          }
                        `}
                      >
                        <StepIcon
                          sx={{
                            fontSize: { xs: 24, lg: 28 },
                            color:
                              isCompleted || isActive
                                ? "#111111"
                                : "#111111/40",
                          }}
                        />
                      </div>

                      {/* Label */}
                      <span
                        className={`
                          text-xs lg:text-sm font-bold text-center transition-colors
                          ${
                            isCompleted || isActive
                              ? "text-[#111111]"
                              : "text-[#111111]/40"
                          }
                        `}
                      >
                        {stepItem.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        {step > 2 && (
          <div className="mb-6">
            <Button
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#111111",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.95rem",
                "&:hover": {
                  bgcolor: "#DFF200/20",
                },
              }}
            >
              Back to Previous Step
            </Button>
          </div>
        )}

        {/* Step Content */}
        <div className="animate-fadeIn">
          {activeStep === steps.length ? (
            <React.Fragment>
              <div className="bg-white rounded-2xl border-2 border-[#DFF200] p-8 text-center shadow-lg">
                <Typography
                  sx={{
                    mt: 2,
                    mb: 1,
                    fontSize: { xs: "1.5rem", lg: "2rem" },
                    fontWeight: 700,
                    color: "#111111",
                  }}
                >
                  All steps completed - you&apos;re finished
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    pt: 2,
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={handleReset}
                    variant="contained"
                    sx={{
                      bgcolor: "#DFF200",
                      color: "#111111",
                      fontWeight: 700,
                      border: "2px solid #CBE600",
                      "&:hover": {
                        bgcolor: "#CBE600",
                      },
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#111111]/60 font-medium">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>256-bit SSL Encrypted & Secure Checkout</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
