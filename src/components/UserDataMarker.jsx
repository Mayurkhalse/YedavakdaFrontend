import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

const UserDataMarker = ({ data, onShowDetails }) => {
  const now = new Date();

  // Helper functions
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 1: return '#22c55e';
      case 2: return '#eab308';
      case 3: return '#f97316';
      case 4: return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 1: return 'Low';
      case 2: return 'Moderate';
      case 3: return 'High';
      case 4: return 'Severe';
      default: return 'Unknown';
    }
  };

  // Combine historical and predicted trends
  const allTrends = [...(data.historicalTrends || []), ...(data.predictedTrends || [])];

  // Filter trends for current month (1st or 15th)
  const currentMonthTrends = allTrends.filter(trend => {
    const trendDate = new Date(trend.date);
    return trendDate.getFullYear() === now.getFullYear() &&
           trendDate.getMonth() === now.getMonth() &&
           (trendDate.getDate() === 1 || trendDate.getDate() === 15);
  });

  // Pick the earliest trend (1st) if available, else 15th, else latest
  const monthRecord = currentMonthTrends[0] || allTrends[allTrends.length - 1];

  // Determine severity and label
  const severity = monthRecord?.severity || data.severity || 1;
  const severityLabel = monthRecord?.severityLabel && monthRecord.severityLabel !== 'Unknown'
    ? monthRecord.severityLabel
    : getSeverityLabel(severity);
  const color = getSeverityColor(severity);

  // Create custom marker icon
  const createCustomIcon = () => {
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="10" fill="${color}" stroke="white" stroke-width="2.5"/>
        <circle cx="14" cy="14" r="4" fill="white" opacity="0.8"/>
      </svg>
    `;
    return new Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  };

  // Transform data for display
  const displayData = {
    id: data.id,
    coordinates: data.coordinates,
    severity: severityLabel,
    evi: monthRecord?.evi?.toFixed(3) ?? 'N/A',
    ndvi: monthRecord?.ndvi?.toFixed(3) ?? 'N/A',
    date: monthRecord?.date || data.date,
    affectedArea: data.affectedArea || 0,
  };

  return (
    <Marker position={data.coordinates} icon={createCustomIcon()}>
      <Popup>
        <div className="p-3 min-w-[200px]">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">
            Monitoring Point #{data.id}
          </h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Severity:</span>
              <span 
                className="font-semibold px-2 py-0.5 rounded text-white text-xs"
                style={{ backgroundColor: color }}
              >
                {displayData.severity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">EVI:</span>
              <span className="font-medium">{displayData.evi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NDVI:</span>
              <span className="font-medium">{displayData.ndvi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-xs">{displayData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-xs">
                {data.coordinates[0].toFixed(2)}, {data.coordinates[1].toFixed(2)}
              </span>
            </div>
          </div>
          {onShowDetails && (
            <button
              onClick={() => onShowDetails(data)}
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm transition-colors font-medium"
            >
              View Detailed Trends
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default UserDataMarker;
