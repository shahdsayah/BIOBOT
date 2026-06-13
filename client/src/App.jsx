import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./UserManagement/LoginPage";
import SignupPage from "./UserManagement/SignupPage";
import StudentHomePage from "./UserManagement/StudentHomePage";
import ProfilePage from "./UserManagement/ProfilePage";

import FormsPage from "./FormsManagement/FormsPage";
import AdminFormsPage from "./FormsManagement/AdminFormsPage";

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

        <Route path="/forms" element={<FormsPage />} />

        <Route path="/admin/forms" element={<AdminFormsPage />} />

        <Route path="/chat" element={<BioBotPage />} />

      </Routes>
    </BrowserRouter>
  );
}