import pickle
import pandas as pd
import os
import numpy as np
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Load the model using the path from environment variable
model_path = os.getenv('MODEL_PATH', './campaign_predictor.pkl')
try:
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
    print(f"Model loaded successfully from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    raise

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("Received data:", data)  # Debug print
        
        # Extract date components
        date = datetime.strptime(data.get('Date', '2023-01-01'), '%Y-%m-%d')
        
        # Create feature dictionary with all required features
        features_dict = {
            'Campaign_ID': 1,
            'Duration': int(data['Duration'].split()[0]),
            'Engagement_Score': 0,
            'CTR': 0.02,
            'Engagement_Rate': 0.03,
            'Year': date.year,
            'Month': date.month,
            'Weekday': date.weekday(),
            'Channel_Used_Instagram': 1 if data['Channel_Used'] == 'Instagram' else 0,
            'Channel_Used_Pinterest': 0,
            'Channel_Used_Twitter': 1 if data['Channel_Used'] == 'Twitter' else 0,
            'Cost_Per_Conversion': 50,
            'ROI_x_CTR': 0.01,
            'Conversion_x_Engagement': 0.02,
            'CTR_x_Engagement': 0.015,
            'ROI_x_Conversion': 0.025,
            'Clicks_x_Impressions': 1000
        }
        
        # Convert dictionary values to numpy arrays
        features_array = np.array([[
            features_dict['Campaign_ID'],
            features_dict['Duration'],
            features_dict['Engagement_Score'],
            features_dict['CTR'],
            features_dict['Engagement_Rate'],
            features_dict['Year'],
            features_dict['Month'],
            features_dict['Weekday'],
            features_dict['Channel_Used_Instagram'],
            features_dict['Channel_Used_Pinterest'],
            features_dict['Channel_Used_Twitter'],
            features_dict['Cost_Per_Conversion'],
            features_dict['ROI_x_CTR'],
            features_dict['Conversion_x_Engagement'],
            features_dict['CTR_x_Engagement'],
            features_dict['ROI_x_Conversion'],
            features_dict['Clicks_x_Impressions']
        ]])
        
        print("Input features shape:", features_array.shape)  # Debug print
        
        # Make prediction
        prediction = model.predict(features_array)
        print("Raw prediction:", prediction)  # Debug print
        
        # Extract predictions - model returns [ROI, Conversion_Rate, Clicks, Impressions, Engagement_Rate]
        predicted_roi = float(prediction[0][0])  # First value is ROI
        predicted_conversion_rate = float(prediction[0][1])  # Second value is Conversion Rate
        predicted_clicks = int(prediction[0][2])  # Third value is Clicks
        predicted_impressions = int(prediction[0][3])  # Fourth value is Impressions
        predicted_engagement_rate = float(prediction[0][4])  # Fifth value is Engagement Rate
        
        # Calculate predicted conversions using the predicted conversion rate
        predicted_conversions = int(predicted_clicks * predicted_conversion_rate)
        
        response = {
            'predicted_roi': predicted_roi,
            'predicted_conversions': predicted_conversions,
            'predicted_engagement': {
                'clicks': predicted_clicks,
                'impressions': predicted_impressions,
                'engagement_rate': predicted_engagement_rate
            },
            'confidence': 0.85
        }
        print("Response:", response)  # Debug print
        
        return jsonify(response)
    
    except Exception as e:
        print("Error occurred:", str(e))  # Debug print
        import traceback
        print("Traceback:", traceback.format_exc())  # Debug print
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    if 'model' in globals():
        return jsonify({
            'status': 'healthy',
            'model_loaded': True,
            'model_type': str(type(model))
        })
    return jsonify({
        'status': 'unhealthy',
        'model_loaded': False
    }), 500

if __name__ == '__main__':
    app.run(port=5002) 