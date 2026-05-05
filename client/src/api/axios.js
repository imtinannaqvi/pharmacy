import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", 
});

API.interceptors.request.use((config) => {
  // Replace 'token' with the specific key name used in THIS project
  // e.g., localStorage.getItem("project_specific_token")
  const token = localStorage.getItem("token"); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Added a generic error logger to help us debug this specific environment
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`API Error in this project:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;