import { useState, useRef } from 'react';
import { Rectangle, useMapEvents } from 'react-leaflet';

function DrawControl({ onBoundsChange, isDrawing }) {
  const [tempBounds, setTempBounds] = useState(null);
  const startPosRef = useRef(null);

  useMapEvents({
    mousedown(e) {
      if (!isDrawing) return;
      startPosRef.current = e.latlng;
      setTempBounds(null);
    },
    mousemove(e) {
      if (!isDrawing || !startPosRef.current) return;
      const end = e.latlng;
      const bounds = [
        [startPosRef.current.lat, startPosRef.current.lng],
        [end.lat, end.lng],
      ];
      setTempBounds(bounds);
    },
    mouseup(e) {
      if (!isDrawing || !startPosRef.current) return;
      const end = e.latlng;
      const bounds = [
        [startPosRef.current.lat, startPosRef.current.lng],
        [end.lat, end.lng],
      ];
      onBoundsChange(bounds);
      startPosRef.current = null;
      setTempBounds(null);
    },
  });

  return tempBounds ? (
    <Rectangle
      bounds={tempBounds}
      pathOptions={{ color: 'blue', fillOpacity: 0.2, weight: 2 }}
    />
  ) : null;
}

export default DrawControl;
