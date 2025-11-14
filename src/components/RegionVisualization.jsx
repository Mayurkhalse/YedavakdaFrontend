import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "leaflet/dist/leaflet.css";

const RegionVisualization = ({ userId }) => {
  const [data, setData] = useState(null);


  useEffect(() => {
    fetch(`http://127.0.0.1:8000/getData?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, [userId]);

  if (!data) return <p className="text-center mt-10">Loading data...</p>;

  const region = data.region;
  const historical = data.historical_data;
  const predicted = data.predicted_data;

  const historicalCombined = historical.dates.map((date, i) => ({
    date,
    NDVI: historical.NDVI[i],
    EVI: historical.EVI[i],
  }));

  const predictedCombined = predicted.dates.map((date, i) => ({
    date,
    NDVI: predicted.NDVI[i],
    EVI: predicted.EVI[i],
  }));

  const regionBounds = [
    [parseFloat(region.lat_1), parseFloat(region.lan_1)],
    [parseFloat(region.lat_2), parseFloat(region.lan_2)],
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      {/* Map Section */}
      <div className="rounded-2xl shadow-md border p-3">
        <h2 className="text-xl font-semibold mb-3 text-center">Region View</h2>
        <MapContainer
          center={[parseFloat(region.lat_1), parseFloat(region.lan_1)]}
          zoom={10}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Rectangle bounds={regionBounds} pathOptions={{ color: "blue" }} />
        </MapContainer>
      </div>

      {/* Charts Section */}
      <div className="rounded-2xl shadow-md border p-3">
        <h2 className="text-xl font-semibold mb-3 text-center">NDVI & EVI Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[...historicalCombined, ...predictedCombined]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="NDVI" stroke="#82ca9d" />
            <Line type="monotone" dataKey="EVI" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Severity Section */}
      <div className="col-span-2 text-center mt-5">
        <div
          className={`inline-block px-6 py-3 rounded-xl text-lg font-bold ${
            data.current_severity === "High"
              ? "bg-red-500 text-white"
              : data.current_severity === "Moderate"
              ? "bg-yellow-400 text-black"
              : "bg-green-400 text-black"
          }`}
        >
          Current Severity: {data.current_severity}
        </div>
      </div>
    </div>
  );
};

export default RegionVisualization;
