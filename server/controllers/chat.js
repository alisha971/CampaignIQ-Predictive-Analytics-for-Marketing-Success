import { worqhatService } from '../services/worqhatService.js';

export const handleChat = async (req, res) => {
  try {
    console.log("Chat request received:", req.body);
    const response = await worqhatService.getResponse(req.body.message);
    console.log("Chat response:", response);
    res.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ 
      error: "Failed to get chat response",
      details: error.message 
    });
  }
}; 