import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_STORAGE_KEY = "biobot-language";
const defaultLanguage = "he";
const supportedLanguages = ["he", "ar"];

const translations = {
  he: {
    shalom: "שלום",
    welcome: "ברוכים הבאים למערכת ביו-בוט",
    homePage: "עמוד הבית",
    searchPage: "חיפוש",
    searchDesc: "חיפוש קורסים",
    bioBotPage: "ביו-בוט",
    bioBotDesc: "מעבר לצ'אט האקדמי החכם",
    formsPage:"נהלים וטפסים",
    formsDesc: "חיפוש טפסים ונהלים אקדמיים",
    logout: "התנתק",
    homePageBtn: "דף הבית",
    profilePage: "פרופיל אישי",
    profileDesc: "צפייה בפרטים האישיים שלך",
    privateDetails: "פרטים אישיים",
    homeButton: "דף הבית",
    stdname: "שם",
    stdEmail: "אימייל",
    stdRole: "תפקיד",
    stdDept: "מחלקה",
    stdYear: "שנה",
    studentFallback: "סטודנט",
    departmentFallback: "הנדסת ביוטכנולוגיה",
    yearFallback: "שנה ב׳",
    loading: "טוען...",
    notFound: "לא נמצא",
    gradeDistribution: "התפלגות ציונים",
    coursesLabel: "קורסים",
    credits: "נק״ז",
    points: "נקודות זכות",
    averageGrade: "ממוצע ציונים",
    courses: "קורסים",
    coursesDone: "קורסים שהושלמו",
    courseName: "שם הקורס",
    courseGrade: "ציון",
    searchCourses: "חיפוש קורסים",
    searchByField: "חפש קורס לפי שדה",
    courseName: "שם הקורס",
    semester: "סמסטר",
    courseCode: "קוד קורס",
    lecturer: "מרצה",
    searchResults: "תוצאות חיפוש קורסים",
    showingCourses: "מוצג {count} קורסים מתוך {total}",
    noResults: "לא נמצאו קורסים התואמים את חיפושך.",
    currentLanguage: "עברית",
    languageName: "עברית",
  },
  ar: {
    shalom: "مرحبا",
    welcome: "مرحبا بك في بيو-بوت",
    homePage: "الصفحة الرئيسية",
    searchPage: "بحث",
    searchDesc: "البحث عن الكورسات",
    bioBotPage: "بيو-بوت",  
    bioBotDesc: "الانتقال إلى الدردشة الذكية الأكاديمية",
    formsPage: "النماذج والإجراءات",
    formsDesc: "البحث عن النماذج والإجراءات الأكاديمية",
    logout: "الخروج",
    homePageBtn: "الصفحة الرئيسية",
    profilePage: "البروفيل",
    profileDesc: "عرض تفاصيلك الشخصية",
    privateDetails: "تفاصيل شخصية",
    homeButton: "الصفحة الرئيسية",
    stdname: "الاسم",
    stdEmail: "البريد الإلكتروني",
    stdRole: "الدور",
    stdDept: "القسم",
    stdYear: "السنة",
    studentFallback: "סטודנט",
    departmentFallback: "הנדסת ביוטכנולוגיה",
    yearFallback: "שנה ב׳",
    loading: "جارٍ التحميل...",
    notFound: "غير موجود",
    gradeDistribution: "توزيع الدرجات",
    coursesLabel: "الكورسات",
    credits: "النقاط",
    points: "نقاط ",
    averageGrade: "متوسط الدرجات",
    courses: "الكورسات",
    coursesDone: "الكورسات المكتملة",
    courseName: "اسم الكورس",
    courseGrade: "الدرجة",
    searchCourses: "بحث عن الكورسات",
    searchByField: "ابحث عن كورس حسب الحقل",
    courseName: "اسم الكورس",
    semester: "الفصل الدراسي",
    courseCode: "رمز الكورس",
    lecturer: "المحاضر",
    searchResults: "نتائج بحث الكورسات",
    showingCourses: "عرض {count} كورسات من أصل {total}",
    noResults: "لم يتم العثور على كورسات مطابقة.",
    currentLanguage: "العربية",
    languageName: "العربية",
  },
};

const LanguageContext = createContext({
  language: defaultLanguage,
  direction: "rtl",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, params) => key,
  currentLanguageLabel: translations[defaultLanguage].currentLanguage,
  nextLanguageLabel: translations["ar"].languageName,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return supportedLanguages.includes(saved) ? saved : defaultLanguage;
    } catch (error) {
      return defaultLanguage;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.warn("Unable to persist language selection.", error);
    }
  }, [language]);

  const value = useMemo(() => {
    const toggleLanguage = () => {
      setLanguage((prevLanguage) =>
        prevLanguage === "he" ? "ar" : "he"
      );
    };

    const currentTranslation = translations[language] || translations[defaultLanguage];
    const nextLanguage = language === "he" ? "ar" : "he";

    return {
      language,
      direction: language === "ar" || language === "he" ? "rtl" : "ltr",
      setLanguage,
      toggleLanguage,
      t: (key, params = {}) => {
        const template = currentTranslation[key] || translations[defaultLanguage][key] || key;
        return Object.entries(params).reduce(
          (text, [paramKey, paramValue]) =>
            text.replace(`{${paramKey}}`, paramValue),
          template
        );
      },
      currentLanguageLabel: currentTranslation.currentLanguage,
      nextLanguageLabel: translations[nextLanguage]?.languageName || nextLanguage,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
