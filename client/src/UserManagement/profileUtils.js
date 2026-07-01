/** @file Pure utility functions for ProfilePage — no React, no side effects. */

export const SCHEDULE_DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
export const SCHEDULE_DAYS_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

/** Returns the ordered weekday names array for the given language. */
export function getScheduleDays(language) {
  return language === "ar" ? SCHEDULE_DAYS_AR : SCHEDULE_DAYS_HE;
}

/** Calculates weighted GPA: sum(grade * credits) / totalCredits. Returns null if no credits. */
export function calculateGpa(courses = []) {
  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  if (totalCredits === 0) return null;
  const weightedSum = courses.reduce((sum, c) => sum + c.grade * c.credits, 0);
  return weightedSum / totalCredits;
}

/** Sums all credits across the provided courses. */
export function calculateTotalCredits(courses = []) {
  return courses.reduce((sum, c) => sum + (c.credits || 0), 0);
}

/** Sorts a copy of the courses array by "name" (alphabetical) or "grade" (descending). */
export function sortCourses(courses = [], sortType) {
  return [...courses].sort((a, b) => {
    if (sortType === "name") return a.name.localeCompare(b.name, "he");
    if (sortType === "grade") return b.grade - a.grade;
    return 0;
  });
}

/** Returns grade distribution buckets (90-100, 80-89, 70-79, 60-69, 55-59) with counts for the bar chart. */
export function buildGradeRanges(courses = []) {
  return [
    { label: "90-100", count: courses.filter((c) => c.grade >= 90).length },
    { label: "80-89",  count: courses.filter((c) => c.grade >= 80 && c.grade <= 89).length },
    { label: "70-79",  count: courses.filter((c) => c.grade >= 70 && c.grade <= 79).length },
    { label: "60-69",  count: courses.filter((c) => c.grade >= 60 && c.grade <= 69).length },
    { label: "55-59",  count: courses.filter((c) => c.grade >= 55 && c.grade <= 59).length },
  ];
}

/** Extracts unique start times from the schedule, sorted ascending. */
export function getTimeSlots(schedule = []) {
  return [...new Set(schedule.map((e) => e.startTime))].sort();
}

// Days are stored in Hebrew in the DB regardless of UI language, so we always look up by Hebrew day name
export function getClassAt(schedule = [], language, day, time) {
  const days = language === "ar" ? SCHEDULE_DAYS_AR : SCHEDULE_DAYS_HE;
  const dayIndex = days.indexOf(day);
  const heDay = SCHEDULE_DAYS_HE[dayIndex];
  return schedule.find((e) => e.day === heDay && e.startTime === time);
}
