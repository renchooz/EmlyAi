import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Resumes from "../pages/Resumes";
import Analyze from "../pages/Analyze";
import CoverLetter from "../pages/CoverLetter";
import OneClickApply from "../pages/OneClickApply";
import EmailHistory from "../pages/EmailHistory";
import Settings from "../pages/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resumes" element={<Resumes />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/one-click-apply" element={<OneClickApply />} />
        <Route path="/email-history" element={<EmailHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;