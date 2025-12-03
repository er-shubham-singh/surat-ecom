// components/ChatBoxModal.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../redux/Chat/Action";

const ChatBoxModal = ({ open, handleClose }) => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);

  // 👋 Initial welcome message
useEffect(() => {
  if (open && messages?.length === 0) {
    dispatch({
      type: "CHAT_SUCCESS",
      payload: {
        sender: "bot",
        text: "Hi! 👋 I can help you with product details, order status, super coins, and payments. Try asking about 'order status' or 'price of cotton kurti'."
      }
    });
  }
}, [open]);


  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(sendChatMessage(input));
    setInput("");
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 360,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <h3>Venus Garments Assistant</h3>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Chat Body */}
        <Box
          sx={{
            height: 300,
            overflowY: "auto",
            mb: 2,
            pr: 1,
            scrollbarWidth: "thin",
          }}
        >
          {messages?.map((msg, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"}
              alignItems="center"
              gap={1}
              mb={1}
            >
              {msg.sender !== "user" && <SupportAgentIcon fontSize="small" color="primary" />}
              <span
                style={{
                  background: msg.sender === "user" ? "#d0f0ff" : "#f1f1f1",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  maxWidth: "75%",
                  display: "inline-block",
                }}
              >
                {msg.text}
              </span>
              {msg.sender === "user" && <PersonIcon fontSize="small" />}
            </Box>
          ))}

          {/* Typing animation (if loading) */}
          {loading && (
            <Box display="flex" alignItems="center" gap={1}>
              <SupportAgentIcon fontSize="small" color="primary" />
              <span
                style={{
                  fontStyle: "italic",
                  fontSize: "14px",
                  color: "#888",
                }}
              >
                Typing...
              </span>
            </Box>
          )}
        </Box>

        {/* Input box */}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Ask about product, order, coins..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </Box>
    </Modal>
  );
};

export default ChatBoxModal;
