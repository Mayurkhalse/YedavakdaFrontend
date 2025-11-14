import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

// Simple function to map severity number → color
const getSeverityColor = (severity) => {
  switch (severity) {
    case 1:
      return 'green';
    case 2:
      return 'orange';
    case 3:
      return 'red';
    case 4:
      return 'purple';
    default:
      return 'gray';
  }
};

// Optional: map numeric severity → label
const getSeverityLabel = (severity) => {
  switch (severity) {
    case 1:
      return 'Low';
    case 2:
      return 'Moderate';
    case 3:
      return 'High';
    case 4:
      return 'Severe';
    default:
      return 'Unknown';
  }
};

// Simple BloomMarker component
const BloomMarker = ({ bloom, onShowDetails }) => {
  // Create a simple SVG circle icon
  const createCustomIcon = (severity) => {
    const color = getSeverityColor(severity);
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}">
        <circle cx="12" cy="12" r="8" stroke="white" stroke-width="2"/>
      </svg>
    `;
    return new Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  return (
    <Marker position={bloom.coordinates} icon={createCustomIcon(bloom.severity)}>
      <Popup>
        <div style={{ padding: '8px' }}>
          <h3>Bloom Event</h3>
          <p><strong>Severity:</strong> {getSeverityLabel(bloom.severity)}</p>
          <p><strong>EVI:</strong> {bloom.evi}</p>
          <p><strong>NDVI:</strong> {bloom.ndvi}</p>
          <p><strong>Date:</strong> {bloom.date}</p>
          {onShowDetails && (
            <button
              onClick={() => onShowDetails(bloom)}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                backgroundColor: '#1d4ed8',
                color: 'white',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              View Details
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default BloomMarker;
