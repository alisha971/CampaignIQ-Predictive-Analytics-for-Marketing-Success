import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Campaign from "../models/Campaign.js";
import Prediction from "../models/Prediction.js";
import { getPrediction } from '../services/modelService.js';
import mongoose from "mongoose";
import NodeCache from "node-cache";

// Create a cache with 5 minutes TTL
const cache = new NodeCache({ stdTTL: 300 });

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const currentMonth = "November";
    const currentYear = 2021;
    const currentDay = "2021-11-15";

    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdAt: -1 });
    const overallStat = await OverallStat.find({ year: currentYear });
    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
    } = overallStat[0];
    const thisMonthStats = overallStat[0].monthlyData.find(
      ({ month }) => month === currentMonth
    );
    const todayStats = overallStat[0].dailyData.find(
      ({ date }) => date === currentDay
    );

    res.status(200).json({
      transactions,
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getCampaignInsights = async (req, res) => {
  try {
    console.log("Getting campaign insights");
    
    // Fetch only first 20 predictions
    const predictions = await Prediction.find()
      .limit(20)
      .lean();
    console.log("Found predictions:", predictions.length);

    // Transform predictions into the expected format
    const combinedData = predictions.map(prediction => ({
      campaign: {
        Campaign_ID: prediction.campaign_id,
      },
      prediction: {
        campaign_id: prediction.campaign_id,
        predicted_roi: prediction.predicted_roi,
        predicted_conversions: prediction.predicted_conversions,
        predicted_engagement: prediction.predicted_engagement,
        prediction_timestamp: prediction.prediction_timestamp,
        model_used: prediction.model_used,
        Prediction_Status: prediction.Prediction_Status
      }
    }));

    console.log("Combined data length:", combinedData.length);
    if (combinedData.length > 0) {
      console.log("Sample combined data:", combinedData[0]);
    }
    
    return res.json(combinedData);

  } catch (error) {
    console.error("Error in getCampaignInsights:", error);
    return res.status(500).json({ 
      message: "Error fetching campaign insights",
      error: error.message 
    });
  }
};

export const createCampaign = async (req, res) => {
  try {
    // 1. Create new campaign
    const campaignData = {
      ...req.body,
      Campaign_ID: Date.now(), // Generate a unique ID
      Conversion_Rate: 0,      // Initialize with 0
      Acquisition_Cost: "$0",
      ROI: 0,
      Clicks: 0,
      Impressions: 0,
      Engagement_Score: 0
    };

    const newCampaign = new Campaign(campaignData);
    await newCampaign.save();

    // 2. Get prediction for the campaign
    const prediction = await getPrediction(campaignData);

    // 3. Save prediction
    const newPrediction = new Prediction({
      campaign_id: campaignData.Campaign_ID,
      predicted_roi: prediction.predicted_roi,
      predicted_conversions: prediction.predicted_conversions,
      predicted_engagement: prediction.predicted_engagement,
      prediction_timestamp: prediction.prediction_timestamp,
      model_used: prediction.model_used,
      Prediction_Status: prediction.Prediction_Status
    });
    await newPrediction.save();

    // 4. Return combined response
    res.status(201).json({
      campaign: newCampaign,
      prediction: newPrediction
    });

  } catch (error) {
    console.error('Error in createCampaign:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find();
    res.status(200).json(predictions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
