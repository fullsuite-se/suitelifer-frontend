import axios from "axios";

const atsAPI = axios.create({
  baseURL: import.meta.env.VITE_ATS_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default atsAPI;
