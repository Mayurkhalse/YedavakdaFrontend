import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ Function to choose marker color based on severity
const getMarkerColor = (severity) => {
  switch (severity) {
    case 1:
      return 'green';
    case 2:
      return 'orange';
    case 3:
      return 'red';
    default:
      return 'blue';
  }
};

// ✅ Custom marker icon generator
const createIcon = (color) => {
  return L.divIcon({
    className: '',
    html: `<div style="background-color:${color}; width:16px; height:16px; border-radius:50%; border:2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

function RegionMarkers({ userdata }) {
  if (!userdata) return null;

  return (
    <>
      {userdata.map((item) => {
        const [lat, lng] = item.coordinates;
        const color = getMarkerColor(item.severity);

        return (
          <Marker
            key={item.id}
            position={[lat, lng]}
            icon={createIcon(color)}
          >
            <Popup>
              <div>
                <strong>Severity:</strong> {item.severityLabel || 'Unknown'} <br />
                <strong>Date:</strong> {item.date} <br />
                <strong>Affected Area:</strong> {item.affectedArea || 0} ha
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default RegionMarkers;
