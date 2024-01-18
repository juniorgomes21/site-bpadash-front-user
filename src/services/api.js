import axios from "axios";

const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:8080/api' : 'https://bpadash.com:9090/api';

const api = axios.create({
    baseURL: baseURL,
    data: {},
    headers: {}
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("@TokenAuthentication");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;