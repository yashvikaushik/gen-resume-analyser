import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export async function register(data) {
    const payload = typeof data === "object" ? data : { username: arguments[0], email: arguments[1], password: arguments[2] };
    const response = await api.post("/api/auth/register", payload);
    return response.data;
}

export async function login(data) {
    const payload = typeof data === "object" ? data : { email: arguments[0], password: arguments[1] };
    const response = await api.post("/api/auth/login", payload);
    return response.data;
}

export async function googleLogin(data) {
    const response = await api.post("/api/auth/google", { ...data, provider: "Google" });
    return response.data;
}

export async function githubLogin(data) {
    const response = await api.post("/api/auth/github", { ...data, provider: "GitHub" });
    return response.data;
}

export async function logout() {
    const response = await api.get("/api/auth/logout");
    return response.data;
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me");
    return response.data;
}

export async function updateProfile(data) {
    const response = await api.patch("/api/auth/profile", data);
    return response.data;
}

export default api;