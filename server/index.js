import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import generalRoutes from "./routes/generalRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import managementRoutes from "./routes/managementRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import Product from "./models/Product.js";
import {
  dataAffiliateStat,
  dataOverallStat,
  dataProduct,
  dataProductStat,
  dataTransaction,
} from "./data/index.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import { sampleCampaignData, samplePredictionData } from "./data/campaignData.js";
import Campaign from "./models/Campaign.js";
import Prediction from "./models/Prediction.js";
import { startModelServer, stopModelServer } from './services/modelService.js';
import chatRoutes from "./routes/chatRoutes.js";

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// Add this before your routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`); // Log all requests
  next();
});

// Add this debug line
console.log("Setting up routes...");

// ROUTES
app.use("/general", generalRoutes);
app.use("/client", clientRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);
app.use("/chat", chatRoutes);

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ 
    message: "Backend is running!",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    mongoConnection: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Add this debug line
console.log("Routes mounted. Available paths:", {
  general: "/general/*",
  client: "/client/*",
  management: "/management/*",
  chat: "/chat/*"  // Include chat routes
});

// MONGOOSE SETUP
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
      console.log("MongoDB Connected Successfully!");
      
      // Start the model server
      startModelServer();
    });

    // Seed campaign data
    const seedData = async () => {
      try {
        // Check if sample campaign exists
        const existingCampaign = await Campaign.findOne({ Campaign_ID: sampleCampaignData[0].Campaign_ID });
        const existingPrediction = await Prediction.findOne({ campaign_id: samplePredictionData[0].campaign_id });

        // Only insert sample data if it doesn't exist
        if (!existingCampaign) {
          await Campaign.insertMany(sampleCampaignData);
        }
        if (!existingPrediction) {
          await Prediction.insertMany(samplePredictionData);
        }
        
        console.log("Campaign and Prediction data seeding checked!");
      } catch (error) {
        console.error("Error seeding data:", error);
      }
    };

    seedData();

    // After mongoose.connect()
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
  });

// Add graceful shutdown
process.on('SIGTERM', () => {
  stopModelServer();
  process.exit(0);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
