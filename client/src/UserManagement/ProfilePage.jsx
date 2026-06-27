import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

import { getCurrentUser, getUserById } from "../Services/authService";
import { useLanguage } from "../contexts/languageContext";

const SCHEDULE_DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
const SCHEDULE_DAYS_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const [sortType, setSortType] = useState("name");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  const scheduleSectionRef = useRef(null);
  const completedCoursesSectionRef = useRef(null);
  const coursesTableSectionRef = useRef(null);
  const emptyCoursesSectionRef = useRef(null);

  const SCHEDULE_DAYS = language === "ar" ? SCHEDULE_DAYS_AR : SCHEDULE_DAYS_HE;

  useEffect(() => {
    async function loadStudent() {
      try {
        const currentUser = getCurrentUser();

        if (!currentUser) {
          setLoading(false);
          return;
        }

        const userId = currentUser._id || currentUser.id;

        if (userId) {
          const data = await getUserById(userId);
          setStudent(data);
        } else {
          setStudent(currentUser);
        }
      } catch (error) {

        const currentUser = getCurrentUser();
        setStudent(currentUser);
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, []);

  const courses = student?.completedCourses || [];
  const schedule = student?.schedule || [];

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortType === "name") return a.name.localeCompare(b.name, "he");
    if (sortType === "grade") return b.grade - a.grade;
    return 0;
  });

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  const gpa =
    totalCredits > 0
      ? courses.reduce((sum, course) => sum + course.grade * course.credits, 0) /
        totalCredits
      : null;

  const gradeRanges = [
    { label: "90-100", count: courses.filter((c) => c.grade >= 90).length },
    { label: "80-89", count: courses.filter((c) => c.grade >= 80 && c.grade <= 89).length },
    { label: "70-79", count: courses.filter((c) => c.grade >= 70 && c.grade <= 79).length },
    { label: "60-69", count: courses.filter((c) => c.grade >= 60 && c.grade <= 69).length },
    { label: "55-59", count: courses.filter((c) => c.grade >= 55 && c.grade <= 59).length },
  ];

  const timeSlots = [...new Set(schedule.map((entry) => entry.startTime))].sort();

  function getClassAt(day, time) {
    const dayIndexMap = language === "ar" ? SCHEDULE_DAYS_AR : SCHEDULE_DAYS_HE;
    const dayIndex = dayIndexMap.indexOf(day);
    const heDay = SCHEDULE_DAYS_HE[dayIndex];
    return schedule.find((entry) => entry.day === heDay && entry.startTime === time);
  }

  async function handleDownloadAcademicPdf() {
    setPdfError("");

    const coursesSectionForPdf =
      courses.length === 0
        ? emptyCoursesSectionRef.current
        : coursesTableSectionRef.current;

    const sections = [scheduleSectionRef.current, coursesSectionForPdf].filter(Boolean);

    if (sections.length === 0) {
      return;
    }

    try {
      setIsPdfLoading(true);

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const horizontalMargin = 24;
      const verticalMargin = 24;
      const targetWidth = pageWidth - horizontalMargin * 2;
      const usableHeight = pageHeight - verticalMargin * 2;
      const renderScale = Math.max(1, Math.min(1.5, window.devicePixelRatio || 1));

      for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        const section = sections[sectionIndex];
        const canvas = await html2canvas(section, {
          scale: renderScale,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          onclone: (clonedDoc) => {
            const colorFallbackStyle = clonedDoc.createElement("style");
            colorFallbackStyle.textContent = `
              :root {
                --color-brand: #4f46e5 !important;
                --color-brand-light: #eef2ff !important;
                --color-slate-50: #f8fafc !important;
                --color-slate-100: #f1f5f9 !important;
                --color-slate-200: #e2e8f0 !important;
                --color-slate-300: #cbd5e1 !important;
                --color-slate-400: #94a3b8 !important;
                --color-slate-500: #64748b !important;
                --color-slate-600: #475569 !important;
                --color-slate-700: #334155 !important;
                --color-slate-800: #1e293b !important;
                --color-slate-900: #0f172a !important;
                --color-red-500: #ef4444 !important;
              }

              [data-pdf-hide] {
                display: none !important;
              }
            `;
            clonedDoc.head.appendChild(colorFallbackStyle);
          },
        });

        if (!canvas.width || !canvas.height) {
          continue;
        }

        if (sectionIndex > 0) {
          pdf.addPage();
        }

        const sectionScale = targetWidth / canvas.width;
        const pageSliceHeightPx = Math.floor(usableHeight / sectionScale);

        let offsetY = 0;

        while (offsetY < canvas.height) {
          const sliceHeight = Math.min(pageSliceHeightPx, canvas.height - offsetY);
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;

          const pageContext = pageCanvas.getContext("2d");
          if (!pageContext) {
            throw new Error("Failed to create canvas context");
          }

          pageContext.drawImage(
            canvas,
            0,
            offsetY,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight
          );

          const pageImage = pageCanvas.toDataURL("image/png", 0.92);
          const renderedHeight = sliceHeight * sectionScale;

          pdf.addImage(
            pageImage,
            "PNG",
            horizontalMargin,
            verticalMargin,
            targetWidth,
            renderedHeight
          );

          offsetY += sliceHeight;

          if (offsetY < canvas.height) {
            pdf.addPage();
          }
        }
      }

      const studentName = [student?.firstName, student?.lastName]
        .filter(Boolean)
        .join("-")
        .trim() || "student";

      const safeStudentName = studentName.replace(/\s+/g, "-").replace(/[^\w\-]/g, "");
      pdf.save(`biobot-academic-${safeStudentName}.pdf`);
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : String(error || "Unknown error");

      console.error("PDF export failed:", error);
      setPdfError(`${t("pdfGenerationFailed")} (${errorMessage})`);
    } finally {
      setIsPdfLoading(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <PageHeader title={t("profilePage")} buttonText={t("homeButton")} to="/home" showLanguageToggle />

      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-[1150px] mx-auto space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-brand mb-4">
                {t("privateDetails")}
              </h2>

              <p>
                <strong>{t("stdname")}:</strong>{" "}
                {loading
                  ? t("loading")
                  : student
                  ? `${student.firstName || ""} ${student.lastName || ""}`
                  : t("notFound")}
              </p>

              <p>
                <strong>{t("stdEmail")}:</strong>{" "}
                {loading ? t("loading") : student?.email || t("notFound")}
              </p>

              <p>
                <strong>{t("stdRole")}:</strong>{" "}
                {loading ? t("loading") : student?.role || "student"}
              </p>

              <p>
                <strong>{t("stdDept")}:</strong>{" "}
                {student?.department || t("departmentFallback")}
              </p>

              <p>
                <strong>{t("stdYear")}:</strong>{" "}
                {student?.year ? `${t("stdYear")} ${student.year}׳` : "—"}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-3">
                {t("averageGrade")}
              </h2>

              <p className="text-5xl font-extrabold text-brand">
                {gpa !== null ? gpa.toFixed(1) : "—"}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-3">
                {t("points")}
              </h2>

              <p className="text-5xl font-extrabold text-brand">
                {totalCredits}
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
            <button
              type="button"
              onClick={handleDownloadAcademicPdf}
              disabled={isPdfLoading || loading}
              className="bg-brand text-white px-6 py-3 rounded-md font-bold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPdfLoading ? t("generatingPdf") : t("downloadAcademicPdf")}
            </button>

            {pdfError && (
              <p className="text-red-500 text-sm mt-3">{pdfError}</p>
            )}
          </section>

          <section ref={scheduleSectionRef} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-brand mb-6">
              {t("scheduleTitle")}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    <th className="border border-slate-300 dark:border-slate-500 py-3">
                      {t("scheduleTimeHeader")}
                    </th>
                    {SCHEDULE_DAYS.map((day) => (
                      <th key={day} className="border border-slate-300 dark:border-slate-500 py-3">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {timeSlots.length === 0 ? (
                    <tr>
                      <td
                        colSpan={SCHEDULE_DAYS.length + 1}
                        className="border border-slate-300 dark:border-slate-500 h-24 text-slate-400"
                      >
                        {t("scheduleEmpty")}
                      </td>
                    </tr>
                  ) : (
                    timeSlots.map((time) => (
                      <tr key={time}>
                        <td className="border border-slate-300 dark:border-slate-500 py-2 font-bold text-slate-600">
                          {time}
                        </td>

                        {SCHEDULE_DAYS.map((day) => {
                          const entry = getClassAt(day, time);

                          return (
                            <td
                              key={day}
                              className="border border-slate-300 dark:border-slate-500 h-24 align-top p-2"
                            >
                              {entry && (
                                <div>
                                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                                    {entry.courseName}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-200">
                                    {entry.startTime}–{entry.endTime}
                                    {entry.room ? ` · ${entry.room}` : ""}
                                  </p>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div ref={completedCoursesSectionRef} className="space-y-6">
            {courses.length === 0 ? (
              <section
                ref={emptyCoursesSectionRef}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 text-center"
              >
                <p className="text-slate-500 dark:text-slate-200">
                  {t("coursesEmpty")}
                </p>
              </section>
            ) : (
              <>
                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-brand mb-6">
                    {t("gradeDistribution")}
                  </h2>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {gradeRanges.map((range) => (
                      <div
                        key={range.label}
                        className="border border-slate-200 dark:border-slate-500 rounded-xl p-5 text-center"
                      >
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full border-8 border-brand flex items-center justify-center">
                          <span className="text-2xl font-bold text-brand">
                            {range.count}
                          </span>
                        </div>

                        <p className="font-bold text-slate-700 dark:text-slate-200">{range.label}</p>
                        <p className="text-sm text-slate-500">{t("coursesLabel")}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section
                  ref={coursesTableSectionRef}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-brand">
                      {t("coursesDone")}
                    </h2>

                    <select
                      data-pdf-hide
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value)}
                      className="border border-slate-300 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200 rounded-xl px-4 py-2 outline-none"
                    >
                      <option value="name">
                        {t("sortByName")}
                      </option>
                      <option value="grade">
                        {t("sortByGrade")}
                      </option>
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse min-w-[300px]">
                      <thead>
                        <tr className="border-b dark:border-slate-500 text-slate-600 dark:text-slate-200">
                          <th className="py-3">{t("courseName")}</th>
                          <th className="py-3">{t("courseGrade")}</th>
                          <th className="py-3">{t("credits")}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {sortedCourses.map((course, index) => (
                          <tr key={`${course.name}-${index}`} className="border-b dark:border-slate-500 dark:text-slate-200">
                            <td className="py-3">{course.name}</td>
                            <td className="py-3 font-bold">{course.grade}</td>
                            <td className="py-3">{course.credits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
