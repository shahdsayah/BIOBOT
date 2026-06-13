import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./UserManagement/LoginPage";
import SignupPage from "./UserManagement/SignupPage";
import StudentHomePage from "./UserManagement/StudentHomePage";
import ProfilePage from "./UserManagement/ProfilePage";
import AdminDashboardPage from "./AdminManagement/AdminDashboardPage";
import AdminFormsPage from "./AdminManagement/AdminFormsPage";
import AdminUsersPage from "./AdminManagement/AdminUsersPage";
import AdminStatisticsPage from "./AdminManagement/AdminStatisticsPage";


import BioBotPage from "./BioBotManagement/BioBotPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/home" element={<StudentHomePage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/chat" element={<BioBotPage />} />

        <Route path="/admin" element={<AdminDashboardPage />} />

        <Route path="/admin/forms" element={<AdminFormsPage />} />

        <Route path="/admin/users" element={<AdminUsersPage />} />

        <Route path="/admin/statistics" element={<AdminStatisticsPage />} />

      </Routes>
    </BrowserRouter>
  );
}