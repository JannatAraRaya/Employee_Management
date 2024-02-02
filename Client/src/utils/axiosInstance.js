import axios from "axios";

const axiosIntance = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 60000,
  });
  axiosIntance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  export default axiosIntance;