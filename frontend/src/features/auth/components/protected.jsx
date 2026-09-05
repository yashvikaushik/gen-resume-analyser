import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children }) => {
    const { user, loading } = useAuth();

    console.log("Protected user:", user);
    console.log("Protected loading:", loading);

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#06090e",
                color: "#22d3ee",
                fontFamily: "sans-serif",
                gap: "1rem"
            }}>
                <div style={{
                    width: "36px",
                    height: "36px",
                    border: "3px solid rgba(34, 211, 238, 0.2)",
                    borderTopColor: "#22d3ee",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Loading...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={"/login"} />;
        
    }

    return children;
};

export default Protected;
