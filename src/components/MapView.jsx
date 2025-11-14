import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Rectangle, Polygon, useMapEvents } from 'react-leaflet';
import { addRegion, getUserData, getRegionData } from '../api/region';
import toast from 'react-hot-toast';
import TopBar from './TopBar';
import { Loader, Edit, Save, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import UserDataMarker from './UserDataMarker'; // Import the new component
import UserDataPopup from './UserDataPopup'; // Import the popup component

// ----------------------
// ✅ DrawControl Component
// ----------------------
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

  return (
    <>
      {tempBounds && (
        <Rectangle
          bounds={tempBounds}
          pathOptions={{ color: 'blue', fillOpacity: 0.2, weight: 2 }}
        />
      )}
    </>
  );
}

// ----------------------
// ✅ Main Component
// ----------------------
function MapView() {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [bounds, setBounds] = useState(null);
  const [userid, setUserId] = useState(null);
  const [userData, setUserData] = useState([]); // Store user data for markers
  const [selectedPoint, setSelectedPoint] = useState(null); // For detail modal
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const mapRef = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  // ✅ Lock or unlock map interactions based on drawing state
  useEffect(() => {
    const map = mapRef.current?.leafletElement || mapRef.current;
    if (!map) return;

    if (isDrawing) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }
  }, [isDrawing]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const uid = localStorage.getItem('uid');
      setUserId(uid);
      
      const userdata = await getUserData(uid);
      const regiondata = await getRegionData(uid);
      
      // Debug logs
      console.log('=== DEBUG: Raw userdata ===');
      console.log('Type:', typeof userdata);
      console.log('Is Array?', Array.isArray(userdata));
      console.log('Data:', userdata);
      console.log('Keys:', userdata ? Object.keys(userdata) : 'null');
      console.log('========================');
      
      console.log('Region data:', regiondata);

      // Store user data for markers
      let dataToSet = [];
      
      if (Array.isArray(userdata)) {
        console.log('✓ Data is array, length:', userdata.length);
        dataToSet = userdata;
      } else if (userdata?.data && Array.isArray(userdata.data)) {
        console.log('✓ Data is in .data property, length:', userdata.data.length);
        dataToSet = userdata.data;
      } else if (userdata?.points && Array.isArray(userdata.points)) {
        console.log('✓ Data is in .points property, length:', userdata.points.length);
        dataToSet = userdata.points;
      } else if (typeof userdata === 'object' && userdata !== null) {
        console.log('✗ Data is object but not array. Trying to extract...');
        // Try to find an array property
        const arrayProp = Object.values(userdata).find(val => Array.isArray(val));
        if (arrayProp) {
          console.log('✓ Found array property, length:', arrayProp.length);
          dataToSet = arrayProp;
        } else {
          console.warn('✗ No array found in object');
          dataToSet = [];
        }
      } else {
        console.warn('✗ User data is not in expected format:', userdata);
        dataToSet = [];
      }
      
      console.log('Final userData to set:', dataToSet);
      setUserData(dataToSet);

      if (regiondata?.region?.lat_1 && regiondata?.region?.lat_2 && regiondata?.region?.lan_1 && regiondata?.region?.lan_2) {
        const regionBounds = [
          [parseFloat(regiondata.region.lat_1), parseFloat(regiondata.region.lan_1)],
          [parseFloat(regiondata.region.lat_2), parseFloat(regiondata.region.lan_2)],
        ];
        setRegion(regionBounds);
        setBounds(regionBounds);
      } else {
        setRegion(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setUserData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRegion = async () => {
    if (!bounds) {
      toast.error('Please draw a region first');
      return;
    }

    setSaving(true);
    try {
      const uid = localStorage.getItem('uid');
      await addRegion(
        uid,
        bounds[0][0],
        bounds[1][0],
        bounds[0][1],
        bounds[1][1]
      );

      toast.success('Region saved successfully!');
      setRegion(bounds);
      setIsDrawing(false);
    } catch (error) {
      toast.error('Failed to save region');
    } finally {
      setSaving(false);
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setBounds(null);
    toast.info('Click and drag on the map to draw your region');
  };

  const resetRegion = async () => {
    const uid = localStorage.getItem('uid');
    try {
      await addRegion(uid, null, null, null, null);
      setRegion(null);
      setBounds(null);
      setIsDrawing(false);
      toast.success('Region reset successfully!');
    } catch (error) {
      toast.error('Failed to reset region');
    }
  };

  const handleShowDetails = (data) => {
    setSelectedPoint(data);
    setIsPopupOpen(true);
    console.log('Show details for:', data);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedPoint(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Region Map" />

      <div className="ml-20 p-6">
        {/* Top Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Your Agricultural Region</h2>
              <p className="text-sm text-gray-500 mt-1">
                {region
                  ? `Region configured${userData && userData.length > 0 ? ` | ${userData.length} monitoring points` : ''}`
                  : 'Draw your region on the map'}
              </p>
            </div>
            <div className="flex gap-3">
              {region && !isDrawing && (
                <>
                  <button
                    onClick={startDrawing}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Region
                  </button>
                  <button
                    onClick={resetRegion}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reset Region
                  </button>
                </>
              )}

              {!region && !isDrawing && (
                <button
                  onClick={startDrawing}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <Edit className="w-5 h-5" />
                  Draw Region
                </button>
              )}

              {isDrawing && bounds && (
                <button
                  onClick={handleSaveRegion}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 hover:scale-105 shadow-md disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Region
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{ height: 'calc(100vh - 240px)' }}
        >
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Loader className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading map data...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={
                region
                  ? [
                      (region[0][0] + region[1][0]) / 2,
                      (region[0][1] + region[1][1]) / 2,
                    ]
                  : [20.5937, 78.9629]
              }
              zoom={region ? 10 : 5}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
              maxBounds={[
                [-90, -180],
                [90, 180],
              ]}
              maxBoundsViscosity={1.0}
              minZoom={3}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Existing saved region */}
              {region && !isDrawing && (
                <Polygon
                  positions={[
                    region[0],
                    [region[0][0], region[1][1]],
                    region[1],
                    [region[1][0], region[0][1]],
                    region[0],
                  ]}
                  pathOptions={{
                    color: 'green',
                    fillColor: 'green',
                    fillOpacity: 0.3,
                    weight: 2,
                  }}
                />
              )}

              {/* User Data Markers */}
              {userData && Array.isArray(userData) && userData.length > 0 && !isDrawing && userData.map((point) => (
                <UserDataMarker
                  key={point.id}
                  data={point}
                  onShowDetails={handleShowDetails}
                />
              ))}

              {/* Current drawn region */}
              {bounds && isDrawing && (
                <Rectangle
                  bounds={bounds}
                  pathOptions={{ color: 'blue', fillOpacity: 0.2, weight: 2 }}
                />
              )}

              {/* Drawing Tool */}
              <DrawControl onBoundsChange={setBounds} isDrawing={isDrawing} />
            </MapContainer>
          )}
        </div>
      </div>

      {/* User Data Popup */}
      <UserDataPopup
        data={selectedPoint}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
}

export default MapView;