import { useState, useEffect } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

import { getCurrentUser, getUserById } from "../Services/authService";

const SCHEDULE_DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

export default function ProfilePage() {
  const [sortType, setSortType] = useState("name");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.error("Failed to load student:", error);

        const currentUser = getCurrentUser();
        setStudent(currentUser);
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, []);

  // Real data from the database — no more hardcoded arrays.
  const courses = student?.completedCourses || [];
  const schedule = student?.schedule || [];

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortType === "name") return a.name.localeCompare(b.name, "he");
    if (sortType === "grade") return b.grade - a.grade;
    return 0;
  });

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  // Guard against 0/0 = NaN for a first-semester student with no
  // completed courses yet (the year-א template starts empty).
  const gpa =
    totalCredits > 0
      ? courses.reduce((sum, course) => sum + course.grade * course.credits, 0) /
        totalCredits
      : null;

  const gradeRanges = [
    { label: "90-100", count: courses.filter((c) => c.grade >= 90).length },
    {
      label: "80-89",
      count: courses.filter((c) => c.grade >= 80 && c.grade <= 89).length,
    },
    {
      label: "70-79",
      count: courses.filter((c) => c.grade >= 70 && c.grade <= 79).length,
    },
    {
      label: "60-69",
      count: courses.filter((c) => c.grade >= 60 && c.grade <= 69).length,
    },
    {
      label: "55-59",
      count: courses.filter((c) => c.grade >= 55 && c.grade <= 59).length,
    },
  ];

  // Distinct start times actually present in this student's schedule,
  // used as the table's rows. Built from real data, not fixed slots —
  // different templates (year א/ב/ג/ד) have different time patterns.
  const timeSlots = [...new Set(schedule.map((entry) => entry.startTime))].sort();

  function getClassAt(day, time) {
    return schedule.find((entry) => entry.day === day && entry.startTime === time);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <PageHeader title="פרופיל אישי" buttonText="דף הבית" to="/home" />

      <main className="flex-1 p-8">
        <div className="max-w-[1150px] mx-auto space-y-6">
          <section className="grid grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-brand mb-4">
                פרטים אישיים
              </h2>

              <p>
                <strong>שם:</strong>{" "}
                {loading
                  ? "טוען..."
                  : student
                  ? `${student.firstName || ""} ${student.lastName || ""}`
                  : "לא נמצא"}
              </p>

              <p>
                <strong>אימייל:</strong>{" "}
                {loading ? "טוען..." : student?.email || "לא נמצא"}
              </p>

              <p>
                <strong>תפקיד:</strong>{" "}
                {loading ? "טוען..." : student?.role || "student"}
              </p>

              <p>
                <strong>מחלקה:</strong>{" "}
                {student?.department || "הנדסת ביוטכנולוגיה"}
              </p>

              <p>
                <strong>שנה:</strong>{" "}
                {student?.year ? `שנה ${student.year}׳` : "—"}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-3">
                ממוצע ציונים
              </h2>

              <p className="text-5xl font-extrabold text-brand">
                {gpa !== null ? gpa.toFixed(1) : "—"}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-3">
                נקודות זכות
              </h2>

              <p className="text-5xl font-extrabold text-brand">
                {totalCredits}
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-brand mb-6">
              מערכת שעות הרצאות
            </h2>

            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  <th className="border border-slate-300 dark:border-slate-600 py-3">שעה</th>
                  {SCHEDULE_DAYS.map((day) => (
                    <th key={day} className="border border-slate-300 dark:border-slate-600 py-3">
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
                      className="border border-slate-300 dark:border-slate-600 h-24 text-slate-400"
                    >
                      אין נתוני מערכת שעות זמינים כרגע
                    </td>
                  </tr>
                ) : (
                  timeSlots.map((time) => (
                    <tr key={time}>
                      <td className="border border-slate-300 dark:border-slate-600 py-2 font-bold text-slate-600">
                        {time}
                      </td>

                      {SCHEDULE_DAYS.map((day) => {
                        const entry = getClassAt(day, time);

                        return (
                          <td
                            key={day}
                            className="border border-slate-300 dark:border-slate-600 h-24 align-top p-2"
                          >
                            {entry && (
                              <div>
                                <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                                  {entry.courseName}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
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
          </section>

          {courses.length === 0 ? (
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                עדיין לא הושלמו קורסים — הציונים יופיעו כאן לאחר תום הסמסטר
                הראשון.
              </p>
            </section>
          ) : (
            <>
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-brand mb-6">
                  התפלגות ציונים
                </h2>

                <div className="grid grid-cols-5 gap-4">
                  {gradeRanges.map((range) => (
                    <div
                      key={range.label}
                      className="border border-slate-200 dark:border-slate-600 rounded-xl p-5 text-center"
                    >
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full border-8 border-brand flex items-center justify-center">
                        <span className="text-2xl font-bold text-brand">
                          {range.count}
                        </span>
                      </div>

                      <p className="font-bold text-slate-700 dark:text-slate-200">{range.label}</p>
                      <p className="text-sm text-slate-500">קורסים</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-brand">
                    קורסים שהושלמו
                  </h2>

                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-xl px-4 py-2 outline-none"
                  >
                    <option value="name">מיון לפי שם הקורס</option>
                    <option value="grade">מיון לפי ציון</option>
                  </select>
                </div>

                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b dark:border-slate-600 text-slate-600 dark:text-slate-300">
                      <th className="py-3">שם הקורס</th>
                      <th className="py-3">ציון</th>
                      <th className="py-3">נק״ז</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedCourses.map((course, index) => (
                      <tr key={`${course.name}-${index}`} className="border-b dark:border-slate-600 dark:text-slate-200">
                        <td className="py-3">{course.name}</td>
                        <td className="py-3 font-bold">{course.grade}</td>
                        <td className="py-3">{course.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
