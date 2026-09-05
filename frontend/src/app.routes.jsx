import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/protected";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Protected>
                <div style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#06090e",
                    color: "#ffffff",
                    fontFamily: "sans-serif"
                }}>
                    <h1 style={{
                        fontSize: "2.5rem",
                        background: "linear-gradient(110deg, #38bdf8 0%, #22d3ee 50%, #14b8a6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Home Page
                    </h1>
                    <p style={{ color: "#94a3b8", marginTop: "1rem" }}>
                        Welcome to GenResume!
                    </p>
                </div>
            </Protected>
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);