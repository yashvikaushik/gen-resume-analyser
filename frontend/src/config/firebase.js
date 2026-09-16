import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const getEnv = (key) =>
    (import.meta.env[`VITE_${key}`] ||
    import.meta.env[`NEXT_PUBLIC_${key}`] ||
    "").trim();

const firebaseConfig = {
    apiKey: getEnv("FIREBASE_API_KEY"),
    authDomain: getEnv("FIREBASE_AUTH_DOMAIN"),
    projectId: getEnv("FIREBASE_PROJECT_ID"),
    storageBucket: getEnv("FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnv("FIREBASE_APP_ID")
};

let app = null;
let auth = null;
let googleProvider = null;
let githubProvider = null;

function isValidApiKey(key) {
    if (!key) return false;
    const cleanKey = key.replace(/['"]/g, "").trim();
    if (cleanKey === "your-api-key-here" || cleanKey.includes("your-") || cleanKey.length < 10) {
        return false;
    }
    return true;
}

export function getFirebaseAuth() {
    const cleanApiKey = (firebaseConfig.apiKey || "").replace(/['"]/g, "").trim();

    if (!isValidApiKey(cleanApiKey)) {
        throw new Error(
            "Please paste your actual Firebase Web API Key in frontend/.env (it starts with AIzaSy...)."
        );
    }

    if (!app) {
        app = !getApps().length
            ? initializeApp({
                  ...firebaseConfig,
                  apiKey: cleanApiKey
              })
            : getApp();
    }
    if (!auth) {
        auth = getAuth(app);
    }
    if (!googleProvider) {
        googleProvider = new GoogleAuthProvider();
    }
    if (!githubProvider) {
        githubProvider = new GithubAuthProvider();
    }
    return { auth, googleProvider, githubProvider };
}

// Safely attempt eager initialization only if a real apiKey is present
try {
    const cleanApiKey = (firebaseConfig.apiKey || "").replace(/['"]/g, "").trim();
    if (isValidApiKey(cleanApiKey)) {
        app = !getApps().length
            ? initializeApp({
                  ...firebaseConfig,
                  apiKey: cleanApiKey
              })
            : getApp();
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        githubProvider = new GithubAuthProvider();
    }
} catch (error) {
    console.warn("Firebase initialization notice:", error.message);
}

export { app, auth, googleProvider, githubProvider };
export default app;
