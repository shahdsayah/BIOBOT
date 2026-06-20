import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./UserManagement/LoginPage";
import SignupPage from "./UserManagement/SignupPage";
import StudentHomePage from "./UserManagement/StudentHomePage";
import ProfilePage from "./UserManagement/ProfilePage";
import AdminDashboardPage from "./AdminManagement/AdminDashboardPage";
import AdminFormsPage from "./AdminManagement/AdminFormsPage";
import AdminUsersPage from "./AdminManagement/AdminUsersPage";
import AdminStatisticsPage from "./AdminManagement/AdminStatisticsPage";
import FormsPage from "./FormsManagement/FormsPage";
import BioBotPage from "./BioBotManagement/BioBotPage";
import ProtectedRoute from "./UserManagement/ProtectedRoute";
import AdminRoute from "./UserManagement/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/home" element={<ProtectedRoute><StudentHomePage /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="/chat" element={<ProtectedRoute><BioBotPage /></ProtectedRoute>} />

        <Route path="/forms" element={<ProtectedRoute><FormsPage /></ProtectedRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

        <Route path="/admin/forms" element={<AdminRoute><AdminFormsPage /></AdminRoute>} />

        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />

        <Route path="/admin/statistics" element={<AdminRoute><AdminStatisticsPage /></AdminRoute>} />

      </Routes>
    </BrowserRouter>
  );
}