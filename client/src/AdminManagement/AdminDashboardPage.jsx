import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaUsers, FaChartBar, FaRobot } from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import CardButton from "../GUIManagement/CardButton";

import { getCurrentUser, logoutUser } from "../Services/authService";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const admin = getCurrentUser();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

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
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center">
              <FaUsers className="text-4xl mx-auto mb-4 text-brand" />
              <h2 className="text-3xl font-bold dark:text-white">12</h2>
              <p className="text-slate-500 dark:text-slate-400">משתמשים</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center">
              <FaFileAlt className="text-4xl mx-auto mb-4 text-brand" />
              <h2 className="text-3xl font-bold dark:text-white">4</h2>
              <p className="text-slate-500 dark:text-slate-400">טפסים</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center">
              <FaRobot className="text-4xl mx-auto mb-4 text-brand" />
              <h2 className="text-3xl font-bold dark:text-white">28</h2>
              <p className="text-slate-500 dark:text-slate-400">שאלות</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center">
              <FaChartBar className="text-4xl mx-auto mb-4 text-brand" />
              <h2 className="text-3xl font-bold dark:text-white">7</h2>
              <p className="text-slate-500 dark:text-slate-400">נושאים נפוצים</p>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
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