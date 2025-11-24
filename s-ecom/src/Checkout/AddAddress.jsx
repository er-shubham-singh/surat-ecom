import * as React from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Backdrop,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../redux/Order/Action";
import AddressCard from "../adreess/AdreessCard";
import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function AddDeliveryAddressForm({ handleNext, onOrderCreated }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);

  const [selectedAddress, setSelectedAdress] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [zipError, setZipError] = useState("");
  const [districtFromZip, setDistrictFromZip] = useState("");
  const [postOffices, setPostOffices] = useState([]);
  const [loadingZip, setLoadingZip] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [formData, setFormData] = useState({
    state: "",
    zip: "",
    mobile: "",
    address: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [states, setStates] = useState([
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ]);
  const [showAllPlaces, setShowAllPlaces] = useState(false);

  const displayedPlaces = showAllPlaces ? postOffices : postOffices.slice(0, 5);

  const handleCreateOrder = async (item) => {
    setIsPlacingOrder(true);
    try {
      const res = await dispatch(createOrder({ address: item, jwt, navigate }));
      const orderId = res?.payload?._id;
      if (orderId && onOrderCreated) onOrderCreated(orderId);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const validateZip = async (zip) => {
    if (!/^[1-9][0-9]{5}$/.test(zip)) return;
    setLoadingZip(true);
    setZipError("");
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${zip}`);
      const data = await res.json();
      const postData = data[0];

      if (postData.Status === "Success" && postData.PostOffice?.length > 0) {
        const stateFromApi = postData.PostOffice[0].State;
        const district = postData.PostOffice[0].District;
        const poNames = postData.PostOffice.map((po) => po.Name);

        if (formData.state.toLowerCase() !== stateFromApi.toLowerCase()) {
          setZipError(
            `ZIP code district (${district}) does not match selected state (${formData.state}).`
          );
          setDistrictFromZip("");
          setPostOffices([]);
        } else {
          setZipError("");
          setDistrictFromZip(district);
          setPostOffices(poNames);
        }
      } else {
        setZipError("Address at this ZIP code not available.");
        setDistrictFromZip("");
        setPostOffices([]);
      }
    } catch (err) {
      console.error("ZIP fetch failed:", err);
      setZipError("Failed to validate ZIP.");
      setDistrictFromZip("");
      setPostOffices([]);
    }
    setLoadingZip(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "mobile") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
      if (updatedValue.length === 10 && !/^[6-9]\d{9}$/.test(updatedValue)) {
        setPhoneError("Invalid phone number. Must start with 6–9.");
      } else {
        setPhoneError("");
      }
    }

    if (name === "zip") {
      setZipError("");
      setDistrictFromZip("");
      setPostOffices([]);
      if (/^[1-9][0-9]{5}$/.test(updatedValue)) {
        validateZip(updatedValue);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const address = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      streetAddress: data.get("address"),
      city: data.get("city"),
      state: data.get("state"),
      zipCode: data.get("zip"),
      mobile: data.get("mobile"),
    };

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setPhoneError("Enter a valid 10-digit phone number starting with 6-9.");
      return;
    }

    setDistrictFromZip("");
    setPostOffices([]);
    setZipError("");
    handleNext();

    setIsPlacingOrder(true);
    try {
      const res = await dispatch(createOrder({ address, jwt, navigate }));
      const orderId = res?.payload?._id;
      if (orderId && onOrderCreated) onOrderCreated(orderId);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = loadingZip ? "hidden" : "auto";
  }, [loadingZip]);

  return (
    <Grid container spacing={4}>
      {/* Saved Address Section - Full Width */}
      <Grid item xs={12}>
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
          style={{ maxHeight: "800px" }}
        >
          {/* Fixed Header */}
          <div className="bg-gradient-to-r from-[#DFF200] to-[#CBE600] px-6 py-5 flex-shrink-0">
            <h2 className="text-xl font-bold text-[#111111] uppercase tracking-wide flex items-center gap-2">
              <HomeIcon sx={{ fontSize: 24 }} />
              Saved Addresses
            </h2>
            <p className="text-xs text-[#111111]/70 mt-1 font-medium">
              Select from your saved addresses
            </p>
          </div>

          {/* Scrollable Grid Content - Now 3 columns */}
          <div
            className="flex-1 overflow-y-auto p-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#CBE600 transparent",
            }}
          >
            {auth.user?.addresses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {auth.user.addresses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAdress(item)}
                    className={`cursor-pointer transition-all duration-300 rounded-xl p-4 ${
                      selectedAddress?.id === item.id
                        ? "bg-gradient-to-br from-[#DFF200]/30 to-[#CBE600]/20 ring-2 ring-[#DFF200]"
                        : "bg-gradient-to-br from-white to-gray-50 hover:from-[#DFF200]/10 hover:to-[#DFF200]/5"
                    }`}
                    style={{
                      boxShadow:
                        selectedAddress?.id === item.id
                          ? "0 8px 24px rgba(223, 242, 0, 0.3)"
                          : "0 2px 8px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    {/* Header with Name and Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            selectedAddress?.id === item.id
                              ? "bg-[#DFF200]"
                              : "bg-gray-100"
                          }`}
                        >
                          <PersonIcon sx={{ fontSize: 20, color: "#111111" }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-[#111111] truncate">
                            {item.firstName} {item.lastName}
                          </h3>
                          <p className="text-xs text-[#111111]/60 font-medium flex items-center gap-1">
                            <PhoneIcon sx={{ fontSize: 12 }} />
                            +91 {item.mobile}
                          </p>
                        </div>
                      </div>

                      {selectedAddress?.id === item.id && (
                        <CheckCircleIcon
                          sx={{
                            fontSize: 24,
                            color: "#10B981",
                            flexShrink: 0,
                            ml: 1,
                          }}
                        />
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[#DFF200]/40 to-transparent mb-3"></div>

                    {/* Location Info - Compact */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <PublicIcon sx={{ fontSize: 14, color: "#111111" }} />
                        <span className="font-semibold text-[#111111]/60">
                          City:
                        </span>
                        <span className="font-bold text-[#111111]">
                          {item.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <MarkunreadMailboxIcon
                          sx={{ fontSize: 14, color: "#111111" }}
                        />
                        <span className="font-semibold text-[#111111]/60">
                          PIN:
                        </span>
                        <span className="font-bold text-[#111111]">
                          {item.zipCode}
                        </span>
                      </div>

                      <div className="bg-[#FFFDF6] border-l-2 border-[#DFF200] pl-2 py-1 rounded-r">
                        <p className="text-xs font-bold text-[#111111]">
                          {item.state}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="bg-white/50 rounded-lg p-2 mb-3">
                      <div className="flex items-start gap-1">
                        <LocationOnIcon
                          sx={{
                            fontSize: 16,
                            color: "#111111",
                            mt: 0.1,
                            flexShrink: 0,
                          }}
                        />
                        <p className="text-xs text-[#111111] font-medium leading-relaxed line-clamp-2">
                          {item.streetAddress}
                        </p>
                      </div>
                    </div>

                    {/* Button */}
                    <Button
                      sx={{
                        bgcolor:
                          selectedAddress?.id === item.id
                            ? "#DFF200"
                            : "#f5f5f5",
                        color: "#111111",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        border:
                          selectedAddress?.id === item.id
                            ? "2px solid #CBE600"
                            : "2px solid #e5e5e5",
                        textTransform: "uppercase",
                        borderRadius: "10px",
                        py: 1,
                        "&:hover": {
                          bgcolor:
                            selectedAddress?.id === item.id
                              ? "#CBE600"
                              : "#e5e5e5",
                          transform: "translateY(-1px)",
                          boxShadow:
                            selectedAddress?.id === item.id
                              ? "0 4px 12px rgba(223, 242, 0, 0.4)"
                              : "0 2px 8px rgba(0, 0, 0, 0.1)",
                        },
                        "&:disabled": {
                          bgcolor: "#e5e5e5",
                          color: "#999",
                        },
                        transition: "all 0.3s ease",
                      }}
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateOrder(item);
                      }}
                      disabled={
                        isPlacingOrder || selectedAddress?.id !== item.id
                      }
                    >
                      {isPlacingOrder && selectedAddress?.id === item.id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : selectedAddress?.id === item.id ? (
                        "🚚 Deliver Here"
                      ) : (
                        "Select Address"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-center p-8">
                <div className="w-28 h-28 mb-5 bg-[#DFF200]/20 rounded-full flex items-center justify-center">
                  <LocationOnIcon sx={{ fontSize: 56, color: "#DFF200" }} />
                </div>
                <p className="text-xl font-bold text-[#111111] mb-2">
                  No Saved Addresses
                </p>
                <p className="text-sm text-[#111111]/60 mb-1 max-w-xs">
                  Add your first delivery address using the form
                </p>
                <p className="text-xs text-[#111111]/50">
                  👉 Fill the form on the right
                </p>
              </div>
            )}
          </div>
        </div>
      </Grid>

      {/* Manual Address Form Section */}
      <Grid item xs={12} lg={6}>
        {loadingZip && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl border-2 border-[#DFF200] p-8 text-center shadow-2xl">
              <CircularProgress sx={{ color: "#DFF200" }} size={48} />
              <p className="mt-4 text-[#111111] font-bold text-lg">
                Validating ZIP code...
              </p>
              <p className="text-sm text-[#111111]/60 mt-1">Please wait</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border-2 border-[#DFF200] shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#DFF200] to-[#CBE600] px-6 py-5 border-b-2 border-[#CBE600]">
            <h2 className="text-xl font-bold text-[#111111] uppercase tracking-wide flex items-center gap-2">
              <LocationOnIcon sx={{ fontSize: 24 }} />
              Add New Address
            </h2>
            <p className="text-xs text-[#111111]/70 mt-1 font-medium">
              Fill in your delivery details
            </p>
          </div>

          <Box className="p-6 lg:p-8">
            {/* Info Banner */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <InfoOutlinedIcon
                sx={{ color: "#2563eb", fontSize: 24, flexShrink: 0, mt: 0.3 }}
              />
              <div>
                <p className="text-sm font-bold text-blue-900 mb-1">
                  Quick Tip
                </p>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Enter your ZIP code to automatically get nearby areas and
                  district information. This helps us deliver faster! 📦
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3.5}>
                {/* Name Fields */}
                <Grid item xs={12}>
                  <div className="bg-[#FFFDF6] border-l-4 border-[#DFF200] pl-4 py-2 mb-2">
                    <div className="flex items-center gap-2">
                      <PersonIcon sx={{ color: "#111111", fontSize: 20 }} />
                      <span className="font-bold text-[#111111] text-sm uppercase tracking-wider">
                        Personal Details
                      </span>
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    fullWidth
                    placeholder="Enter your first name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        "&.Mui-focused fieldset": {
                          borderColor: "#DFF200",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.95rem",
                        "&.Mui-focused": {
                          color: "#111111",
                          fontWeight: 600,
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "14px 16px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    placeholder="Enter your last name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        "&.Mui-focused fieldset": {
                          borderColor: "#DFF200",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.95rem",
                        "&.Mui-focused": {
                          color: "#111111",
                          fontWeight: 600,
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "14px 16px",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="mobile"
                    label="Phone Number"
                    fullWidth
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, mobile: onlyNums }));
                      if (onlyNums.length !== 10) {
                        setPhoneError("Enter 10-digit number");
                      } else {
                        setPhoneError("");
                      }
                    }}
                    onBlur={() => {
                      if (formData.mobile.length !== 10) {
                        setPhoneError("Phone number must be 10 digits");
                      } else {
                        setPhoneError("");
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "#111111", fontSize: 20 }} />
                          <span className="ml-1 font-bold text-[#111111]">
                            +91
                          </span>
                        </InputAdornment>
                      ),
                    }}
                    error={!!phoneError}
                    helperText={phoneError}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        "&.Mui-focused fieldset": {
                          borderColor: "#DFF200",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.95rem",
                        "&.Mui-focused": {
                          color: "#111111",
                          fontWeight: 600,
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "14px 16px",
                      },
                    }}
                  />
                </Grid>

                {/* Location Details */}
                <Grid item xs={12} className="mt-2">
                  <div className="bg-[#FFFDF6] border-l-4 border-[#DFF200] pl-4 py-2 mb-2">
                    <div className="flex items-center gap-2">
                      <PublicIcon sx={{ color: "#111111", fontSize: 20 }} />
                      <span className="font-bold text-[#111111] text-sm uppercase tracking-wider">
                        Location Details
                      </span>
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    name="state"
                    label="Select State"
                    fullWidth
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Choose your state"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        "&.Mui-focused fieldset": {
                          borderColor: "#DFF200",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.95rem",
                        "&.Mui-focused": {
                          color: "#111111",
                          fontWeight: 600,
                        },
                      },
                      "& .MuiSelect-select": {
                        padding: "14px 16px",
                        fontSize: "0.95rem",
                      },
                      "& .MuiMenuItem-root": {
                        fontSize: "0.95rem",
                      },
                    }}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (!selected) {
                          return (
                            <span style={{ color: "#9ca3af" }}>
                              Select your state
                            </span>
                          );
                        }
                        return selected;
                      },
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            "& .MuiMenuItem-root": {
                              fontSize: "0.95rem",
                              padding: "10px 16px",
                            },
                          },
                        },
                      },
                    }}
                  >
                    {loadingStates ? (
                      <MenuItem disabled>Loading states...</MenuItem>
                    ) : (
                      states.map((stateName) => (
                        <MenuItem key={stateName} value={stateName}>
                          {stateName}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="city"
                    name="city"
                    label="City"
                    fullWidth
                    placeholder="Enter your city name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        "&.Mui-focused fieldset": {
                          borderColor: "#DFF200",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.95rem",
                        "&.Mui-focused": {
                          color: "#111111",
                          fontWeight: 600,
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "14px 16px",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="zip"
                    label="ZIP / Postal Code"
                    fullWidth
                    required
                    placeholder="Enter 6-digit PIN code"
                    value={formData.zip}
                    onChange={handleChange}
                    onBlur={() => validateZip(formData.zip)}
                    error={!!zipError}
                    helperText={zipError || "We'll auto-detect your district"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MarkunreadMailboxIcon
                            sx={{ color: "#111111", fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        "&.Mui-focused fieldset": {
                          borderColor: "#DFF200",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.95rem",
                        "&.Mui-focused": {
                          color: "#111111",
                          fontWeight: 600,
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "14px 16px",
                      },
                    }}
                  />
                </Grid>

                {districtFromZip && (
                  <Grid item xs={12}>
                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3 animate-slideIn">
                      <CheckCircleIcon
                        sx={{ color: "#10B981", fontSize: 28 }}
                      />
                      <div>
                        <p className="text-green-800 font-bold text-sm mb-0.5">
                          ✓ Verified District
                        </p>
                        <p className="text-green-700 text-lg font-bold">
                          {districtFromZip}
                        </p>
                      </div>
                    </div>
                  </Grid>
                )}

                {postOffices.length > 0 && (
                  <Grid item xs={12}>
                    <Box className="bg-gradient-to-br from-[#FFFDF6] to-[#DFF200]/10 border-2 border-[#DFF200] rounded-xl p-5 animate-slideIn">
                      <div className="flex items-center gap-2 mb-4">
                        <LocationOnIcon
                          sx={{ color: "#111111", fontSize: 22 }}
                        />
                        <span className="font-bold text-[#111111] text-base">
                          📍 Quick Select Your Area
                        </span>
                      </div>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {displayedPlaces.map((place, idx) => (
                          <Button
                            key={idx}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                address: `${place}, ${prev.address || ""}`,
                              }))
                            }
                            size="medium"
                            variant="outlined"
                            sx={{
                              borderColor: "#DFF200",
                              color: "#111111",
                              fontWeight: 600,
                              borderWidth: 2,
                              textTransform: "none",
                              borderRadius: "10px",
                              px: 2.5,
                              py: 1,
                              fontSize: "0.9rem",
                              "&:hover": {
                                borderColor: "#CBE600",
                                bgcolor: "#DFF200",
                                borderWidth: 2,
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            {place}
                          </Button>
                        ))}
                        {postOffices.length > 5 && (
                          <Button
                            size="small"
                            onClick={() => setShowAllPlaces((prev) => !prev)}
                            sx={{
                              textTransform: "none",
                              color: "#111111",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              textDecoration: "underline",
                            }}
                          >
                            {showAllPlaces
                              ? "Show Less ↑"
                              : `Show ${postOffices.length - 5} More ↓`}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    required
                    id="address"
                    name="address"
                    label="Complete Address"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House No., Building Name, Street, Landmark (e.g., Near XYZ Mall)"
                    InputLabelProps={{
                      shrink: Boolean(formData.address),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        "&.Mui-focused fieldset": {
                          borderColor: "#DFF200",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.95rem",
                        "&.Mui-focused": {
                          color: "#111111",
                          fontWeight: 600,
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "14px 16px",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    sx={{
                      padding: "1.1rem 2rem",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      bgcolor: "#DFF200",
                      color: "#111111",
                      border: "2px solid #CBE600",
                      borderRadius: "16px",
                      boxShadow: "0 6px 20px rgba(223, 242, 0, 0.35)",
                      letterSpacing: "0.5px",
                      "&:hover": {
                        bgcolor: "#CBE600",
                        transform: "translateY(-3px)",
                        boxShadow: "0 10px 28px rgba(223, 242, 0, 0.45)",
                      },
                      "&:disabled": {
                        bgcolor: "#f5f5f5",
                        color: "#999",
                        border: "2px solid #e5e5e5",
                      },
                      transition: "all 0.3s ease",
                    }}
                    size="large"
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <CircularProgress size={26} sx={{ color: "#999" }} />
                    ) : (
                      "Continue to Order Summary →"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </div>
      </Grid>

      {/* Loader while placing order */}
      {isPlacingOrder && (
        <Backdrop
          open
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <div className="text-center">
            <CircularProgress color="inherit" size={60} />
            <p className="mt-4 font-bold text-xl">Processing your order...</p>
            <p className="text-sm text-white/80 mt-2">
              Please wait, do not refresh
            </p>
          </div>
        </Backdrop>
      )}

      <style>{`
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
  
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbe600;
    border-radius: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #dff200;
  }
`}</style>
    </Grid>
  );
}
