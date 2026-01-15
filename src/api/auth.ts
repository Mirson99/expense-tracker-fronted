import axios from "axios";

// api/auth.ts
const API_URL = 'http://localhost:5275';

export const loginApi = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const registerApi = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, { email, password });
  return response.data;
};