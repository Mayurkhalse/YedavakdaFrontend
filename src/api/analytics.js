import axios from 'axios';

const API_BASE = 'https://bloomwatch-backend.onrender.com';

export const bloomAnalysis = async (ndvi, evi, probability, severity, flag) => {
  const response = await axios.post(`${API_BASE}/bloom-analysis`, {
    ndvi,
    evi,
    probability,
    severity,
    flag
  });
  return response.data;
};
