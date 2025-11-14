import React from 'react';
import { X, MapPin, Clock, Droplets, Activity, TrendingUp } from 'lucide-react';

// Import Charts component - adjust path as needed
import Charts from './Charts';

const UserDataPopup = ({ data, isOpen, onClose }) => {
  if (!data || !isOpen) return null;

  // Helper function to get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 1:
        return '#22c55e'; // green
      case 2:
        return '#eab308'; // yellow
      case 3:
        return '#f97316'; // orange
      case 4:
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  // Helper function to get severity label
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

  // Helper function to format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Combine historical and predicted trends
  const combinedData = [
    ...(data.historicalTrends || []),
    ...(data.predictedTrends || []),
  ];

  // Prepare data for chart
  const combinedDataForChart = [
    ...(data.historicalTrends || []).map(item => ({
      date: item.date,
      severity: item.severity,
      evi: item.evi,
      ndvi: item.ndvi
    })),
    ...(data.predictedTrends || []).map(item => ({
      date: item.date,
      severity: item.severity,
      evi: item.evi,
      ndvi: item.ndvi
    }))
  ];

  // Get latest data
  const latestHistorical = data.historicalTrends?.[data.historicalTrends.length - 1];
  const latestPredicted = data.predictedTrends?.[data.predictedTrends.length - 1];
  
  const currentEvi = latestPredicted?.evi ?? latestHistorical?.evi ?? 'N/A';
  const currentNdvi = latestPredicted?.ndvi ?? latestHistorical?.ndvi ?? 'N/A';
  const currentSeverity = latestPredicted?.severity ?? latestHistorical?.severity ?? 1;
  const currentDate = latestPredicted?.date ?? latestHistorical?.date ?? data.date;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Monitoring Point #{data.id}</h2>
              <p className="text-gray-400 text-sm mt-1">Detailed Analysis & Trends</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-300">
                      {data.coordinates[0].toFixed(4)}, {data.coordinates[1].toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">{formatDate(currentDate)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Activity 
                      className="h-5 w-5" 
                      style={{ color: getSeverityColor(currentSeverity) }} 
                    />
                    <span className="text-gray-300 capitalize">
                      {getSeverityLabel(currentSeverity)} Severity
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Droplets className="h-5 w-5 text-cyan-400" />
                    <span className="text-gray-300">
                      {typeof currentEvi === 'number' ? currentEvi.toFixed(3) : currentEvi} EVI
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <span className="text-gray-300">
                      {typeof currentNdvi === 'number' ? currentNdvi.toFixed(3) : currentNdvi} NDVI
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics Summary */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-600 p-3 rounded">
                    <p className="text-gray-400 text-xs">Historical Records</p>
                    <p className="text-white text-xl font-bold">
                      {data.historicalTrends?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-600 p-3 rounded">
                    <p className="text-gray-400 text-xs">Predictions</p>
                    <p className="text-white text-xl font-bold">
                      {data.predictedTrends?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-600 p-3 rounded">
                    <p className="text-gray-400 text-xs">Avg EVI</p>
                    <p className="text-cyan-400 text-lg font-bold">
                      {data.historicalTrends?.length > 0
                        ? (data.historicalTrends.reduce((sum, t) => sum + (t.evi || 0), 0) / 
                           data.historicalTrends.length).toFixed(3)
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-600 p-3 rounded">
                    <p className="text-gray-400 text-xs">Avg NDVI</p>
                    <p className="text-emerald-400 text-lg font-bold">
                      {data.historicalTrends?.length > 0
                        ? (data.historicalTrends.reduce((sum, t) => sum + (t.ndvi || 0), 0) / 
                           data.historicalTrends.length).toFixed(3)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts - UNCOMMENT WHEN YOU IMPORT THE Charts COMPONENT */}
             
            <div className="space-y-4">
              <Charts
                data={combinedDataForChart}
                title="Trend Analysis"
                type="line"
                keys={['severity', 'evi', 'ndvi']}
              />
            </div>
            

            
          </div>

          {/* Historical and Predicted Trends Tables */}
          <div className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Historical Data */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Historical Data</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {data.historicalTrends?.length > 0 ? (
                    data.historicalTrends.map((trend, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0"
                      >
                        <span className="text-gray-300 text-sm">{formatDate(trend.date)}</span>
                        <div className="flex space-x-3">
                          <span 
                            className="text-sm font-medium px-2 py-0.5 rounded"
                            style={{ 
                              backgroundColor: getSeverityColor(trend.severity),
                              color: 'white'
                            }}
                          >
                            S:{trend.severity}
                          </span>
                          <span className="text-cyan-400 text-sm">
                            E:{trend.evi?.toFixed(2)}
                          </span>
                          <span className="text-emerald-400 text-sm">
                            N:{trend.ndvi?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No historical data available</p>
                  )}
                </div>
              </div>

              {/* Predicted Data */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Predictions
                  <span className="ml-2 text-xs text-yellow-500">(Forecasted)</span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {data.predictedTrends?.length > 0 ? (
                    data.predictedTrends.map((trend, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0"
                      >
                        <span className="text-gray-300 text-sm">{formatDate(trend.date)}</span>
                        <div className="flex space-x-3">
                          <span 
                            className="text-sm font-medium px-2 py-0.5 rounded"
                            style={{ 
                              backgroundColor: getSeverityColor(trend.severity),
                              color: 'white'
                            }}
                          >
                            S:{trend.severity}
                          </span>
                          <span className="text-cyan-400 text-sm">
                            E:{trend.evi?.toFixed(2)}
                          </span>
                          <span className="text-emerald-400 text-sm">
                            N:{trend.ndvi?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No predictions available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDataPopup;