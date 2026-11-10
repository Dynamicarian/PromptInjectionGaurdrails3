import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:8000"
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status ?? 0;
        const message = err.response?.data?.detail ?? "Cannot reach the server.";
        window.location.href = `/error/${status}?message=${encodeURIComponent(message)}`;
        return Promise.reject(err);
    }
);

export default api;