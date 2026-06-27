import { useEffect, useState } from "react";
import { FaChartBar, FaUsers, FaFileAlt, FaRobot } from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

import { getStats } from "../Services/statsService";
import { useLanguage } from "../contexts/languageContext";

export default function AdminStatisticsPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError(t("adminStatsError"));
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    { icon: <FaUsers />, label: t("adminStatStudents"), value: stats?.totalUsers },
    { icon: <FaFileAlt />, label: t("adminStatForms"), value: stats?.totalForms },
    { icon: <FaRobot />, label: t("adminStatQuestionsFull"), value: stats?.totalQuestions },
    { icon: <FaChartBar />, label: t("adminStatChats"), value: stats?.totalChats },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <PageHeader title={t("adminStatsTitle")} buttonText={t("adminStatsBack")} to="/admin" showLanguageToggle />

      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-[1100px] mx-auto space-y-8">

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl p-4 text-center">
              {error}
            </div>
          )}

          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {cards.map(({ icon, label, value }) => (
              <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 text-center">
                <div className="text-4xl mx-auto mb-4 text-brand flex justify-center">{icon}</div>
                <h2 className="text-3xl font-bold dark:text-white">
                  {loading ? "..." : value ?? 0}
                </h2>
                <p className="text-slate-500 dark:text-slate-200">{label}</p>
              </div>
            ))}
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-brand mb-6">
              {t("adminStatsTopQuestions")}
            </h2>

            {loading ? (
              <p className="text-slate-400 text-center py-6">{t("adminStatsLoading")}</p>
            ) : !stats?.topQuestions?.length ? (
              <p className="text-slate-400 text-center py-6">
                {t("adminStatsNoQuestions")}
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topQuestions.map(({ text, count }, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-slate-200 dark:border-slate-500 rounded-xl p-4 gap-4"
                  >
                    <p className="font-medium text-slate-700 dark:text-slate-200 truncate">
                      {text}
                    </p>
                    <span className="shrink-0 bg-brand/10 text-brand px-4 py-1 rounded-full text-sm font-bold">
                      {count}×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-brand mb-6 flex items-center gap-2">
                👍 {t("adminStatsLiked")}
              </h2>

              {loading ? (
                <p className="text-slate-400 text-center py-6">{t("adminStatsLoading")}</p>
              ) : !stats?.likedAnswers?.length ? (
                <p className="text-slate-400 text-center py-6">{t("adminStatsNoLiked")}</p>
              ) : (
                <div className="space-y-3">
                  {stats.likedAnswers.map((item, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 dark:border-slate-500 rounded-xl p-4"
                    >
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        {new Date(item.createdAt).toLocaleDateString("he-IL")}
                      </p>
                      <p className="text-slate-700 dark:text-slate-200 text-sm leading-6 line-clamp-3">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-brand mb-6 flex items-center gap-2">
                👎 {t("adminStatsDisliked")}
              </h2>

              {loading ? (
                <p className="text-slate-400 text-center py-6">{t("adminStatsLoading")}</p>
              ) : !stats?.dislikedAnswers?.length ? (
                <p className="text-slate-400 text-center py-6">{t("adminStatsNoDisliked")}</p>
              ) : (
                <div className="space-y-3">
                  {stats.dislikedAnswers.map((item, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 dark:border-slate-500 rounded-xl p-4"
                    >
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        {new Date(item.createdAt).toLocaleDateString("he-IL")}
                      </p>
                      <p className="text-slate-700 dark:text-slate-200 text-sm leading-6 line-clamp-3">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
