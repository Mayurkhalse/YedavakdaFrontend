# BloomWatch Usage Guide

## Quick Start

### 1. Start the Backend
Ensure your FastAPI backend is running on `http://127.0.0.1:8000`:

```bash
cd backend
uvicorn main:app --reload
```

### 2. Start the Frontend
```bash
npm install --legacy-peer-deps
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Step-by-Step User Journey

### First Time Setup

#### Step 1: Sign Up
1. Click "Sign up" on the login page
2. Enter your username, email, and password
3. Click "Create Account"
4. You'll be redirected to the login page

#### Step 2: Login
1. Enter your email and password
2. Check that "Server Connected" shows green status
3. Click "Login"
4. You'll be redirected to the Map view

#### Step 3: Draw Your Region
1. Click "Draw Region" button
2. Click and drag on the map to draw a rectangular region
3. Click "Save Region" to store your boundaries
4. The region will be highlighted in green

### Daily Usage

#### Map Tab
- **View Region**: See your configured agricultural area on the map
- **Edit Region**: Click "Edit Region" to redraw boundaries
- **Visual Feedback**: Green polygon shows your monitored area

#### Dashboard Tab
- **Time Range**: Select 7 or 30 days of historical data
- **Weather Cards**: View temperature, humidity, rainfall, and soil moisture
- **NDVI & EVI Chart**: Line graph showing vegetation health trends
- **Bloom Prediction**: Check probability, severity, and alert status
- **Refresh**: Click refresh button to get latest data

#### Crop Insights Tab

**Bloom Analysis Panel** (Left):
1. Enter NDVI value (e.g., 0.65)
2. Enter EVI value (e.g., 0.55)
3. Enter bloom probability percentage
4. Select severity level (Low/Medium/High)
5. Check "Alert Flag Active" if needed
6. Click "Analyze Bloom"
7. View AI-generated analysis below

**Crop Suggestions Panel** (Right):
1. Select season (Kharif/Rabi/Zaid)
2. Select soil type (Loamy/Clay/Sandy/etc.)
3. Enter rainfall amount in mm
4. Enter temperature in °C
5. Click "Get Crop Suggestions"
6. Review recommended crops with confidence scores

#### Chatbot Tab
1. Type your question in the text field
2. Or click a quick suggestion button:
   - "Best crops for clay soil"
   - "Improve soil fertility"
   - "Crop rotation"
3. Switch language using the language selector (English/हिंदी)
4. View AI responses in the chat window
5. Ask follow-up questions

## Features Overview

### Authentication
- Server health check indicator
- Secure login/signup flow
- Session persistence with localStorage

### Interactive Mapping
- OpenStreetMap integration
- Click-and-drag region drawing
- Persistent region storage
- Visual polygon display

### Data Visualization
- Responsive charts with Recharts
- Color-coded metric cards
- Real-time data updates
- Historical trend analysis

### AI-Powered Insights
- Bloom pattern analysis
- Crop recommendation engine
- Conversational chatbot
- Multi-language support

### User Interface
- Clean agricultural theme
- Smooth animations
- Mobile-responsive design
- Toast notifications

## Troubleshooting

### Backend Connection Issues
- **Red "Server Offline" indicator**: Check if FastAPI is running on port 8000
- **Login fails**: Verify backend endpoints are accessible
- **No data showing**: Ensure backend database is connected

### Map Not Loading
- Check internet connection (required for OpenStreetMap tiles)
- Refresh the page
- Clear browser cache

### Charts Not Displaying
- Ensure your region is configured in Map tab
- Check that backend is returning data in correct format
- Try clicking the Refresh button

### Chatbot Not Responding
- Verify `/chatbot-analysis` endpoint is working
- Check browser console for errors
- Ensure `uid` is stored in localStorage

## API Response Formats

### Login Response
```json
{
  "uid": "user123",
  "email": "farmer@example.com"
}
```

### Get Data Response
```json
{
  "lat_1": 20.5,
  "lat_2": 20.6,
  "lan_1": 78.5,
  "lan_2": 78.6,
  "ndvi_values": [0.65, 0.68, 0.72, ...],
  "evi_values": [0.55, 0.58, 0.61, ...],
  "temperature": 28,
  "humidity": 65,
  "rainfall": 150,
  "soil_moisture": 45,
  "bloom_probability": 75,
  "severity": "Medium",
  "flag": false
}
```

### Chatbot Response
```json
{
  "reply_text": "Based on your soil and climate..."
}
```

## Tips for Best Experience

1. **Configure Region First**: Set up your region in Map tab before using other features
2. **Regular Data Refresh**: Click refresh on Dashboard to get latest metrics
3. **Use Quick Suggestions**: Chatbot has pre-made questions for common queries
4. **Check Severity Levels**: Dashboard shows color-coded bloom severity badges
5. **Multi-language Chat**: Toggle between English and Hindi for comfort

## Production Deployment

```bash
npm run build
```

Serve the `dist/` folder with any static file server:

```bash
npm install -g serve
serve -s dist -p 3000
```

Or deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

Remember to update the API base URL in production!
