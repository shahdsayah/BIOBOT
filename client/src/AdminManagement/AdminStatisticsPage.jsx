import { FaChartBar, FaUsers, FaFileAlt, FaRobot } from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

export default function AdminStatisticsPage() {
  const commonQuestions = [
    "איך מגישים ערעור על ציון?",
    "איפה מוצאים טופס מועד מיוחד?",
    "מה התנאים למעבר שנה?",
    "איך פונים לוועדת משמעת?",
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <PageHeader title="סטטיסטיקות מערכת" buttonText="לוח ניהול" to="/admin" />

      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-[1100px] mx-auto space-y-8">
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
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
              <p className="text-slate-500 dark:text-slate-400">שאלות בביו־בוט</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center">
              <FaChartBar className="text-4xl mx-auto mb-4 text-brand" />
              <h2 className="text-3xl font-bold dark:text-white">7</h2>
              <p className="text-slate-500 dark:text-slate-400">נושאים נפוצים</p>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-brand mb-6">
              שאלות נפוצות
            </h1>

            <div className="space-y-4">
              {commonQuestions.map((question, index) => (
                <div
                  key={question}
                  className="flex items-center justify-between border border-slate-200 dark:border-slate-600 rounded-xl p-4"
                >
                  <p className="font-bold text-slate-700 dark:text-slate-200">{question}</p>

                  <span className="bg-slate-100 dark:bg-slate-700 px-4 py-1 rounded-full text-sm text-slate-600 dark:text-slate-300">
                    {index + 4} פעמים
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
