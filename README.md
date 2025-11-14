# BloomWatch - AI-Powered Crop Health & Bloom Monitoring System

A comprehensive React frontend application for monitoring crop health, analyzing bloom patterns, and providing AI-powered agricultural insights.

## Features

### Authentication
- Email/password login and signup
- Backend health check on load
- Secure session management with localStorage

### Map View
- Interactive Leaflet map for drawing agricultural regions
- Save and edit region boundaries
- Visual polygon display of monitored areas

### Dashboard
- Real-time NDVI & EVI trend charts
- Weather metrics (temperature, humidity, rainfall)
- Soil moisture monitoring
- Bloom prediction analytics
- Severity level indicators

### Crop Insights
- **Bloom Analysis**: Analyze NDVI, EVI, probability, severity, and alert flags
- **Crop Suggestions**: Get AI-powered crop recommendations based on:
  - Season (Kharif/Rabi/Zaid)
  - Soil type
  - Rainfall and temperature data

### Chatbot
- AI-powered agricultural assistant
- Multi-language support (English/Hindi)
- Quick suggestion buttons
- Real-time chat interface

## Tech Stack

- **React 18** - UI framework (JSX only, no TypeScript)
- **React Router** - Navigation and routing
- **Axios** - API communication
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Prerequisites

- Node.js 16+ and npm
- FastAPI backend running on `http://127.0.0.1:8000`

## Installation

```bash
npm install --legacy-peer-deps
```

## Running the Application

```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Backend Integration

The frontend expects the following FastAPI endpoints:

| Feature | Method | Endpoint |
|---------|--------|----------|
| Signup | POST | `/addUser` |
| Login | POST | `/login` |
| Add/Edit Region | POST | `/addRegion` |
| Get User Data | GET | `/getData?uid={user_id}` |
| Store Data | POST | `/store-data` |
| Chatbot | POST | `/chatbot-analysis` |
| Bloom Analysis | POST | `/bloom-analysis` |
| Health Check | GET | `/health` |

## Folder Structure

```
src/
├── api/
│   ├── auth.js          # Authentication API calls
│   ├── region.js        # Region management API calls
│   ├── analytics.js     # Bloom analysis API calls
│   └── chatbot.js       # Chatbot API calls
├── components/
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── SignupForm.jsx
│   ├── MapView.jsx      # Interactive region map
│   ├── Dashboard.jsx    # Analytics dashboard
│   ├── CropInsights.jsx # Bloom prediction & crop suggestions
│   ├── Chatbot.jsx      # AI chatbot interface
│   ├── Sidebar.jsx      # Navigation sidebar
│   └── TopBar.jsx       # Top navigation bar
├── styles/
│   ├── theme.css        # Color theme variables
│   └── animations.css   # Custom animations
├── App.jsx              # Main app with routing
└── main.tsx             # Entry point
```

## Color Theme

- **Primary Green**: `#4CAF50` - Agriculture and growth
- **Accent Brown**: `#8B5A2B` - Earth tones
- **Background Beige**: `#F5F5DC` - Soft, natural background

## User Flow

1. **Login** → Check backend health → Authenticate
2. **Map Tab** → Draw or edit agricultural region
3. **Dashboard** → View analytics and trends
4. **Crop Insights** → Analyze bloom data and get crop suggestions
5. **Chatbot** → Ask agricultural questions and get AI responses

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Notes

- Ensure the FastAPI backend is running before starting the frontend
- All user data is stored in localStorage for session management
- Map requires internet connection to load tiles from OpenStreetMap
- Charts automatically adjust based on selected time range
