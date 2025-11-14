import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

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
