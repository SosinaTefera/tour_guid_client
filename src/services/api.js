import axios from "axios";

const api = axios.create({
  baseURL: "https://tour-guid-backend-326229981045.europe-southwest1.run.app", 
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     console.log(token)
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    const fullUrl = config.baseURL + config.url;
    console.log("Request URL:", fullUrl);
    if (fullUrl.startsWith("http://")) {
      config.baseURL = "https://tour-guid-backend-326229981045.europe-southwest1.run.app";
      console.warn("Forced HTTPS on:", fullUrl);
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
