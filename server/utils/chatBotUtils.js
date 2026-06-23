const {
  normalizeHebrewText,
} = require("./hebrewTextUtils");

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
    text.includes("נקודות זכות") ||
    text.includes("נז")
  ) {
    return "grades";
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

  return "general";
}

function calculateGpa(completedCourses = []) {
  const gradedCourses = completedCourses.filter(
    (course) =>
      typeof course.grade === "number" &&
      typeof course.credits === "number" &&
      course.credits > 0
  );

  const totalCredits = gradedCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );

  if (totalCredits === 0) {
    return 0;
  }

  const weightedSum = gradedCourses.reduce(
    (sum, course) => sum + course.grade * course.credits,
    0
  );

  return Number((weightedSum / totalCredits).toFixed(1));
}

function calculateCompletedCredits(completedCourses = []) {
  return completedCourses
    .filter((course) => course.grade >= 60)
    .reduce((sum, course) => sum + (course.credits || 0), 0);
}

function countFailedCourses(completedCourses = []) {
  return completedCourses.filter((course) => course.grade < 60).length;
}

function calculateAcademicStatus(user = {}) {
  const completedCourses = user.completedCourses || [];

  const gpa = calculateGpa(completedCourses);
  const completedCredits = calculateCompletedCredits(completedCourses);
  const failedCourses = countFailedCourses(completedCourses);

  let status = "לא ניתן לקבוע מצב אקדמי";
  let explanation = "לא נמצאו מספיק נתוני ציונים וקורסים עבור הסטודנט.";

  if (completedCourses.length > 0) {
    if (gpa >= 65 && failedCourses === 0) {
      status = "מצב אקדמי תקין";
      explanation =
        "הממוצע המצטבר הוא 65 ומעלה ואין קורסים שנכשלו, לכן המצב האקדמי מוגדר כתקין.";
    } else if (gpa >= 60 && gpa < 65) {
      status = "מצב אקדמי בהתראה";
      explanation =
        "הממוצע המצטבר נמצא בין 60 ל־64.99, ולכן הסטודנט נמצא במצב אקדמי בהתראה.";
    } else {
      status = "מצב אקדמי לא תקין / על תנאי";
      explanation =
        "הממוצע נמוך מ־60 או שיש קורסים שנכשלו, ולכן מומלץ לפנות ליועץ אקדמי.";
    }
  }

  return {
    status,
    gpa,
    completedCredits,
    failedCourses,
    explanation,
    source:
      "מקור: כללי מצב אקדמי מתוך מאגר הנהלים של BIOBOT והנתונים האישיים של הסטודנט.",
  };
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

  if (relevantSections.length === 0) {
    return knowledgeBase;
  }

  return relevantSections.join("\n\n");
}

function buildGeminiPrompt({ user, message, knowledgeBase }) {
  const relevantKnowledge = getRelevantKnowledge(message, knowledgeBase);

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

module.exports = {
  detectIntent,
  calculateGpa,
  calculateCompletedCredits,
  countFailedCourses,
  calculateAcademicStatus,
  getRelevantKnowledge,
  buildGeminiPrompt,
};