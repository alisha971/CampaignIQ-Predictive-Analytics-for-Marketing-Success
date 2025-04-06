import mongoose from "mongoose";

const PredictionSchema = new mongoose.Schema(
  {
    campaign_id: Number,
    predicted_roi: Number,
    predicted_conversions: Number,
    predicted_engagement: {
      clicks: Number,
      impressions: Number
    },
    prediction_timestamp: String,
    model_used: String,
    Prediction_Status: String
  },
  { timestamps: true }
);

const Prediction = mongoose.model("Prediction", PredictionSchema, "predictions");
export default Prediction; 