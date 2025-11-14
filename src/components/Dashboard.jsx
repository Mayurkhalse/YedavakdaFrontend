
import { useState, useEffect } from 'react';
import { getUserData } from '../api/region';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TopBar from './TopBar';
import { Loader, RefreshCw, Droplets, TrendingUp, MapPin, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12'); // months
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const uid = localStorage.getItem('uid');
      const response = await getUserData(uid);
      
      console.log('Dashboard data:', response);
      
      // Handle the data - it should be an array of monitoring points
      let pointsData = [];
      if (Array.isArray(response)) {
        pointsData = response;
      } else if (response?.region_data && Array.isArray(response.region_data)) {
        pointsData = response.region_data;
      } else if (response?.data && Array.isArray(response.data)) {
        pointsData = response.data;
      } else {
        console.warn('Unexpected data format:', response);
      }
      
      setData(pointsData);
      
      // Select first point by default
      if (pointsData.length > 0) {
        setSelectedPoint(pointsData[0]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    toast.success('Refreshing data...');
    fetchData();
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'orange';
      case 4:
        return 'red';
      default:
        return 'gray';
    }
  };

  // Get severity label
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

  // Prepare chart data from selected point
  const prepareChartData = () => {
    if (!selectedPoint) return [];

    const historical = selectedPoint.historicalTrends || [];
    const predicted = selectedPoint.predictedTrends || [];
    
    // Combine historical and predicted
    const combined = [...historical, ...predicted];
    
    if (combined.length === 0) return [];
    
    // Take last N months based on timeRange
    const sliced = combined.slice(-parseInt(timeRange));
    
    return sliced.map((item) => {
      // Safely parse date
      let dateStr = 'N/A';
      try {
        if (item.date) {
          dateStr = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'yy' });
        }
      } catch (e) {
        console.error('Date parsing error:', e);
      }
      
      return {
        date: dateStr,
        fullDate: item.date || '',
        NDVI: parseFloat(item.ndvi?.toFixed(3)) || 0,
        EVI: parseFloat(item.evi?.toFixed(3)) || 0,
        Severity: item.severity || 0,
      };
    });
  };

  // Calculate average metrics
  const calculateAverages = () => {
    if (!selectedPoint) {
      return { avgNDVI: 0, avgEVI: 0, avgSeverity: 0 };
    }

    // Use historicalTrends if available, otherwise use predictedTrends
    const dataSource = selectedPoint.historicalTrends?.length > 0 
      ? selectedPoint.historicalTrends 
      : selectedPoint.predictedTrends || [];
    
    if (dataSource.length === 0) {
      return { avgNDVI: 0, avgEVI: 0, avgSeverity: 0 };
    }

    const sum = dataSource.reduce((acc, item) => ({
      ndvi: acc.ndvi + (item.ndvi || 0),
      evi: acc.evi + (item.evi || 0),
      severity: acc.severity + (item.severity || 0),
    }), { ndvi: 0, evi: 0, severity: 0 });

    return {
      avgNDVI: (sum.ndvi / dataSource.length).toFixed(3),
      avgEVI: (sum.evi / dataSource.length).toFixed(3),
      avgSeverity: (sum.severity / dataSource.length).toFixed(1),
    };
  };

  // Get latest values
  const getLatestValues = () => {
    if (!selectedPoint) return { ndvi: 'N/A', evi: 'N/A', severity: 'N/A' };
    
    // Use historicalTrends if available, otherwise use predictedTrends
    const dataSource = selectedPoint.historicalTrends?.length > 0 
      ? selectedPoint.historicalTrends 
      : selectedPoint.predictedTrends || [];
    
    if (dataSource.length === 0) {
      return { ndvi: 'N/A', evi: 'N/A', severity: 'N/A' };
    }
    
    const latest = dataSource[dataSource.length - 1] || {};
    return {
      ndvi: latest.ndvi?.toFixed(3) || 'N/A',
      evi: latest.evi?.toFixed(3) || 'N/A',
      severity: getSeverityLabel(latest.severity),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar title="Dashboard" />
        <div className="ml-20 flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar title="Dashboard" />
        <div className="ml-20 p-6">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
            <p className="text-gray-500">Please configure your region on the Map tab first</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();
  const averages = calculateAverages();
  const latest = getLatestValues();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Dashboard" />

      <div className="ml-20 p-6">
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Agricultural Monitoring Dashboard</h2>
            <p className="text-gray-500 mt-1">{data.length} monitoring point{data.length > 1 ? 's' : ''} active</p>
          </div>
          
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-green-50 transition-all duration-200 hover:scale-105 shadow-md"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Monitoring Points Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Monitoring Point</h3>
          <div className="flex gap-3 flex-wrap">
            {data.map((point) => (
              <button
                key={point.id}
                onClick={() => setSelectedPoint(point)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedPoint?.id === point.id
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Point #{point.id}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTimeRange('6')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === '6'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeRange('12')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === '12'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            12 Months
          </button>
          <button
            onClick={() => setTimeRange('24')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === '24'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            24 Months
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Current NDVI</p>
                <h3 className="text-3xl font-bold mt-2">{latest.ndvi}</h3>
              </div>
              <TrendingUp className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">Current EVI</p>
                <h3 className="text-3xl font-bold mt-2">{latest.evi}</h3>
              </div>
              <Droplets className="w-12 h-12 text-cyan-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Avg NDVI</p>
                <h3 className="text-3xl font-bold mt-2">{averages.avgNDVI}</h3>
              </div>
              <TrendingUp className="w-12 h-12 text-amber-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Current Severity</p>
                <h3 className="text-2xl font-bold mt-2">{latest.severity}</h3>
              </div>
              <Activity className="w-12 h-12 text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">NDVI & EVI Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="NDVI" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="EVI" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Severity Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis domain={[0, 4]} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Severity" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Point Information */}
        {selectedPoint && selectedPoint.coordinates && selectedPoint.coordinates.length >= 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Monitoring Point Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-gray-600 text-sm">Location</p>
                <p className="text-gray-800 font-semibold mt-1">
                  {selectedPoint.coordinates[0].toFixed(4)}, {selectedPoint.coordinates[1].toFixed(4)}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-gray-600 text-sm">Historical Records</p>
                <p className="text-gray-800 font-semibold text-2xl mt-1">
                  {selectedPoint.historicalTrends?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-gray-600 text-sm">Predictions Available</p>
                <p className="text-gray-800 font-semibold text-2xl mt-1">
                  {selectedPoint.predictedTrends?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;