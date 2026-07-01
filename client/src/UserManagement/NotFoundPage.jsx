/** @file 404 Not Found page component. */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import ActionButton from "../GUIManagement/ActionButton";

import { getCurrentUser } from "../Services/authService";
import { useLanguage } from "../contexts/languageContext";

/*
 * Page: 404 Not Found
 * Shown for any unmatched route. Displays contextual navigation buttons (login, home, or admin dashboard) based on the user's role.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const user = getCurrentUser();

  const primaryAction = useMemo(() => {
    if (!user) {
      return { to: "/login", label: t("goToLogin") };
    }

    if (user.role === "admin") {
      return { to: "/admin", label: t("goToDashboard") };
    }

    return { to: "/home", label: t("goToHome") };
  }, [t, user]);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <PageHeader
        title={t("notFoundTitle")}
        buttonText={primaryAction.label}
        to={primaryAction.to}
        showLanguageToggle
      />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
          <p className="text-8xl sm:text-9xl font-extrabold text-brand leading-none">
            404
          </p>

          <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
            {t("notFoundHeading")}
          </h2>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-200 max-w-xl mx-auto">
            {t("notFoundDescription")}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:max-w-xl sm:mx-auto">
            <ActionButton
              text={primaryAction.label}
              onClick={() => navigate(primaryAction.to)}
            />

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full border border-slate-300 dark:border-slate-500 dark:text-slate-200 py-3 font-bold rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {t("goBack")}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}