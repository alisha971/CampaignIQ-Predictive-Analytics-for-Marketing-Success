import { spawn } from 'child_process';
import path from 'path';
import fetch from 'node-fetch';

let pythonProcess = null;

export const startModelServer = () => {
    const modelPath = path.join(process.cwd(), 'ml_model', 'predict.py');
    pythonProcess = spawn('python', [modelPath]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Model Server: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Model Server Error: ${data}`);
    });
};

export const getPrediction = async (campaignData) => {
    try {
        const response = await fetch('http://localhost:5002/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(campaignData)
        });

        if (!response.ok) {
            throw new Error('Prediction failed');
        }

        const prediction = await response.json();
        return {
            predicted_roi: prediction.predicted_roi,
            predicted_conversions: prediction.predicted_conversions,
            predicted_engagement: prediction.predicted_engagement,
            prediction_timestamp: new Date().toISOString(),
            model_used: "Campaign Predictor v1",
            Prediction_Status: prediction.confidence > 0.7 ? "High Confidence" : "Needs Review"
        };
    } catch (error) {
        console.error('Prediction Error:', error);
        throw error;
    }
};

export const stopModelServer = () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }
}; 