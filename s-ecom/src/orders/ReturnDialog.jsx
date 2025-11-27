import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Grid,
  Tooltip,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

const reasons = [
  "Damaged Item",
  "Wrong Product Delivered",
  "Not Satisfied",
  "Other",
];

const ReturnDialog = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
const [imagePreviews, setImagePreviews] = useState([]);

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  const totalFiles = [...images, ...files].slice(0, 4);
  setImages(totalFiles);

  // Generate previews
  const readers = totalFiles.map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });

  Promise.all(readers).then((results) => {
    setImagePreviews(results);
  });

  e.target.value = null; // Reset input
};


const removeImage = (index) => {
  const updatedImages = [...images];
  const updatedPreviews = [...imagePreviews];
  updatedImages.splice(index, 1);
  updatedPreviews.splice(index, 1);
  setImages(updatedImages);
  setImagePreviews(updatedPreviews);
};


  const handleSubmit = () => {
    if (reason && description.trim() && images.length) {
      const formData = new FormData();
      formData.append("reason", reason);
      formData.append("description", description);
      images.forEach((file, idx) => {
        formData.append("images", file);
      });
      onConfirm(formData); // Call parent function
      setReason("");
      setDescription("");
      setImages([]);
    }
  };

  const isDisabled = !reason || !description.trim() || images.length === 0;

  return (
<Dialog
  open={open}
  onClose={onClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      borderRadius: 3,
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    },
  }}
  BackdropProps={{
    sx: {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      backdropFilter: "blur(5px)",
    },
  }}
>
      <DialogTitle>Request Return</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Please provide the following information to process your return request.
        </Typography>

        {/* Reason Dropdown */}
        <TextField
          select
          fullWidth
          label="Select Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mt: 2 }}
        >
          {reasons.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>

        {/* Description Field */}
        <TextField
          fullWidth
          label="Detailed Description"
          value={description}
          multiline
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Upload Images */}
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Upload Product Images (Max 4)
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoCamera />}
            size="small"
          >
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
              disabled={images.length >= 4}
            />
          </Button>

          {/* Preview */}
          <Grid container spacing={1} mt={1}>
{imagePreviews.map((src, index) => (
  <Grid item key={index}>
    <Box sx={{ width: 80, height: 80, position: "relative", borderRadius: 2, overflow: "hidden", border: "1px solid #ddd" }}>
      <img
        src={src}
        alt={`upload-${index}`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Tooltip title="Remove">
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 0, right: 0, backgroundColor: "rgba(255,255,255,0.7)" }}
          onClick={() => removeImage(index)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  </Grid>
))}

          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={isDisabled}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnDialog;
