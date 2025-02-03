import axios from "axios";

export const api = {
  ip: axios.create({
    baseURL: "https://api.ipgeolocation.io/ipgeo",
    params: { apiKey: import.meta.env.VITE_IP_GEOLOCATION_API_KEY },
  }),
};
