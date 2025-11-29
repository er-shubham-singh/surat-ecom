

import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWhatsapp,
  MdAccessTime,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { sendUserQuery } from "../redux/Query/Acion";

const Contact = () => {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector((state) => state.query);

  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendUserQuery(form));
  };

  useEffect(() => {
    if (successMessage) {
      setOpen(true);
      setForm({ name: "", phone: "", message: "" });
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen bg-white px-6 py-12 lg:px-20 flex flex-col gap-10">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800">
          Contact <span className="text-pink-600">Us</span>
        </h1>
      </div>

      {/* Contact Info & Form */}
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
        {/* Contact Info Section */}
        <div className="w-full lg:w-1/2 bg-pink-50 rounded-2xl shadow-md p-6 space-y-6">
          <div className=" items-center gap-4">
            <div className="flex items-center gap-4">
              <MdLocationOn className="text-pink-600 text-3xl" />
            <h3 className="text-lg font-bold text-gray-800">Office Address</h3>
            </div>
            <div>
              <p className="text-gray-600">Fluteon </p>
              <p className="text-gray-600">Shop No: 19, Building No: 81, Tilak Nagar Near Noble Medical Chembur Mumbai 400089 </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MdPhone className="text-pink-600 text-3xl" />
            <div>
              <h3 className="text-lg font-bold text-gray-800">Phone</h3>
              <p className="text-gray-600">+91 98925 50941</p>
            </div>
          </div>

<div className="flex items-center gap-4">
  <MdEmail className="text-pink-600 text-2xl min-w-[24px]" />
  <div>
    <h3 className="text-lg font-bold text-gray-800">Email</h3>
    <p className="text-gray-600">fluteoncompany@gmail.com</p>
  </div>
</div>



          <div className="flex items-center gap-4">
            <MdWhatsapp className="text-pink-600 text-3xl" />
            <div>
              <h3 className="text-lg font-bold text-gray-800">WhatsApp</h3>
              <p className="text-gray-600">+91 98925 50941</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MdAccessTime className="text-pink-600 text-3xl" />
            <div>
              <h3 className="text-lg font-bold text-gray-800">Business Hours</h3>
              <p className="text-gray-600">Mon - Sat: 10 AM - 7 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="w-full lg:w-1/2 max-w-lg bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
      {/* Image at the bottom */}
      <div className="flex justify-center mt-16">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/contact-us-illustration-download-in-svg-png-gif-file-formats--call-logo-laptop-helping-customer-service-pack-network-communication-illustrations-2912020.png"
          alt="Customer Service"
          className="w-full max-w-md object-contain"
        />
      </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Your Message</label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we assist you?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "100%",
                backgroundColor: "#ec4899",
                color: "white",
                fontWeight: "600",
                paddingY: "8px",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#db2777",
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send Message"}
            </Button>
          </form>
        </div>
      </div>



      {/* Snackbar Alerts */}
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {error && (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default Contact;
