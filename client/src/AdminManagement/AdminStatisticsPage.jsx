/** @file Admin statistics page component. */

import { useEffect, useMemo, useState } from "react";
import { FaChartBar, FaUsers, FaFileAlt, FaRobot } from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

import { getStats } from "../Services/statsService";
import { formatDate } from "../Services/dateUtils";
import { useLanguage } from "../contexts/languageContext";
import EmptyState from "../GUIManagement/EmptyState";
import SectionCard from "../GUIManagement/SectionCard";
import { SkeletonStatCard, SkeletonLine } from "../GUIManagement/Skeleton";

/*
 * Page: Admin Statistics
 * Displays platform usage stats: total counts, top chatbot questions, and the last 30 liked/disliked bot answers.
 */
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

  const cards = useMemo(
    () => [
      { icon: <FaUsers />, label: t("adminStatStudents"), value: stats?.totalUsers },
      { icon: <FaFileAlt />, label: t("adminStatForms"), value: stats?.totalForms },
      { icon: <FaRobot />, label: t("adminStatQuestionsFull"), value: stats?.totalQuestions },
      { icon: <FaChartBar />, label: t("adminStatChats"), value: stats?.totalChats },
    ],
    [stats, t]
  );

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
            {loading
              ? [0, 1, 2, 3].map((i) => <SkeletonStatCard key={i} />)
              : cards.map(({ icon, label, value }) => (
                  <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 text-center">
                    <div className="text-4xl mx-auto mb-4 text-brand flex justify-center">{icon}</div>
                    <h2 className="text-3xl font-bold dark:text-white">{value ?? 0}</h2>
                    <p className="text-slate-500 dark:text-slate-200">{label}</p>
                  </div>
                ))}
          </section>

          <SectionCard as="section">
            <h2 className="text-2xl font-bold text-brand mb-6">
              {t("adminStatsTopQuestions")}
            </h2>

            {loading ? (
              <div className="space-y-3">{[0,1,2].map(i => <SkeletonLine key={i} className="h-12 rounded-xl" />)}</div>
            ) : !stats?.topQuestions?.length ? (
              <EmptyState icon="💬" title={t("emptyQuestionsTitle")} description={t("emptyQuestionsDesc")} />
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
          </SectionCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SectionCard as="section">
              <h2 className="text-2xl font-bold text-brand mb-6 flex items-center gap-2">
                👍 {t("adminStatsLiked")}
              </h2>

              {loading ? (
                <div className="space-y-3">{[0,1,2].map(i => <SkeletonLine key={i} className="h-20 rounded-xl" />)}</div>
              ) : !stats?.likedAnswers?.length ? (
                <EmptyState icon="👍" title={t("emptyLikedTitle")} description={t("emptyLikedDesc")} />
              ) : (
                <div className="space-y-3">
                  {stats.likedAnswers.map((item, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 dark:border-slate-500 rounded-xl p-4"
                    >
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        {formatDate(item.createdAt)}
                      </p>
                      <p className="text-slate-700 dark:text-slate-200 text-sm leading-6 line-clamp-3">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard as="section">
              <h2 className="text-2xl font-bold text-brand mb-6 flex items-center gap-2">
                👎 {t("adminStatsDisliked")}
              </h2>

              {loading ? (
                <div className="space-y-3">{[0,1,2].map(i => <SkeletonLine key={i} className="h-20 rounded-xl" />)}</div>
              ) : !stats?.dislikedAnswers?.length ? (
                <EmptyState icon="👎" title={t("emptyDislikedTitle")} description={t("emptyDislikedDesc")} />
              ) : (
                <div className="space-y-3">
                  {stats.dislikedAnswers.map((item, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 dark:border-slate-500 rounded-xl p-4"
                    >
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        {formatDate(item.createdAt)}
                      </p>
                      <p className="text-slate-700 dark:text-slate-200 text-sm leading-6 line-clamp-3">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
