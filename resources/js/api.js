import axios from "axios";

export const API_BASE_URL =
    import.meta.env.VITE_API_URL || window.location.origin;

export function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};
}

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const initialToken = localStorage.getItem("token");

if (initialToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
}

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
