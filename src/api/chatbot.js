import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const chatbotAnalysis = async (uid, question) => {
  const response = await axios.post(`${API_BASE}/chatbot-analysis`, {
    uid,
    question
  });
  return response.data;
};
