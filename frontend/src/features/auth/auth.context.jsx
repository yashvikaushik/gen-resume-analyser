import { createContext, useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { getFirebaseAuth } from "../../config/firebase";
import {
    login as loginApi,
    register as registerApi,
    googleLogin as googleLoginApi,
    githubLogin as githubLoginApi,
    logout as logoutApi,
    getMe as getMeApi,
    updateProfile as updateProfileApi
} from "./services/auth.api";
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

    const loginWithGoogle = async () => {
        setAuthActionLoading(true);
        try {
            const { auth: firebaseAuth, googleProvider: provider } = getFirebaseAuth();
            const firebaseResult = await signInWithPopup(firebaseAuth, provider);
            const firebaseUser = firebaseResult.user;
            const idToken = await firebaseUser.getIdToken();

            const data = await googleLoginApi({
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || "",
                uid: firebaseUser.uid,
                idToken
            });

            setUser(data.user);
            toast.success(data.message || "Signed in with Google successfully!");
            return { success: true, user: data.user };
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            const errorMessage =
                error?.response?.data?.message ||
                (error?.code === "auth/popup-closed-by-user"
                    ? "Google sign-in popup was closed."
                    : error?.message || "Google Sign-In failed");
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setAuthActionLoading(false);
        }
    };

    const loginWithGithub = async () => {
        setAuthActionLoading(true);
        try {
            const { auth: firebaseAuth, githubProvider: provider } = getFirebaseAuth();
            const firebaseResult = await signInWithPopup(firebaseAuth, provider);
            const firebaseUser = firebaseResult.user;
            const idToken = await firebaseUser.getIdToken();

            const data = await githubLoginApi({
                email: firebaseUser.email || `${firebaseUser.reloadUserInfo?.screenName || firebaseUser.uid}@github.user`,
                displayName: firebaseUser.displayName || firebaseUser.reloadUserInfo?.screenName || "GitHub User",
                uid: firebaseUser.uid,
                idToken
            });

            setUser(data.user);
            toast.success(data.message || "Signed in with GitHub successfully!");
            return { success: true, user: data.user };
        } catch (error) {
            console.error("GitHub Sign-In Error:", error);
            const errorMessage =
                error?.response?.data?.message ||
                (error?.code === "auth/popup-closed-by-user"
                    ? "GitHub sign-in popup was closed."
                    : error?.code === "auth/account-exists-with-different-credential"
                    ? "An account already exists with the same email address using another sign-in method."
                    : error?.message || "GitHub Sign-In failed");
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

    const updateProfile = async (newUsername) => {
        setAuthActionLoading(true);
        try {
            const data = await updateProfileApi({ username: newUsername });
            if (data?.user) {
                setUser(data.user);
            }
            toast.success(data?.message || "Profile updated successfully!");
            return { success: true, user: data.user };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update profile";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setAuthActionLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                authActionLoading,
                login,
                register,
                loginWithGoogle,
                loginWithGithub,
                logout,
                getMe,
                updateProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};