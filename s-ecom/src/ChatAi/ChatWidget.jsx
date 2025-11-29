// components/ChatWidget.js
import React, { useState } from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBoxModal from './ChatBoxModal';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}
      >
        <ChatIcon />
      </Fab>

      <ChatBoxModal open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default ChatWidget;
