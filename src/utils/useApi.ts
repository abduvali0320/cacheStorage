import axios from "axios";
import { getUser } from "./Tokens";
export const URL = "http://api.sud.gx.uz";
const useApi = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

useApi.interceptors.request.use(
  async (config) => {
    const Token = getUser("user_data")?.token;
    if (Token) {
      config.headers.Authorization = `Bearer ${Token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default useApi;
