

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
  const [formData, setFormData] = useState({ state: "", zip: "", mobile: "" });
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
  "Puducherry"
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
          setZipError(`ZIP code district (${district}) does not match selected state (${formData.state}).`);
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

  const handlePlaceSelect = (place) => {
    setFormData((prev) => ({
      ...prev,
      address: `${place}, ${prev.address || ""}`,
    }));
  };

  useEffect(() => {
    document.body.style.overflow = loadingZip ? "hidden" : "auto";
  }, [loadingZip]);



// useEffect(() => {
//   const fetchStates = async () => {
//     setLoadingStates(true);
//     try {
//       const res = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
//       const data = await res.json();
//       if (data.states) {
//         const stateNames = data.states.map((s) => s.state_name);
//         setStates(stateNames);
//       }
//     } catch (err) {
//       console.error("Failed to fetch states", err);
//     } finally {
//       setLoadingStates(false);
//     }
//   };

//   fetchStates();
// }, []);


return (
  <Grid container spacing={4}>
    {/* Saved Address Section */}
    <Grid item xs={12} lg={5}>
<Box className="border rounded-md shadow-md h-[30.5rem] overflow-y-scroll">
  {auth.user?.addresses?.length > 0 ? (
    auth.user.addresses.map((item) => (
      <div
        key={item.id}
        onClick={() => setSelectedAdress(item)}
        className="p-5 py-7 border-b cursor-pointer"
      >
        <AddressCard address={item} />
        {selectedAddress?.id === item.id && (
          <Button
            sx={{ mt: 2 }}
            size="large"
            variant="contained"
            color="primary"
            onClick={() => handleCreateOrder(item)}
          >
            {isPlacingOrder ? <CircularProgress size={24} color="inherit" /> : "Deliver Here"}
          </Button>
        )}
      </div>
    ))
  ) : (
    <div className="flex flex-col justify-center items-center h-full text-center p-6">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2620/2620983.png"
        alt="No Address"
        className="w-20 h-20 mb-4 opacity-60"
      />
      <p className="text-lg font-medium text-gray-700 mb-2">
        No saved address found
      </p>
      <p className="text-sm text-gray-500 mb-3">
        Please fill the form on the right side or go below to add a new delivery address.
      </p>
    </div>
  )}
</Box>

    </Grid>

    {/* Manual Address Form Section */}
    <Grid item xs={12} lg={7}>
      {loadingZip && (
        <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <CircularProgress />
            <p className="mt-4 text-gray-800 font-medium">
              Validating ZIP code and fetching places...
            </p>
          </div>
        </div>
      )}

      <Box className="border rounded-md shadow-md p-5">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField required id="firstName" name="firstName" label="First Name" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="lastName" name="lastName" label="Last Name" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField required id="city" name="city" label="City" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="state"
                label="State"
                fullWidth
                required
                value={formData.state}
                onChange={handleChange}
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
                name="zip"
                label="ZIP / Postal Code"
                fullWidth
                required
                value={formData.zip}
                onChange={handleChange}
                onBlur={() => validateZip(formData.zip)}
                error={!!zipError}
                helperText={zipError}
              />
            </Grid>

            {districtFromZip && (
              <Grid item xs={12}>
                <Box sx={{ color: "green", fontWeight: 500 }}>
                  District: <strong>{districtFromZip}</strong>
                </Box>
              </Grid>
            )}

            {postOffices.length > 0 && (
              <Grid item xs={12}>
                <Box>
                  <Box sx={{ fontWeight: 600, mb: 1 }}>Nearby Places:</Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {displayedPlaces.map((place, idx) => (
                      <Button
                        key={idx}
                onClick={() =>
  setFormData((prev) => ({
    ...prev,
    address: `${place}, ${prev.address || ""}`,
  }))
}

                        size="small"
                        variant="outlined"
                      >
                        {place}
                      </Button>
                    ))}
                    {postOffices.length > 5 && (
                      <Button
                        size="small"
                        onClick={() => setShowAllPlaces((prev) => !prev)}
                        sx={{ textTransform: "none" }}
                      >
                        {showAllPlaces ? "Show Less" : "Show More"}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
<TextField
  name="mobile"
  label="Phone Number"
  fullWidth
  required
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
    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
  }}
  error={!!phoneError}
  helperText={phoneError}
/>

            </Grid>

            <Grid item xs={12}>
<TextField
  required
  id="address"
  name="address"
  label="Address"
  fullWidth
  multiline
  rows={4}
  value={formData.address}
  onChange={handleChange}
  InputLabelProps={{
    shrink: Boolean(formData.address), // Float label if value exists
  }}
/>


            </Grid>

            <Grid item xs={12}>
              <Button
                sx={{ padding: ".9rem 1.5rem" }}
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? <CircularProgress size={24} color="inherit" /> : "Deliver Here"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Grid>

    {/* Loader while placing order */}
    {isPlacingOrder && (
  <Backdrop
    open
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
    )}
  </Grid>
);

}
