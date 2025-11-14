import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const login = async (email, password) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await axios.post(`${API_BASE}/login`, formData);
  return response.data;
};

export const signup = async (username, email, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);

  const response = await axios.post(`${API_BASE}/addUser`, formData);
  return response.data;
};

export const checkHealth = async () => {
  const response = await axios.get(`${API_BASE}/health`);
  return response.data;
};
