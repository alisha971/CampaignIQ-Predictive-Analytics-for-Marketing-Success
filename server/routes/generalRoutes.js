import express from "express";
import { getDashboardStats, getUser, getCampaignInsights, createCampaign, getAllCampaigns, getAllPredictions } from "../controllers/general.js";

const router = express.Router();

// Add this line to debug route registration
console.log("Registering /campaign-insights route");

router.get("/user/:id", getUser);
router.get("/dashboard", getDashboardStats);
router.get("/campaign-insights", getCampaignInsights);
router.post("/campaign", createCampaign);
router.get("/campaigns", getAllCampaigns);
router.get("/predictions", getAllPredictions);
router.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

export default router;
