// Pre-built academic profiles, auto-assigned to new students at signup
// (and used by the bulk seed script to backfill existing accounts).
// Course names, codes (in comments), credits, and semester placement
// are real — read from the department's official study program
// (שנתון תשפ"ה, pages 4-7, mandatory course tables for semesters 1-8).
//
// Grades are intentionally NOT stored here — they're generated with
// randomGrade() at the point each template gets assigned to an actual
// student, so two students on the same template don't end up with
// identical-looking transcripts. See randomGrade.js.
//
// Day/time/room in `schedule` are illustrative — the program PDF lists
// weekly contact hours per course, not an actual timetable.

const academicTemplates = [
  // ===================== Year א (currently semester 1) =====================
  {
    year: "א",
    completedCourses: [], // just starting — nothing completed yet
    schedule: [
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
      { name: "אלגברה", credits: 4.0, semester: "תשפ\"ד א" },
      { name: "חדו\"א 1", credits: 5.0, semester: "תשפ\"ד א" },
      { name: "מבוא לפיזיקה אקדמית", credits: 0, semester: "תשפ\"ד א" },
      { name: "כימיה כללית ואנליטית 1", credits: 3.5, semester: "תשפ\"ד א" },
      { name: "ביולוגיה של התא", credits: 4.0, semester: "תשפ\"ד א" },
      { name: "צוהר להנדסת ביוטכנולוגיה", credits: 1.5, semester: "תשפ\"ד א" },
      { name: "מיומנויות יסוד הנדסיות", credits: 1.0, semester: "תשפ\"ד א" },
      // semester 2 (תשפ"ד ב)
      { name: "חדו\"א 2", credits: 5.0, semester: "תשפ\"ד ב" },
      { name: "פיזיקה 1ב", credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "מעבדה בכימיה כללית ואנליטית", credits: 1.0, semester: "תשפ\"ד ב" },
      { name: "כימיה כללית ואנליטית 2", credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "כימיה אורגנית 1", credits: 2.5, semester: "תשפ\"ד ב" },
      { name: "תכנות הנדסי ואלגוריתמיקה", credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "מבוא להסתברות וסטטיסטיקה", credits: 2.5, semester: "תשפ\"ד ב" },
    ],
    schedule: [
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
      // year 1 
      { name: "אלגברה", credits: 4.0, semester: "תשפ\"ג א" },
      { name: "חדו\"א 1", credits: 5.0, semester: "תשפ\"ג א" },
      { name: "מבוא לפיזיקה אקדמית", credits: 0, semester: "תשפ\"ג א" },
      { name: "כימיה כללית ואנליטית 1", credits: 3.5, semester: "תשפ\"ג א" },
      { name: "ביולוגיה של התא", credits: 4.0, semester: "תשפ\"ג א" },
      { name: "צוהר להנדסת ביוטכנולוגיה", credits: 1.5, semester: "תשפ\"ג א" },
      { name: "מיומנויות יסוד הנדסיות", credits: 1.0, semester: "תשפ\"ג א" },
      { name: "חדו\"א 2", credits: 5.0, semester: "תשפ\"ג ב" },
      { name: "פיזיקה 1ב", credits: 3.0, semester: "תשפ\"ג ב" },
      { name: "מעבדה בכימיה כללית ואנליטית", credits: 1.0, semester: "תשפ\"ג ב" },
      { name: "כימיה כללית ואנליטית 2", credits: 3.0, semester: "תשפ\"ג ב" },
      { name: "כימיה אורגנית 1", credits: 2.5, semester: "תשפ\"ג ב" },
      { name: "תכנות הנדסי ואלגוריתמיקה", credits: 3.0, semester: "תשפ\"ג ב" },
      { name: "מבוא להסתברות וסטטיסטיקה", credits: 2.5, semester: "תשפ\"ג ב" },
      // year 2
      { name: "משוואות דיפרנציאליות ב", credits: 4.0, semester: "תשפ\"ד א" },
      { name: "תרמודינמיקה וקינטיקה ב", credits: 3.0, semester: "תשפ\"ד א" },
      { name: "כימיה אורגנית 2", credits: 2.5, semester: "תשפ\"ד א" },
      { name: "כימיה אורגנית - מעבדה", credits: 1.0, semester: "תשפ\"ד א" },
      { name: "מיקרוביולוגיה", credits: 3.5, semester: "תשפ\"ד א" },
      { name: "מעבדות מיקרוביולוגיה", credits: 0.75, semester: "תשפ\"ד א" },
      { name: "ביוכימיה", credits: 3.5, semester: "תשפ\"ד א" },
      { name: "מאזן חומר ואנרגיה", credits: 3.0, semester: "תשפ\"ד א" },
      { name: "פיזיקה 2ב", credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "מעבדה בביולוגיה מולקולרית", credits: 1.0, semester: "תשפ\"ד ב" },
      { name: "ביולוגיה מולקולרית והנדסה גנטית", credits: 4.5, semester: "תשפ\"ד ב" },
      { name: "מטבוליזם ואנזימולוגיה", credits: 3.5, semester: "תשפ\"ד ב" },
      { name: "מעבדה בביוכימיה", credits: 1.5, semester: "תשפ\"ד ב" },
      { name: "מכניקת זורמים", credits: 4.0, semester: "תשפ\"ד ב" },
      { name: "מודלים סטטיסטיים לביוטכנולוגיה", credits: 1.5, semester: "תשפ\"ד ב" },
    ],
    schedule: [
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
      // year 1 
      { name: "אלגברה", credits: 4.0, semester: "תשפ\"ב א" },
      { name: "חדו\"א 1", credits: 5.0, semester: "תשפ\"ב א" },
      { name: "מבוא לפיזיקה אקדמית", credits: 0, semester: "תשפ\"ב א" },
      { name: "כימיה כללית ואנליטית 1", credits: 3.5, semester: "תשפ\"ב א" },
      { name: "ביולוגיה של התא", credits: 4.0, semester: "תשפ\"ב א" },
      { name: "צוהר להנדסת ביוטכנולוגיה", credits: 1.5, semester: "תשפ\"ב א" },
      { name: "מיומנויות יסוד הנדסיות", credits: 1.0, semester: "תשפ\"ב א" },
      { name: "חדו\"א 2", credits: 5.0, semester: "תשפ\"ב ב" },
      { name: "פיזיקה 1ב", credits: 3.0, semester: "תשפ\"ב ב" },
      { name: "מעבדה בכימיה כללית ואנליטית", credits: 1.0, semester: "תשפ\"ב ב" },
      { name: "כימיה כללית ואנליטית 2", credits: 3.0, semester: "תשפ\"ב ב" },
      { name: "כימיה אורגנית 1", credits: 2.5, semester: "תשפ\"ב ב" },
      { name: "תכנות הנדסי ואלגוריתמיקה", credits: 3.0, semester: "תשפ\"ב ב" },
      { name: "מבוא להסתברות וסטטיסטיקה", credits: 2.5, semester: "תשפ\"ב ב" },
      // year 2 
      { name: "משוואות דיפרנציאליות ב", credits: 4.0, semester: "תשפ\"ג א" },
      { name: "תרמודינמיקה וקינטיקה ב", credits: 3.0, semester: "תשפ\"ג א" },
      { name: "כימיה אורגנית 2", credits: 2.5, semester: "תשפ\"ג א" },
      { name: "כימיה אורגנית - מעבדה", credits: 1.0, semester: "תשפ\"ג א" },
      { name: "מיקרוביולוגיה", credits: 3.5, semester: "תשפ\"ג א" },
      { name: "מעבדות מיקרוביולוגיה", credits: 0.75, semester: "תשפ\"ג א" },
      { name: "ביוכימיה", credits: 3.5, semester: "תשפ\"ג א" },
      { name: "מאזן חומר ואנרגיה", credits: 3.0, semester: "תשפ\"ג א" },
      { name: "פיזיקה 2ב", credits: 3.0, semester: "תשפ\"ג ב" },
      { name: "מעבדה בביולוגיה מולקולרית", credits: 1.0, semester: "תשפ\"ג ב" },
      { name: "ביולוגיה מולקולרית והנדסה גנטית", credits: 4.5, semester: "תשפ\"ג ב" },
      { name: "מטבוליזם ואנזימולוגיה", credits: 3.5, semester: "תשפ\"ג ב" },
      { name: "מעבדה בביוכימיה", credits: 1.5, semester: "תשפ\"ג ב" },
      { name: "מכניקת זורמים", credits: 4.0, semester: "תשפ\"ג ב" },
      { name: "מודלים סטטיסטיים לביוטכנולוגיה", credits: 1.5, semester: "תשפ\"ג ב" },
      // year 3 
      { name: "אימונולוגיה", credits: 2.0, semester: "תשפ\"ד א" },
      { name: "מעבדה באימונולוגיה", credits: 0.5, semester: "תשפ\"ד א" },
      { name: "עקרונות מעבר חום", credits: 4.0, semester: "תשפ\"ד א" },
      { name: "מעבדה בפעולות יסוד בהנדסה כימית", credits: 1.0, semester: "תשפ\"ד א" },
      { name: "הנדסת ביוראקטורים", credits: 3.0, semester: "תשפ\"ד א" },
      { name: "מעבדה בביוראקטורים", credits: 1.0, semester: "תשפ\"ד א" },
      { name: "תהליכי הפרדה 1", credits: 2.5, semester: "תשפ\"ד א" },
      { name: "מעבדה בתהליכי הפרדה 1", credits: 0.75, semester: "תשפ\"ד א" },
      { name: "פיזיקה 3ב", credits: 3.0, semester: "תשפ\"ד ב" },
      { name: "ביואינפורמטיקה ובינה מלאכותית", credits: 2.0, semester: "תשפ\"ד ב" },
      { name: "מעבר מסה", credits: 2.5, semester: "תשפ\"ד ב" },
      { name: "תהליכי הפרדה 2", credits: 2.5, semester: "תשפ\"ד ב" },
      { name: "דיאגנוסטיקה", credits: 2.0, semester: "תשפ\"ד ב" },
      { name: "מעבדה בשיטות הפרדה ודיאגנוסטיקה", credits: 1.5, semester: "תשפ\"ד ב" },
      { name: "הבטחת איכות לביוטכנולוגיה", credits: 2.0, semester: "תשפ\"ד ב" },
    ],
    schedule: [
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