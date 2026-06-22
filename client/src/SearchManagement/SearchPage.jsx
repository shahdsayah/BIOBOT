
import { useMemo, useState } from "react";
import { useLanguage } from "../contexts/languageContext";
import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import SearchBar from "../GUIManagement/SearchBar";

const initialCourses = [
  {
    id: 1,
    name: "מבוא לביוטכנולוגיה",
    semester: "1",
    code: "11495",
    lecturer: "מורן",
    credits: 3
  },
  {
    id: 2,
    name: "כימיה אורגנית",
    semester: "2",
    code: "11496",
    lecturer: "פרופ׳ רוזן",
    credits: 4
  },
  {
    id: 3,
    name: "מבני תאים",
    semester: "2",
    code: "11497",
    lecturer: "אנעארף",
    credits: 3
  },
  {
    id: 4,
    name: "הנדסת מערכות ביולוגיות",
    semester: "3",
    code: "22045",
    lecturer: "חסקל",
    credits: 4
  },
  {
    id: 5,
    name: "סטטיסטיקה ביו-רפואית",
    semester: "3",
    code: "22046",
    lecturer: "סמיר",
    credits: 2
  },
];

export default function SearchPage() {
  const [searchName, setSearchName] = useState("");
  const [searchSemester, setSearchSemester] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchLecturer, setSearchLecturer] = useState("");

  const filteredCourses = useMemo(() => {
    const normalizedName = searchName.trim().toLowerCase();
    const normalizedSemester = searchSemester.trim().toLowerCase();
    const normalizedCode = searchCode.trim().toLowerCase();
    const normalizedLecturer = searchLecturer.trim().toLowerCase();

    return initialCourses.filter((course) => {
      const matchesName = normalizedName
        ? course.name.toLowerCase().includes(normalizedName)
        : true;
      const matchesSemester = normalizedSemester
        ? course.semester.toLowerCase().includes(normalizedSemester)
        : true;
      const matchesCode = normalizedCode
        ? course.code.toLowerCase().includes(normalizedCode)
        : true;
      const matchesLecturer = normalizedLecturer
        ? course.lecturer.toLowerCase().includes(normalizedLecturer)
        : true;

      return (
        matchesName &&
        matchesSemester &&
        matchesCode &&
        matchesLecturer
      );
    });
  }, [searchName, searchSemester, searchCode, searchLecturer]);

  const { t } = useLanguage();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col">
      <PageHeader title={t("searchCourses")} buttonText={t("homePage")} to="/home" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {t("searchByField")}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">
                  {t("courseName")}
                </label>
                <SearchBar
                  placeholder={t("courseName")}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">
                  {t("semester")}
                </label>
                <SearchBar
                  placeholder={t("semester")}
                  value={searchSemester}
                  onChange={(e) => setSearchSemester(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">
                  {t("courseCode")}
                </label>
                <SearchBar
                  placeholder={t("courseCode")}
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">
                  {t("lecturer")}
                </label>
                <SearchBar
                  placeholder={t("lecturer")}
                  value={searchLecturer}
                  onChange={(e) => setSearchLecturer(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {t("searchResults")}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {t("showingCourses", {
                    count: filteredCourses.length,
                    total: initialCourses.length,
                  })}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b text-slate-600">
                    <th className="py-3 px-4">שם הקורס</th>
                    <th className="py-3 px-4">סמסטר</th>
                    <th className="py-3 px-4">קוד</th>
                    <th className="py-3 px-4">מרצה</th>
                    <th className="py-3 px-4">נק״ז</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b last:border-b-0 hover:bg-slate-50">
                      <td className="py-3 px-4">{course.name}</td>
                      <td className="py-3 px-4">{course.semester}</td>
                      <td className="py-3 px-4">{course.code}</td>
                      <td className="py-3 px-4">{course.lecturer}</td>
                      <td className="py-3 px-4">{course.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCourses.length === 0 && (
              <p className="mt-4 text-slate-500">{t("noResults")}</p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}