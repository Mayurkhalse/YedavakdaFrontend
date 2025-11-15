import axios from 'axios';

const API_BASE = 'https://bloomwatch-backend.onrender.com';

export const addRegion = async (uid, lat1, lat2, lan1, lan2) => {
  const formData = new FormData();
  formData.append('uid', uid);
  formData.append('lat_1', lat1);
  formData.append('lat_2', lat2);
  formData.append('lan_1', lan1);
  formData.append('lan_2', lan2);

  const response = await axios.post(`${API_BASE}/addRegion`, formData);
  return response.data;
};

export const getUserData = async (uid) => {
  const response = await axios.get(`${API_BASE}/getData?uid=${uid}`);
  return response.data;
};

export const getRegionData = async (uid) => {
  const response = await axios.get(`${API_BASE}/getRegionData?uid=${uid}`);
  return response.data;
};

export const storeData = async (data) => {
  const response = await axios.post(`${API_BASE}/store-data`, data);
  return response.data;
};
