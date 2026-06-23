import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaUsers, FaChartBar, FaRobot } from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import CardButton from "../GUIManagement/CardButton";

import { getCurrentUser, logoutUser } from "../Services/authService";
import { getStats } from "../Services/statsService";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
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
    { icon: <FaUsers />, label: "סטודנטים", value: stats?.totalUsers },
    { icon: <FaFileAlt />, label: "טפסים", value: stats?.totalForms },
    { icon: <FaRobot />, label: "שאלות", value: stats?.totalQuestions },
    { icon: <FaChartBar />, label: "שיחות", value: stats?.totalChats },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <PageHeader
        title="לוח ניהול"
        buttonText="התנתק"
        onClick={handleLogout}
      />

      <main className="flex-1 px-4 sm:px-8 py-10">
        <div className="max-w-[1150px] mx-auto">
          <section className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand mb-3">
              שלום {admin?.firstName || "מנהל"} 👋
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-lg">
              ברוכים הבאים ללוח הניהול של מערכת ביו-בוט
            </p>
          </section>

          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {cards.map(({ icon, label, value }) => (
              <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center">
                <div className="text-4xl mx-auto mb-4 text-brand flex justify-center">{icon}</div>
                <h2 className="text-3xl font-bold dark:text-white">
                  {stats ? (value ?? 0) : "..."}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <CardButton
              icon={<FaFileAlt />}
              title="ניהול טפסים"
              description="הוספה, עריכה ומחיקה של טפסים"
              onClick={() => navigate("/admin/forms")}
            />

            <CardButton
              icon={<FaUsers />}
              title="ניהול משתמשים"
              description="צפייה במשתמשים והרשאות"
              onClick={() => navigate("/admin/users")}
            />

            <CardButton
              icon={<FaChartBar />}
              title="סטטיסטיקות"
              description="נתוני שימוש ושאלות נפוצות"
              onClick={() => navigate("/admin/statistics")}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
