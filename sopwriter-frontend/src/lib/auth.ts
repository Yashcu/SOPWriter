import { api } from "./api";

const TOKEN_KEY = "admin_token";

export const auth = {
    login: async (email: string, password: string) => {
        const response = await api.post("/admin/login", { email, password });
        if (response.data.success && response.data.token) {
            localStorage.setItem(TOKEN_KEY, response.data.token);
            // Verify token is valid by setting header immediately?
            // Usually we rely on interceptor, let's ensure interceptor picks it up.
            return true;
        }
        return false;
    },
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/admin/login";
    },
    getToken: () => localStorage.getItem(TOKEN_KEY),
    isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};
