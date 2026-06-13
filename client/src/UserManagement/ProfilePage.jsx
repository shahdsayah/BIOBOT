import { useState } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

import { getCurrentUser } from "../Services/authService";

export default function ProfilePage() {
  const [sortType, setSortType] = useState("name");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function loadStudent() {
      if (!auth.currentUser) return;

      const data = await getStudentProfile(auth.currentUser.uid);
      setStudent(data);
    }

    loadStudent();
  }, []);

  const courses = [
    { name: "טכנולוגיות אינטרנט מתקדמות", grade: 94, credits: 4 },
    { name: "בסיסי נתונים", grade: 88, credits: 3 },
    { name: "מבוא לתכנות", grade: 91, credits: 4 },
    { name: "כימיה כללית", grade: 76, credits: 3 },
    { name: "מתמטיקה דיסקרטית", grade: 83, credits: 4 },
    { name: "אנגלית מתקדמים ב׳", grade: 97, credits: 2 },
    { name: "פיזיקה 1", grade: 68, credits: 4 },
  ];

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortType === "name") return a.name.localeCompare(b.name, "he");
    if (sortType === "grade") return b.grade - a.grade;
    return 0;
  });

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  const gpa =
    courses.reduce((sum, course) => sum + course.grade * course.credits, 0) /
    totalCredits;

  const gradeRanges = [
    { label: "90-100", count: courses.filter((c) => c.grade >= 90).length },
    { label: "80-89", count: courses.filter((c) => c.grade >= 80 && c.grade <= 89).length },
    { label: "70-79", count: courses.filter((c) => c.grade >= 70 && c.grade <= 79).length },
    { label: "60-69", count: courses.filter((c) => c.grade >= 60 && c.grade <= 69).length },
    { label: "55-59", count: courses.filter((c) => c.grade >= 55 && c.grade <= 59).length },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col">
      <PageHeader title="פרופיל אישי" buttonText="דף הבית" to="/home" />

      <main className="flex-1 p-8">
        <div className="max-w-[1150px] mx-auto space-y-6">
          <section className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-[oklch(48.8%_0.243_264.376)] mb-4">
                פרטים אישיים
              </h2>

              <p>
                <strong>שם:</strong>{" "}
                {student
                  ? `${student.firstName} ${student.lastName}`
                  : "טוען..."}
              </p>

              <p>
                <strong>אימייל:</strong>{" "}
                {student?.email || "טוען..."}
              </p>

              <p>
                <strong>תפקיד:</strong>{" "}
                {student?.role || "student"}
              </p>

              <p>
                <strong>מחלקה:</strong> הנדסת ביוטכנולוגיה
              </p>

              <p>
                <strong>שנה:</strong> שנה ב׳
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold text-slate-700 mb-3">
                ממוצע ציונים
              </h2>

              <p className="text-5xl font-extrabold text-[oklch(48.8%_0.243_264.376)]">
                {gpa.toFixed(1)}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold text-slate-700 mb-3">
                נקודות זכות
              </h2>

              <p className="text-5xl font-extrabold text-[oklch(48.8%_0.243_264.376)]">
                {totalCredits}
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-[oklch(48.8%_0.243_264.376)] mb-6">
              התפלגות ציונים
            </h2>

            <div className="grid grid-cols-5 gap-4">
              {gradeRanges.map((range) => (
                <div
                  key={range.label}
                  className="border border-slate-200 rounded-xl p-5 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full border-8 border-[oklch(48.8%_0.243_264.376)] flex items-center justify-center">
                    <span className="text-2xl font-bold text-[oklch(48.8%_0.243_264.376)]">
                      {range.count}
                    </span>
                  </div>

                  <p className="font-bold text-slate-700">{range.label}</p>
                  <p className="text-sm text-slate-500">קורסים</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-[oklch(48.8%_0.243_264.376)]">
                קורסים שהושלמו
              </h2>

              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="border border-slate-300 rounded-xl px-4 py-2 outline-none"
              >
                <option value="name">מיון לפי שם הקורס</option>
                <option value="grade">מיון לפי ציון</option>
              </select>
            </div>

            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b text-slate-600">
                  <th className="py-3">שם הקורס</th>
                  <th className="py-3">ציון</th>
                  <th className="py-3">נק״ז</th>
                </tr>
              </thead>

              <tbody>
                {sortedCourses.map((course) => (
                  <tr key={course.name} className="border-b">
                    <td className="py-3">{course.name}</td>
                    <td className="py-3 font-bold">{course.grade}</td>
                    <td className="py-3">{course.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}