import axios from "axios";

const API = axios.create({
    baseURL: "https://capd-system-1.onrender.com/api",
});

API.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
        const token = JSON.parse(userInfo).token;
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;