import { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Fade,
  useTheme,
} from '@mui/material';
import { 
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { generateAiResponse } from '@/services/worqhatService';

const ChatButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: '#e8eefe',
  },
  width: '50px',
  height: '50px',
  borderRadius: '25px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '80px',
  right: '20px',
  width: '350px',
  maxWidth: '90vw',
  maxHeight: '80vh',
  zIndex: 1000,
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  [theme.breakpoints.down('sm')]: {
    bottom: '70px',
    right: '10px',
    width: 'calc(100vw - 20px)',
  }
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  height: '400px',
  maxHeight: 'calc(80vh - 130px)', // Subtract header and input box height
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  [theme.breakpoints.down('sm')]: {
    height: '300px', // Smaller height on mobile devices
  }
}));

const Message = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isUser'
})(({ isUser, theme }) => ({
  padding: '8px 16px',
  maxWidth: '70%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary[600] : theme.palette.background.alt,
  color: isUser ? theme.palette.primary[100] : theme.palette.text.primary,
  borderRadius: '18px',
  wordWrap: 'break-word',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
}));

function AiChatbot() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await generateAiResponse(input, messages.map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text
      })));
      
      // Check if data.content exists (this is the actual response text)
      const aiMessage = { 
        text: data.content || "Sorry, I couldn't process that request.", 
        isUser: false 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false 
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Fade in={isOpen}>
        <ChatContainer>
          <Paper 
            elevation={3} 
            sx={{ 
              backgroundColor: '#f8f8f8'
            }}
          >
            <Box p={2} bgcolor="background.alt" display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="text.primary">
                AI Assistant
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setIsOpen(false)} 
                sx={{ 
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <MessagesContainer>
              {messages.map((message, index) => (
                <Message key={index} isUser={message.isUser}>
                  <Typography>{message.text}</Typography>
                </Message>
              ))}
              {isLoading && (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress size={24} />
                </Box>
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>
            <Box p={2} display="flex" gap={1}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.3)', // Darker default border
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.5)', // Even darker on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.7)', // Darkest when focused
                    },
                  },
                }}
              />
              <IconButton 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.7)', // Dark color for send icon
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(0, 0, 0, 0.3)' // Lighter color when disabled
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </ChatContainer>
      </Fade>

      <ChatButton 
        onClick={() => setIsOpen(true)} 
        sx={{ display: isOpen ? 'none' : 'flex' }}
      >
        <ChatIcon />
      </ChatButton>
    </>
  );
}

export default AiChatbot; 