import React from "react";
import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/protected";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./features/dashboard/Dashboard";
import AnalyzeResume from "./features/interview/pages/AnalyzeResume";
import ReportDetails from "./features/interview/pages/ReportDetails";
import MyReports from "./features/interview/pages/MyReports";
import ProfileSettings from "./features/auth/pages/ProfileSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "analyze",
        element: <AnalyzeResume />,
      },
      {
        path: "reports",
        element: <MyReports />,
      },
      {
        path: "report/:id",
        element: <ReportDetails />,
      },
      {
        path: "settings",
        element: <ProfileSettings />,
      },
    ],
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