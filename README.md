# 📈 CampaignIQ: Predictive Analytics for Marketing Success

CampaignIQ is a full-stack AI-powered web application that empowers marketing teams to make smarter, data-driven decisions through predictive analytics and interactive dashboards.

---

## 🚀 Overview

This application integrates machine learning, data visualization, and modern web technologies to:
- Predict campaign performance
- Visualize marketing data
- Interact with an AI chatbot for insights and assistance

---

## 🔧 Tech Stack

| Layer      | Tech Used                             |
|------------|---------------------------------------|
| Frontend   | React, Vite, TailwindCSS              |
| Backend    | Node.js, Express, MongoDB, Mongoose   |
| ML Model   | Python, scikit-learn, pandas, pickle  |
| Other      | WorqHat API, Chart.js, REST APIs      |

---

## 🧩 Features

- 📊 Real-time campaign dashboards
- 🤖 Machine Learning-based performance prediction
- 🧠 AI chatbot assistant (WorqHat integration)
- 📈 Beautiful data visualizations (bar, pie, and line charts)
- 🌗 Responsive and modern UI with dark/light mode
- 🗂️ Modular and scalable folder structure

---

## 📁 Folder Structure

```
CampaignIQ-Predictive-Analytics-for-Marketing-Success/
│
├── client/       # React frontend
│   └── src/
│       └── components/ - Reusable UI components
│       └── scenes/     - Dashboard pages
│       └── state/      - Global state management
│
├── server/       # Express backend
│   └── controllers/ - Business logic
│   └── models/      - Mongoose schemas
│   └── routes/      - API routes
│   └── ml_model/    - Python ML script + model

```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/alisha971/CampaignIQ-Predictive-Analytics-for-Marketing-Success.git
cd CampaignIQ-Predictive-Analytics-for-Marketing-Success
```

---

### 2. Setup the Backend

```bash
cd server
npm install
npm run dev
```

> Make sure MongoDB is running locally or configure a remote URI.

---

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

---

### 4. Run the ML Model (Optional)

If you want to run the ML script:

```bash
cd ../server/ml_model
python predict.py
```

> Ensure required Python packages like `pandas`, `scikit-learn`, etc. are installed.

---


