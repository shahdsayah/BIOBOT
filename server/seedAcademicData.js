
require("dotenv").config();

const mongoose = require("mongoose");

const Course = require("./models/CourseSchema");
const User = require("./models/UserSchema");
const academicTemplates = require("./data/academicTemplates");

// EDIT THIS to match the email of the student account you want to demo with
// (must already exist — sign up that account first if it doesn't)
const DEMO_STUDENT_EMAIL = "shahd@test.com";

// Real mandatory ("חובה") course catalog for Biotechnology Engineering,
// read directly from the department's official study program
// (שנתון תשפ"ה, pages 4-7). Credits (נ"ז) match the official table.
const courses = [
  // Semester 1 — year 1
  { name: "אלגברה", credits: 4.0, mandatory: true, semester: "א", yearOfStudy: 1 },
  { name: "חדו\"א 1", credits: 5.0, mandatory: true, semester: "א", yearOfStudy: 1 },
  { name: "מבוא לפיזיקה אקדמית", credits: 0, mandatory: true, semester: "א", yearOfStudy: 1 },
  { name: "כימיה כללית ואנליטית 1", credits: 3.5, mandatory: true, semester: "א", yearOfStudy: 1 },
  { name: "ביולוגיה של התא", credits: 4.0, mandatory: true, semester: "א", yearOfStudy: 1 },
  { name: "צוהר להנדסת ביוטכנולוגיה", credits: 1.5, mandatory: true, semester: "א", yearOfStudy: 1 },
  { name: "מיומנויות יסוד הנדסיות", credits: 1.0, mandatory: true, semester: "א", yearOfStudy: 1 },

  // Semester 2 — year 1
  { name: "חדו\"א 2", credits: 5.0, mandatory: true, semester: "ב", yearOfStudy: 1 },
  { name: "פיזיקה 1ב", credits: 3.0, mandatory: true, semester: "ב", yearOfStudy: 1 },
  { name: "מעבדה בכימיה כללית ואנליטית", credits: 1.0, mandatory: true, semester: "ב", yearOfStudy: 1 },
  { name: "כימיה כללית ואנליטית 2", credits: 3.0, mandatory: true, semester: "ב", yearOfStudy: 1 },
  { name: "כימיה אורגנית 1", credits: 2.5, mandatory: true, semester: "ב", yearOfStudy: 1 },
  { name: "תכנות הנדסי ואלגוריתמיקה", credits: 3.0, mandatory: true, semester: "ב", yearOfStudy: 1 },
  { name: "מבוא להסתברות וסטטיסטיקה", credits: 2.5, mandatory: true, semester: "ב", yearOfStudy: 1 },

  // Semester 3 — year 2
  { name: "משוואות דיפרנציאליות ב", credits: 4.0, mandatory: true, semester: "א", yearOfStudy: 2 },
  { name: "תרמודינמיקה וקינטיקה ב", credits: 3.0, mandatory: true, semester: "א", yearOfStudy: 2 },
  { name: "כימיה אורגנית 2", credits: 2.5, mandatory: true, semester: "א", yearOfStudy: 2 },
  { name: "כימיה אורגנית - מעבדה", credits: 1.0, mandatory: true, semester: "א", yearOfStudy: 2 },
  { name: "מיקרוביולוגיה", credits: 3.5, mandatory: true, semester: "א", yearOfStudy: 2 },
  { name: "מעבדות מיקרוביולוגיה", credits: 0.75, mandatory: true, semester: "א", yearOfStudy: 2 },
  { name: "ביוכימיה", credits: 3.5, mandatory: true, semester: "א", yearOfStudy: 2 },
  { name: "מאזן חומר ואנרגיה", credits: 3.0, mandatory: true, semester: "א", yearOfStudy: 2 },

  // Semester 4 — year 2
  { name: "פיזיקה 2ב", credits: 3.0, mandatory: true, semester: "ב", yearOfStudy: 2 },
  { name: "מעבדה בביולוגיה מולקולרית", credits: 1.0, mandatory: true, semester: "ב", yearOfStudy: 2 },
  { name: "ביולוגיה מולקולרית והנדסה גנטית", credits: 4.5, mandatory: true, semester: "ב", yearOfStudy: 2 },
  { name: "מטבוליזם ואנזימולוגיה", credits: 3.5, mandatory: true, semester: "ב", yearOfStudy: 2 },
  { name: "מעבדה בביוכימיה", credits: 1.5, mandatory: true, semester: "ב", yearOfStudy: 2 },
  { name: "מכניקת זורמים", credits: 4.0, mandatory: true, semester: "ב", yearOfStudy: 2 },
  { name: "מודלים סטטיסטיים לביוטכנולוגיה", credits: 1.5, mandatory: true, semester: "ב", yearOfStudy: 2 },

  // Semester 5 — year 3
  { name: "אימונולוגיה", credits: 2.0, mandatory: true, semester: "א", yearOfStudy: 3 },
  { name: "מעבדה באימונולוגיה", credits: 0.5, mandatory: true, semester: "א", yearOfStudy: 3 },
  { name: "עקרונות מעבר חום", credits: 4.0, mandatory: true, semester: "א", yearOfStudy: 3 },
  { name: "מעבדה בפעולות יסוד בהנדסה כימית", credits: 1.0, mandatory: true, semester: "א", yearOfStudy: 3 },
  { name: "הנדסת ביוראקטורים", credits: 3.0, mandatory: true, semester: "א", yearOfStudy: 3 },
  { name: "מעבדה בביוראקטורים", credits: 1.0, mandatory: true, semester: "א", yearOfStudy: 3 },
  { name: "תהליכי הפרדה 1", credits: 2.5, mandatory: true, semester: "א", yearOfStudy: 3 },
  { name: "מעבדה בתהליכי הפרדה 1", credits: 0.75, mandatory: true, semester: "א", yearOfStudy: 3 },

  // Semester 6 — year 3
  { name: "פיזיקה 3ב", credits: 3.0, mandatory: true, semester: "ב", yearOfStudy: 3 },
  { name: "ביואינפורמטיקה ובינה מלאכותית", credits: 2.0, mandatory: true, semester: "ב", yearOfStudy: 3 },
  { name: "מעבר מסה", credits: 2.5, mandatory: true, semester: "ב", yearOfStudy: 3 },
  { name: "תהליכי הפרדה 2", credits: 2.5, mandatory: true, semester: "ב", yearOfStudy: 3 },
  { name: "דיאגנוסטיקה", credits: 2.0, mandatory: true, semester: "ב", yearOfStudy: 3 },
  { name: "מעבדה בשיטות הפרדה ודיאגנוסטיקה", credits: 1.5, mandatory: true, semester: "ב", yearOfStudy: 3 },
  { name: "הבטחת איכות לביוטכנולוגיה", credits: 2.0, mandatory: true, semester: "ב", yearOfStudy: 3 },

  // Semester 7 — year 4
  { name: "מבוא לבקרה לביוטכנולוגיה", credits: 2.5, mandatory: true, semester: "א", yearOfStudy: 4 },
  { name: "פרויקט בביו-הנדסה", credits: 1.5, mandatory: true, semester: "א", yearOfStudy: 4 },
  { name: "קינטיקה ותכנון ריאקטורים כימיים וביולוגיים", credits: 2.0, mandatory: true, semester: "א", yearOfStudy: 4 },
  { name: "מעבדה בהנדסה תהליכית-ביוטכנולוגית (פיילוט)", credits: 3.0, mandatory: true, semester: "א", yearOfStudy: 4 },
  { name: "כתיבה מדעית ושימוש במאגרי מידע בביו-טכנולוגיה", credits: 0.5, mandatory: true, semester: "א", yearOfStudy: 4 },
  { name: "דרישות רגולטוריות ו-GMP בביוטכנולוגיה", credits: 1.0, mandatory: true, semester: "א", yearOfStudy: 4 },

  // Semester 8 — year 4 (final practicum)
  { name: "התמחות בתעשייה ובאקדמיה (סטאז')", credits: 16.0, mandatory: true, semester: "שנתי", yearOfStudy: 4 },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI is missing from .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Upsert by name so re-running this script is always safe
    for (const course of courses) {
      await Course.findOneAndUpdate({ name: course.name }, course, {
        upsert: true,
        new: true,
      });
    }
    console.log(`Seeded ${courses.length} courses into the catalog`);

    // Reuse the year-ג template from academicTemplates.js as the single
    // source of truth, instead of duplicating schedule/completedCourses
    // data in two places.
    const demoTemplate = academicTemplates.find((t) => t.year === "ג");

    const student = await User.findOneAndUpdate(
      { email: DEMO_STUDENT_EMAIL },
      {
        $set: {
          year: demoTemplate.year,
          schedule: demoTemplate.schedule,
          completedCourses: demoTemplate.completedCourses,
        },
      },
      { new: true }
    );

    if (!student) {
      console.log(
        `No user found with email "${DEMO_STUDENT_EMAIL}". Sign up that account first, or edit DEMO_STUDENT_EMAIL at the top of this file.`
      );
    } else {
      console.log(
        `Updated schedule + completedCourses for ${student.firstName} ${student.lastName}`
      );
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log("Seed error:");
    console.log(error.message);
    process.exit(1);
  }
}

seed();