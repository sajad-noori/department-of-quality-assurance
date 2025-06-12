import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchReports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
