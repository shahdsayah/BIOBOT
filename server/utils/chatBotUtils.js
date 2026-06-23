const { normalizeHebrewText } = require("./hebrewTextUtils");

const TOTAL_DEGREE_CREDITS = 165;

function detectIntent(message = "") {
  const text = normalizeHebrewText(message);

  if (
    text.includes("מצב אקדמי") ||
    text.includes("מצב קדמי") ||
    text.includes("תקין") ||
    text.includes("על תנאי")
  ) {
    return "academic_status";
  }

  if (
    text.includes("ממוצע") ||
    text.includes("ציונ") ||
    text.includes("ממוצע ציונ")
  ) {
    return "average";
  }

  if (
    text.includes("נקודות זכות") ||
    text.includes("נקז") ||
    text.includes("נז") ||
    text.includes("כמה נשאר") ||
    text.includes("לסיום התואר")
  ) {
    return "credits";
  }

  if (
    text.includes("טופס") ||
    text.includes("טפס") ||
    text.includes("מסמך") ||
    text.includes("בקשה")
  ) {
    return "forms";
  }

  if (
    text.includes("ערעור") ||
    text.includes("בחינה") ||
    text.includes("מבחן") ||
    text.includes("מועד")
  ) {
    return "exam_procedure";
  }

  if (
    text.includes("יועץ") ||
    text.includes("למי לפנות") ||
    text.includes("עם מי לדבר") ||
    text.includes("מזכירות") ||
    text.includes("דקנט")
  ) {
    return "contact_advisor";
  }

  return "general";
}

function getCompletedCourses(user = {}) {
  return Array.isArray(user.completedCourses) ? user.completedCourses : [];
}

function calculateAverage(user = {}) {
  const courses = getCompletedCourses(user).filter(
    (course) =>
      typeof course.grade === "number" &&
      typeof course.credits === "number" &&
      course.credits > 0
  );

  const totalCredits = courses.reduce(
    (sum, course) => sum + course.credits,
    0
  );

  if (totalCredits === 0) return 0;

  const weightedSum = courses.reduce(
    (sum, course) => sum + course.grade * course.credits,
    0
  );

  return Number((weightedSum / totalCredits).toFixed(1));
}

function calculateCompletedCredits(user = {}) {
  const courses = getCompletedCourses(user);

  return courses
    .filter((course) => course.grade >= 60)
    .reduce((sum, course) => sum + (course.credits || 0), 0);
}

function calculateRemainingCredits(user = {}) {
  const completedCredits = calculateCompletedCredits(user);
  const remaining = TOTAL_DEGREE_CREDITS - completedCredits;

  return remaining > 0 ? Number(remaining.toFixed(1)) : 0;
}

function getFailedCourses(user = {}) {
  return getCompletedCourses(user).filter(
    (course) => typeof course.grade === "number" && course.grade < 60
  );
}

function calculateAcademicStatus(user = {}) {
  const average = calculateAverage(user);
  const completedCredits = calculateCompletedCredits(user);
  const remainingCredits = calculateRemainingCredits(user);
  const failedCourses = getFailedCourses(user);

  if (getCompletedCourses(user).length === 0) {
    return {
      status: "לא ניתן לקבוע מצב אקדמי",
      average,
      completedCredits,
      remainingCredits,
      failedCourses,
      explanation:
        "לא נמצאו מספיק נתוני קורסים וציונים עבור הסטודנט במאגר המידע.",
      source:
        "מקור: נתוני הסטודנט במערכת BIOBOT + כללי מצב אקדמי במאגר הנהלים.",
    };
  }

  if (average >= 65 && failedCourses.length === 0) {
    return {
      status: "מצב אקדמי תקין",
      average,
      completedCredits,
      remainingCredits,
      failedCourses,
      explanation:
        "הממוצע המצטבר הוא 65 ומעלה ואין קורסים שנכשלו, לכן המצב האקדמי מוגדר כתקין.",
      source:
        "מקור: נתוני הסטודנט במערכת BIOBOT + כללי מצב אקדמי במאגר הנהלים.",
    };
  }

  if (average >= 60 && average < 65) {
    return {
      status: "מצב אקדמי בהתראה",
      average,
      completedCredits,
      remainingCredits,
      failedCourses,
      explanation:
        "הממוצע המצטבר נמצא בין 60 ל־64.99, ולכן הסטודנט נמצא במצב אקדמי בהתראה.",
      source:
        "מקור: נתוני הסטודנט במערכת BIOBOT + כללי מצב אקדמי במאגר הנהלים.",
    };
  }

  return {
    status: "מצב אקדמי לא תקין / על תנאי",
    average,
    completedCredits,
    remainingCredits,
    failedCourses,
    explanation:
      "הממוצע נמוך מ־60 או שקיימים קורסים שנכשלו. מומלץ לפנות ליועץ אקדמי לפני רישום לקורסים.",
    source:
      "מקור: נתוני הסטודנט במערכת BIOBOT + כללי מצב אקדמי במאגר הנהלים.",
  };
}

function buildAcademicStatusAnswer(user = {}) {
  const result = calculateAcademicStatus(user);

  const failedText =
    result.failedCourses.length > 0
      ? result.failedCourses
          .map((course) => `- ${course.name}: ${course.grade}`)
          .join("\n")
      : "אין קורסים שנכשלו.";

  return `
המצב האקדמי שלך: ${result.status}

ממוצע ציונים: ${result.average}
נקודות זכות שהושלמו: ${result.completedCredits}
נקודות זכות שנותרו לסיום התואר: ${result.remainingCredits}

קורסים שנכשלו:
${failedText}

הסבר:
${result.explanation}

${result.source}
`;
}

function buildAverageAnswer(user = {}) {
  const average = calculateAverage(user);

  return `
ממוצע הציונים שלך הוא: ${average}

החישוב מבוסס על הקורסים שהושלמו ועל נקודות הזכות של כל קורס.

מקור: נתוני הקורסים והציונים האישיים של הסטודנט במערכת BIOBOT.
`;
}

function buildCreditsAnswer(user = {}) {
  const completedCredits = calculateCompletedCredits(user);
  const remainingCredits = calculateRemainingCredits(user);

  return `
צברת עד עכשיו ${completedCredits} נקודות זכות.

כדי לסיים את התואר נדרשות ${TOTAL_DEGREE_CREDITS} נקודות זכות.

נותרו לך ${remainingCredits} נקודות זכות לסיום הדרישה.

מקור: דרישת 165 נ"ז לתואר + נתוני הקורסים האישיים של הסטודנט.
`;
}

function buildContactRecommendation(message = "", user = {}) {
  const text = normalizeHebrewText(message);

  if (text.includes("ערעור") || text.includes("ציון") || text.includes("בחינה")) {
    return `
במקרה של ערעור על ציון או בחינה, הגורם הראשון לפנייה הוא מרצה הקורס דרך תחנת המידע או לפי נוהל הערעורים.

אם מדובר בבעיה שלא נפתרה, ניתן לפנות למזכירות המחלקה או לראש המחלקה.

מקור: נוהל ערעורים על בחינות סוף סמסטר.
`;
  }

  if (text.includes("מצב אקדמי") || text.includes("על תנאי") || text.includes("רישום")) {
    return `
בנושא מצב אקדמי, רישום לקורסים או מצב על תנאי, מומלץ לפנות ליועץ האקדמי של שנת הלימוד שלך.

שנת לימוד במערכת: ${user.year || "לא צוינה"}

מקור: סעיף יועץ אקדמי במאגר הנהלים.
`;
  }

  if (text.includes("קושי") || text.includes("לחץ") || text.includes("רגשי")) {
    return `
בנושאי קושי אישי, לחץ רגשי, עומס או בעיות כלכליות, מומלץ לפנות לדקנט הסטודנטים.

מקור: מידע דקנט הסטודנטים במאגר הנהלים.
`;
  }

  return `
לפי סוג הפנייה, מומלץ להתחיל ממזכירות המחלקה. אם מדובר בנושא אישי, רגשי או כלכלי — יש לפנות לדקנט הסטודנטים.

מקור: מאגר הנהלים של BIOBOT.
`;
}

function getRelevantKnowledge(question = "", knowledgeBase = "") {
  const normalizedQuestion = normalizeHebrewText(question);

  const sections = knowledgeBase.split(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  );

  const relevantSections = sections.filter((section) => {
    const normalizedSection = normalizeHebrewText(section);

    return normalizedQuestion
      .split(" ")
      .filter((word) => word.length >= 3)
      .some((word) => normalizedSection.includes(word));
  });

  return relevantSections.length > 0
    ? relevantSections.join("\n\n")
    : knowledgeBase;
}

function buildGeminiPrompt({ user, message, relevantKnowledge }) {
  return `
You are BIOBOT 2.0, an academic assistant for students in the Biotechnology Engineering department at ORT Braude College.

Rules:
1. Answer only according to the knowledge base and the student's personal data.
2. If the answer is not found, say that no official information was found and recommend contacting the department secretary or dean.
3. Always answer in the same language as the student's question.
4. Always include a source/reference at the end.
5. Do not invent forms, rules, contacts, grades, or procedures.

Student details:
Name: ${user.firstName} ${user.lastName}
Email: ${user.email}
Role: ${user.role}
Year: ${user.year || "לא צוין"}

Completed courses:
${JSON.stringify(user.completedCourses || [], null, 2)}

Schedule:
${JSON.stringify(user.schedule || [], null, 2)}

Relevant knowledge base:
${relevantKnowledge}

Student question:
${message}
`;
}

function handleLocalAnswer(message = "", user = {}) {
  const intent = detectIntent(message);

  if (intent === "academic_status") {
    return buildAcademicStatusAnswer(user);
  }

  if (intent === "average") {
    return buildAverageAnswer(user);
  }

  if (intent === "credits") {
    return buildCreditsAnswer(user);
  }

  if (intent === "contact_advisor") {
    return buildContactRecommendation(message, user);
  }

  return null;
}

module.exports = {
  detectIntent,
  calculateAverage,
  calculateCompletedCredits,
  calculateRemainingCredits,
  getFailedCourses,
  calculateAcademicStatus,
  buildAcademicStatusAnswer,
  buildAverageAnswer,
  buildCreditsAnswer,
  buildContactRecommendation,
  getRelevantKnowledge,
  buildGeminiPrompt,
  handleLocalAnswer,
};