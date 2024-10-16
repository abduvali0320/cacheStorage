import axios from "axios";
import { UseToken } from "../Storage/UseToken";
import { URL } from "./Constant";

const { getItem } = UseToken("token");

const api = axios.create({
    baseURL: URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        if (getItem()?.access_token) {
            config.headers.Authorization = `Bearer ${getItem()?.access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
