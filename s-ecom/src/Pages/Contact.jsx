import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
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
  const { loading, successMessage, error } = useSelector(
    (state) => state.query
  );

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
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex flex-col gap-8 lg:gap-12"
      style={{ backgroundColor: "#FFF9E8" }}
    >
      {/* Heading */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
          style={{ color: "#111111" }}
        >
          Contact <span style={{ color: "#CBE600" }}>Venus Garments</span>
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto px-4">
          We'd love to hear from you! Reach out for any queries or support.
        </p>
      </div>

      {/* Contact Info & Form */}
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 lg:gap-10 items-start justify-center">
        {/* Contact Info Section */}
        <div
          className="w-full lg:w-1/2 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold mb-6"
            style={{ color: "#111111" }}
          >
            Get In Touch
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <MdLocationOn
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-1"
                  style={{ color: "#111111" }}
                >
                  Office Address
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Venus Garments
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  Shop No: 19, Building No: 81, Tilak Nagar
                  <br className="hidden sm:block" /> Near Noble Medical, Chembur
                  <br className="hidden sm:block" /> Mumbai 400089
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MdPhone
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-1"
                  style={{ color: "#111111" }}
                >
                  Phone
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  +91 98925 50941
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MdEmail
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-1"
                  style={{ color: "#111111" }}
                >
                  Email
                </h3>
                <p className="text-sm sm:text-base text-gray-600 break-all">
                  venusgarments@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MdWhatsapp
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-1"
                  style={{ color: "#111111" }}
                >
                  WhatsApp
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  +91 98925 50941
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MdAccessTime
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-1"
                  style={{ color: "#111111" }}
                >
                  Business Hours
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Mon - Sat: 10 AM - 7 PM
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-6"
            style={{ color: "#111111" }}
          >
            Send Us a Message
          </h2>
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block font-medium mb-2 text-sm sm:text-base"
                style={{ color: "#111111" }}
              >
                Name <span style={{ color: "#CBE600" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#CBE600] transition-colors text-sm sm:text-base"
                style={{ borderColor: "#E5E7EB" }}
                required
              />
            </div>

            <div>
              <label
                className="block font-medium mb-2 text-sm sm:text-base"
                style={{ color: "#111111" }}
              >
                Phone Number <span style={{ color: "#CBE600" }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#CBE600] transition-colors text-sm sm:text-base"
                style={{ borderColor: "#E5E7EB" }}
                required
              />
            </div>

            <div>
              <label
                className="block font-medium mb-2 text-sm sm:text-base"
                style={{ color: "#111111" }}
              >
                Your Message <span style={{ color: "#CBE600" }}>*</span>
              </label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we assist you?"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#CBE600] transition-colors resize-none text-sm sm:text-base"
                style={{ borderColor: "#E5E7EB" }}
                required
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#DFF200",
                color: "#111111",
                fontWeight: "700",
                paddingY: { xs: "12px", sm: "14px" },
                fontSize: { xs: "14px", sm: "16px" },
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: "#CBE600",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#111111" }} />
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Snackbar Alerts */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
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
