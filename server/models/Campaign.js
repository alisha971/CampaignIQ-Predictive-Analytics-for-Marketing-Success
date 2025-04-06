import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    Campaign_ID: Number,
    Target_Audience: String,
    Campaign_Goal: String,
    Duration: String,
    Channel_Used: String,
    Conversion_Rate: Number,
    Acquisition_Cost: String,
    ROI: Number,
    Location: String,
    Language: String,
    Clicks: Number,
    Impressions: Number,
    Engagement_Score: Number,
    Customer_Segment: String,
    Date: String,
    Company: String
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", CampaignSchema, "campaigns");
export default Campaign; 