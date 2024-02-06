import axios from "axios";

const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:8080/api' : 'https://bpadash.com:9090/api';

const token = localStorage.getItem("@TokenAuthentication");

const api = axios.create({
    baseURL: baseURL,
    data: {}
});

if(token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export default api;
