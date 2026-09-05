import { createContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi, logout as logoutApi, getMe as getMeApi } from "./services/auth.api";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true initially to check session
    const [authActionLoading, setAuthActionLoading] = useState(false); // for form submission actions

    // Check if user is already logged in on initial load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getMeApi();
                if (res?.user) {
                    setUser(res.user);
                }
            } catch (error) {
                // Not authenticated yet; silent failure
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        setAuthActionLoading(true);
        try {
            const data = await loginApi(credentials);
            setUser(data.user);
            toast.success(data.message || "Logged in successfully!");
            return { success: true, user: data.user };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setAuthActionLoading(false);
        }
    };

    const register = async (credentials) => {
        setAuthActionLoading(true);
        try {
            const data = await registerApi(credentials);
            setUser(data.user);
            toast.success(data.message || "Registration successful!");
            return { success: true, user: data.user };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Registration failed. Please try again.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setAuthActionLoading(false);
        }
    };

    const logout = async () => {
        setAuthActionLoading(true);
        try {
            await logoutApi();
            setUser(null);
            toast.success("Logged out successfully");
            return { success: true };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Logout failed";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setAuthActionLoading(false);
        }
    };

    const getMe = async () => {
        try {
            const data = await getMeApi();
            if (data?.user) {
                setUser(data.user);
            }
            return data?.user;
        } catch (error) {
            setUser(null);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, authActionLoading, login, register, logout, getMe }}>
            {children}
        </AuthContext.Provider>
    );
};