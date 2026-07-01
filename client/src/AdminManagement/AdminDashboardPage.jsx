/** @file Admin dashboard page component. */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaUsers, FaChartBar, FaRobot } from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import CardButton from "../GUIManagement/CardButton";

import { getCurrentUser, logoutUser } from "../Services/authService";
import { getStats } from "../Services/statsService";
import { useLanguage } from "../contexts/languageContext";

/*
 * Page: Admin Dashboard
 * Overview panel for admins showing platform stats (students, forms, questions, chats) and navigation cards to sub-sections.
 */
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const admin = getCurrentUser();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  const cards = [
    { icon: <FaUsers />, label: t("adminStatStudents"), value: stats?.totalUsers },
    { icon: <FaFileAlt />, label: t("adminStatForms"), value: stats?.totalForms },
    { icon: <FaRobot />, label: t("adminStatQuestions"), value: stats?.totalQuestions },
    { icon: <FaChartBar />, label: t("adminStatChats"), value: stats?.totalChats },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <PageHeader
        title={t("adminDashboardTitle")}
        buttonText={t("adminLogout")}
        onClick={handleLogout}
        showLanguageToggle
      />

      <main className="flex-1 px-4 sm:px-8 py-10">
        <div className="max-w-[1150px] mx-auto">
          <section className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand mb-3">
              {t("adminGreeting", { name: admin?.firstName || t("adminLogout") })}
            </h1>

            <p className="text-slate-600 dark:text-slate-200 text-lg">
              {t("adminWelcome")}
            </p>
          </section>

          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {cards.map(({ icon, label, value }) => (
              <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 text-center">
                <div className="text-4xl mx-auto mb-4 text-brand flex justify-center">{icon}</div>
                <h2 className="text-3xl font-bold dark:text-white">
                  {stats ? (value ?? 0) : "..."}
                </h2>
                <p className="text-slate-500 dark:text-slate-200">{label}</p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <CardButton
              icon={<FaFileAlt />}
              title={t("adminNavFormsTitle")}
              description={t("adminNavFormsDesc")}
              onClick={() => navigate("/admin/forms")}
            />

            <CardButton
              icon={<FaUsers />}
              title={t("adminNavUsersTitle")}
              description={t("adminNavUsersDesc")}
              onClick={() => navigate("/admin/users")}
            />

            <CardButton
              icon={<FaChartBar />}
              title={t("adminNavStatsTitle")}
              description={t("adminNavStatsDesc")}
              onClick={() => navigate("/admin/statistics")}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
