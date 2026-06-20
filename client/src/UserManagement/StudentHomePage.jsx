import { useNavigate } from "react-router-dom";

import { FaUser, FaRobot, FaFileAlt , FaSearch} from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import CardButton from "../GUIManagement/CardButton";
import { useLanguage } from "../contexts/languageContext";

import { getCurrentUser, logoutUser } from "../Services/authService";

import logo from "../assets/logo.jpg";

export default function StudentHomePage() {
  const navigate = useNavigate();
  const { t, direction } = useLanguage();

  const student = getCurrentUser();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div dir={direction} className="min-h-screen bg-slate-100 flex flex-col">
      <PageHeader
        title={t("homePage")}
        buttonText={t("logout")}
        onClick={handleLogout}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-10">
        <img
          src={logo}
          alt="BIOBOT Logo"
          className="w-36 h-36 rounded-full bg-white object-contain p-3 shadow-lg mb-6"
        />

        <h1 className="text-4xl font-extrabold text-[oklch(48.8%_0.243_264.376)] mb-3 text-center">
          {t("shalom")} {student?.firstName || t("studentFallback")} 👋
        </h1>

        <p className="text-slate-600 text-lg mb-12 text-center">
          {t("welcome")}
        </p>

        <div className="grid grid-cols-4 gap-8">
          <CardButton
            icon={<FaUser />}
            title={t("profilePage")}
            description={t("profileDesc")}
            onClick={() => navigate("/profile")}
          />

          <CardButton
            icon={<FaSearch />}
            title={t("searchPage")}
            description={t("searchDesc")}
            onClick={() => navigate("/search")}
          />

          <CardButton
            icon={<FaRobot />}
            title={t("bioBotPage")}
            description={t("bioBotDesc")}
            onClick={() => navigate("/chat")}
          />

          <CardButton
            icon={<FaFileAlt />}
            title={t("formsPage")}
            description={t("formsDesc")}
            onClick={() => navigate("/forms")}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}