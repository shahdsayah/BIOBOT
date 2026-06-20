// Pre-built academic profiles, auto-assigned to new students at signup.
// Rebuilt from the department's official study program (שנתון תשפ"ה),
// pages 4-7 — the mandatory ("חובה") course list for semesters 1-8.
// Course names, codes (in comments), and credit values are real;
// grades, days/times/rooms are illustrative (the program PDF lists
// weekly contact hours per course, not an actual timetable).
//
// Each template represents a student currently in that year, with
// completedCourses covering everything from prior years/semesters,
// and schedule covering the courses for their current semester.

const academicTemplates = [
  // ===================== Year א (currently semester 1) =====================
  {
    year: "א",
    completedCourses: [], // just starting — nothing completed yet
    schedule: [
      // semester 1 mandatory courses (excluding English placement courses,
      // which depend on a placement test result rather than being fixed)
      { courseName: "אלגברה", day: "ראשון", startTime: "10:00", endTime: "12:00", room: "201" }, // 11001
      { courseName: "כימיה כללית ואנליטית 1", day: "ראשון", startTime: "13:00", endTime: "15:00", room: "305" }, // 41014
      { courseName: "חדו\"א 1", day: "שני", startTime: "09:00", endTime: "11:00", room: "105" }, // 11003
      { courseName: "ביולוגיה של התא", day: "שלישי", startTime: "10:00", endTime: "12:00", room: "112" }, // 41113
      { courseName: "מבוא לפיזיקה אקדמית", day: "רביעי", startTime: "09:00", endTime: "11:00", room: "110" }, // 11179
      { courseName: "מיומנויות יסוד הנדסיות", day: "רביעי", startTime: "11:00", endTime: "13:00", room: "מעבדה 1" }, // 251961
      { courseName: "צוהר להנדסת ביוטכנולוגיה", day: "חמישי", startTime: "10:00", endTime: "11:00", room: "118" }, // 41201
    ],
  },

  // ===================== Year ב (currently semester 3) =====================
  {
    year: "ב",
    completedCourses: [
      // semester 1 (תשפ"ד א)
      { name: "אלגברה", grade: 82, credits: 4.0, semester: "תשפ\"ד א" },
      { name: "חדו\"א 1", grade: 75, credits: 5.0, semester: "תשפ\"ד א" },
      { name: "מבוא לפיזיקה אקדמית", grade: 88, credits: 0, semester: "תשפ\"ד א" },
      { name: "כימיה כללית ואנליטית 1", grade: 79, credits: 3.5, semester: "תשפ\"ד א" },
      { name: "ביולוגיה של התא", grade: 91, credits: 4.0, semester: "תשפ\"ד א" },
      { name: "צוהר להנדסת ביוטכנולוגיה", grade: 95, credits: 1.5, semester: "תשפ\"ד א" },
      { name: "מיומנויות יסוד הנדסיות", grade: 90, credits: 1.0, semester: "תשפ\"ד א" },
      // semester 2 (תשפ"ד ב)
      { name: "חדו\"א 2", grade: 70, credits: 5.0, semester: "תשפ\"ד ב" },
      { name: "פיזיקה 1ב", grade: 73, credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "מעבדה בכימיה כללית ואנליטית", grade: 85, credits: 1.0, semester: "תשפ\"ד ב" },
      { name: "כימיה כללית ואנליטית 2", grade: 80, credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "כימיה אורגנית 1", grade: 77, credits: 2.5, semester: "תשפ\"ד ב" },
      { name: "תכנות הנדסי ואלגוריתמיקה", grade: 93, credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "מבוא להסתברות וסטטיסטיקה", grade: 84, credits: 2.5, semester: "תשפ\"ד ב" },
    ],
    schedule: [
      // semester 3 mandatory courses
      { courseName: "משוואות דיפרנציאליות ב", day: "ראשון", startTime: "10:00", endTime: "12:00", room: "201" }, // 11136
      { courseName: "ביוכימיה", day: "ראשון", startTime: "13:00", endTime: "15:00", room: "305" }, // 41305
      { courseName: "תרמודינמיקה וקינטיקה ב", day: "שני", startTime: "09:00", endTime: "11:00", room: "112" }, // 41041
      { courseName: "מיקרוביולוגיה", day: "שלישי", startTime: "10:00", endTime: "12:00", room: "220" }, // 41231
      { courseName: "מעבדות מיקרוביולוגיה", day: "שלישי", startTime: "13:00", endTime: "16:00", room: "מעבדה 2" }, // 41232
      { courseName: "כימיה אורגנית 2", day: "רביעי", startTime: "09:00", endTime: "11:00", room: "110" }, // 41060
      { courseName: "כימיה אורגנית - מעבדה", day: "רביעי", startTime: "11:00", endTime: "13:00", room: "מעבדה 3" }, // 41064
      { courseName: "מאזן חומר ואנרגיה", day: "חמישי", startTime: "10:00", endTime: "12:00", room: "118" }, // 41411
    ],
  },

  // ===================== Year ג (currently semester 5) =====================
  {
    year: "ג",
    completedCourses: [
      // year 1 (תשפ"ג)
      { name: "אלגברה", grade: 82, credits: 4.0, semester: "תשפ\"ג א" },
      { name: "חדו\"א 1", grade: 75, credits: 5.0, semester: "תשפ\"ג א" },
      { name: "מבוא לפיזיקה אקדמית", grade: 88, credits: 0, semester: "תשפ\"ג א" },
      { name: "כימיה כללית ואנליטית 1", grade: 79, credits: 3.5, semester: "תשפ\"ג א" },
      { name: "ביולוגיה של התא", grade: 91, credits: 4.0, semester: "תשפ\"ג א" },
      { name: "צוהר להנדסת ביוטכנולוגיה", grade: 95, credits: 1.5, semester: "תשפ\"ג א" },
      { name: "מיומנויות יסוד הנדסיות", grade: 90, credits: 1.0, semester: "תשפ\"ג א" },
      { name: "חדו\"א 2", grade: 70, credits: 5.0, semester: "תשפ\"ג ב" },
      { name: "פיזיקה 1ב", grade: 73, credits: 3.0, semester: "תשפ\"ג ב" },
      { name: "מעבדה בכימיה כללית ואנליטית", grade: 85, credits: 1.0, semester: "תשפ\"ג ב" },
      { name: "כימיה כללית ואנליטית 2", grade: 80, credits: 3.0, semester: "תשפ\"ג ב" },
      { name: "כימיה אורגנית 1", grade: 77, credits: 2.5, semester: "תשפ\"ג ב" },
      { name: "תכנות הנדסי ואלגוריתמיקה", grade: 93, credits: 3.0, semester: "תשפ\"ג ב" },
      { name: "מבוא להסתברות וסטטיסטיקה", grade: 84, credits: 2.5, semester: "תשפ\"ג ב" },
      // year 2 (תשפ"ד)
      { name: "משוואות דיפרנציאליות ב", grade: 71, credits: 4.0, semester: "תשפ\"ד א" },
      { name: "תרמודינמיקה וקינטיקה ב", grade: 76, credits: 3.0, semester: "תשפ\"ד א" },
      { name: "כימיה אורגנית 2", grade: 81, credits: 2.5, semester: "תשפ\"ד א" },
      { name: "כימיה אורגנית - מעבדה", grade: 89, credits: 1.0, semester: "תשפ\"ד א" },
      { name: "מיקרוביולוגיה", grade: 86, credits: 3.5, semester: "תשפ\"ד א" },
      { name: "מעבדות מיקרוביולוגיה", grade: 92, credits: 0.75, semester: "תשפ\"ד א" },
      { name: "ביוכימיה", grade: 78, credits: 3.5, semester: "תשפ\"ד א" },
      { name: "מאזן חומר ואנרגיה", grade: 83, credits: 3.0, semester: "תשפ\"ד א" },
      { name: "פיזיקה 2ב", grade: 74, credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "מעבדה בביולוגיה מולקולרית", grade: 87, credits: 1.0, semester: "תשפ\"ד ב" },
      { name: "ביולוגיה מולקולרית והנדסה גנטית", grade: 80, credits: 4.5, semester: "תשפ\"ד ב" },
      { name: "מטבוליזם ואנזימולוגיה", grade: 85, credits: 3.5, semester: "תשפ\"ד ב" },
      { name: "מעבדה בביוכימיה", grade: 91, credits: 1.5, semester: "תשפ\"ד ב" },
      { name: "מכניקת זורמים", grade: 72, credits: 4.0, semester: "תשפ\"ד ב" },
      { name: "מודלים סטטיסטיים לביוטכנולוגיה", grade: 88, credits: 1.5, semester: "תשפ\"ד ב" },
    ],
    schedule: [
      // semester 5 mandatory courses
      { courseName: "אימונולוגיה", day: "ראשון", startTime: "10:00", endTime: "12:00", room: "305" }, // 41181
      { courseName: "הנדסת ביוראקטורים", day: "ראשון", startTime: "13:00", endTime: "15:00", room: "201" }, // 41506
      { courseName: "עקרונות מעבר חום", day: "שני", startTime: "09:00", endTime: "11:00", room: "112" }, // 41412
      { courseName: "תהליכי הפרדה 1", day: "שלישי", startTime: "10:00", endTime: "12:00", room: "220" }, // 41560
      { courseName: "מעבדה בתהליכי הפרדה 1", day: "שלישי", startTime: "13:00", endTime: "16:00", room: "מעבדה 2" }, // 41562
      { courseName: "מעבדה באימונולוגיה", day: "רביעי", startTime: "09:00", endTime: "10:00", room: "מעבדה 4" }, // 41182
      { courseName: "מעבדה בפעולות יסוד בהנדסה כימית", day: "רביעי", startTime: "10:00", endTime: "12:00", room: "מעבדה 1" }, // 41443
      { courseName: "מעבדה בביוראקטורים", day: "חמישי", startTime: "10:00", endTime: "13:00", room: "מעבדה 3" }, // 41507
    ],
  },

  // ===================== Year ד (currently semester 7) =====================
  {
    year: "ד",
    completedCourses: [
      // year 1 (תשפ"ב)
      { name: "אלגברה", grade: 82, credits: 4.0, semester: "תשפ\"ב א" },
      { name: "חדו\"א 1", grade: 75, credits: 5.0, semester: "תשפ\"ב א" },
      { name: "מבוא לפיזיקה אקדמית", grade: 88, credits: 0, semester: "תשפ\"ב א" },
      { name: "כימיה כללית ואנליטית 1", grade: 79, credits: 3.5, semester: "תשפ\"ב א" },
      { name: "ביולוגיה של התא", grade: 91, credits: 4.0, semester: "תשפ\"ב א" },
      { name: "צוהר להנדסת ביוטכנולוגיה", grade: 95, credits: 1.5, semester: "תשפ\"ב א" },
      { name: "מיומנויות יסוד הנדסיות", grade: 90, credits: 1.0, semester: "תשפ\"ב א" },
      { name: "חדו\"א 2", grade: 70, credits: 5.0, semester: "תשפ\"ב ב" },
      { name: "פיזיקה 1ב", grade: 73, credits: 3.0, semester: "תשפ\"ב ב" },
      { name: "מעבדה בכימיה כללית ואנליטית", grade: 85, credits: 1.0, semester: "תשפ\"ב ב" },
      { name: "כימיה כללית ואנליטית 2", grade: 80, credits: 3.0, semester: "תשפ\"ב ב" },
      { name: "כימיה אורגנית 1", grade: 77, credits: 2.5, semester: "תשפ\"ב ב" },
      { name: "תכנות הנדסי ואלגוריתמיקה", grade: 93, credits: 3.0, semester: "תשפ\"ב ב" },
      { name: "מבוא להסתברות וסטטיסטיקה", grade: 84, credits: 2.5, semester: "תשפ\"ב ב" },
      // year 2 (תשפ"ג)
      { name: "משוואות דיפרנציאליות ב", grade: 71, credits: 4.0, semester: "תשפ\"ג א" },
      { name: "תרמודינמיקה וקינטיקה ב", grade: 76, credits: 3.0, semester: "תשפ\"ג א" },
      { name: "כימיה אורגנית 2", grade: 81, credits: 2.5, semester: "תשפ\"ג א" },
      { name: "כימיה אורגנית - מעבדה", grade: 89, credits: 1.0, semester: "תשפ\"ג א" },
      { name: "מיקרוביולוגיה", grade: 86, credits: 3.5, semester: "תשפ\"ג א" },
      { name: "מעבדות מיקרוביולוגיה", grade: 92, credits: 0.75, semester: "תשפ\"ג א" },
      { name: "ביוכימיה", grade: 78, credits: 3.5, semester: "תשפ\"ג א" },
      { name: "מאזן חומר ואנרגיה", grade: 83, credits: 3.0, semester: "תשפ\"ג א" },
      { name: "פיזיקה 2ב", grade: 74, credits: 3.0, semester: "תשפ\"ג ב" },
      { name: "מעבדה בביולוגיה מולקולרית", grade: 87, credits: 1.0, semester: "תשפ\"ג ב" },
      { name: "ביולוגיה מולקולרית והנדסה גנטית", grade: 80, credits: 4.5, semester: "תשפ\"ג ב" },
      { name: "מטבוליזם ואנזימולוגיה", grade: 85, credits: 3.5, semester: "תשפ\"ג ב" },
      { name: "מעבדה בביוכימיה", grade: 91, credits: 1.5, semester: "תשפ\"ג ב" },
      { name: "מכניקת זורמים", grade: 72, credits: 4.0, semester: "תשפ\"ג ב" },
      { name: "מודלים סטטיסטיים לביוטכנולוגיה", grade: 88, credits: 1.5, semester: "תשפ\"ג ב" },
      // year 3 (תשפ"ד)
      { name: "אימונולוגיה", grade: 84, credits: 2.0, semester: "תשפ\"ד א" },
      { name: "מעבדה באימונולוגיה", grade: 93, credits: 0.5, semester: "תשפ\"ד א" },
      { name: "עקרונות מעבר חום", grade: 76, credits: 4.0, semester: "תשפ\"ד א" },
      { name: "מעבדה בפעולות יסוד בהנדסה כימית", grade: 90, credits: 1.0, semester: "תשפ\"ד א" },
      { name: "הנדסת ביוראקטורים", grade: 81, credits: 3.0, semester: "תשפ\"ד א" },
      { name: "מעבדה בביוראקטורים", grade: 88, credits: 1.0, semester: "תשפ\"ד א" },
      { name: "תהליכי הפרדה 1", grade: 79, credits: 2.5, semester: "תשפ\"ד א" },
      { name: "מעבדה בתהליכי הפרדה 1", grade: 92, credits: 0.75, semester: "תשפ\"ד א" },
      { name: "פיזיקה 3ב", grade: 75, credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "ביואינפורמטיקה ובינה מלאכותית", grade: 90, credits: 2.0, semester: "תשפ\"ד ב" },
      { name: "מעבר מסה", grade: 77, credits: 2.5, semester: "תשפ\"ד ב" },
      { name: "תהליכי הפרדה 2", grade: 82, credits: 2.5, semester: "תשפ\"ד ב" },
      { name: "דיאגנוסטיקה", grade: 86, credits: 2.0, semester: "תשפ\"ד ב" },
      { name: "מעבדה בשיטות הפרדה ודיאגנוסטיקה", grade: 94, credits: 1.5, semester: "תשפ\"ד ב" },
      { name: "הבטחת איכות לביוטכנולוגיה", grade: 89, credits: 2.0, semester: "תשפ\"ד ב" },
    ],
    schedule: [
      // semester 7 mandatory courses
      { courseName: "מבוא לבקרה לביוטכנולוגיה", day: "ראשון", startTime: "10:00", endTime: "12:00", room: "201" }, // 21312
      { courseName: "קינטיקה ותכנון ריאקטורים כימיים וביולוגיים", day: "שני", startTime: "09:00", endTime: "11:00", room: "112" }, // 41526
      { courseName: "פרויקט בביו-הנדסה", day: "שלישי", startTime: "10:00", endTime: "13:00", room: "מעבדה 5" }, // 41470
      { courseName: "מעבדה בהנדסה תהליכית-ביוטכנולוגית (פיילוט)", day: "רביעי", startTime: "09:00", endTime: "12:00", room: "מעבדה 2" }, // 41525
      { courseName: "כתיבה מדעית ושימוש במאגרי מידע בביו-טכנולוגיה", day: "חמישי", startTime: "10:00", endTime: "11:00", room: "118" }, // 41711
      { courseName: "דרישות רגולטוריות ו-GMP בביוטכנולוגיה", day: "חמישי", startTime: "11:00", endTime: "12:00", room: "118" }, // 41730
    ],
  },
];

module.exports = academicTemplates;