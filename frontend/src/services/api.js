import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt_token");

    const isAuthRoute = config.url?.startsWith("/auth/");

    if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401){
            localStorage.removeItem("jwt_token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
)


export default api;
