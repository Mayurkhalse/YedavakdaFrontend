import axios from 'axios';

const API_BASE = 'https://bloomwatch-backend.onrender.com';

export const chatbotAnalysis = async (uid, question) => {
  const response = await axios.post(`${API_BASE}/chatbot-analysis`, {
    uid,
    question
  });
  return response.data;
};
