import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0d1520",
            color: "#e2e8f0",
            border: "1px solid rgba(34, 211, 238, 0.2)",
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.8)",
            borderRadius: "12px",
            fontSize: "0.9rem",
          },
          success: {
            iconTheme: {
              primary: "#22d3ee",
              secondary: "#06090e",
            },
          },
          error: {
            iconTheme: {
              primary: "#fb7185",
              secondary: "#06090e",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
