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
    formsSearchPlaceholder: "חיפוש טופס או נוהל...",
    searchButton: "חיפוש",
    formsLoading: "טוען טפסים...",
    formsLoadError: "שגיאה בטעינת הטפסים. אנא נסה שוב מאוחר יותר.",
    formsEmpty: "לא נמצאו טפסים תואמים.",
    openFile: "פתח קובץ",
    formFileMissing: "קובץ לא נמצא עבור טופס זה",
    bioBotWelcome: "שלום, אני ביו־בוט. איך אוכל לעזור לך בנושא נהלים, טפסים או מידע אקדמי?",
    bioBotTitle: "צ׳אט אקדמי חכם",
    bioBotSubtitle: "שאל שאלות על נהלים, טפסים, בחינות ומצב אקדמי",
    bioBotSuggestedForm: "הטופס המתאים:",
    bioBotOpenSuggestedForm: "פתח קובץ",
    bioBotError: "אירעה שגיאה בקבלת תשובה מהמערכת. נסה שוב.",
    bioBotPlaceholder: "כתוב שאלה לביו-בוט...",
    bioBotThinking: "חושב...",
    bioBotSend: "שליחה",
    newChat: "שיחה חדשה",
    chatHistory: "היסטוריית שיחות",
    noChats: "עדיין אין שיחות.",
    deleteChat: "מחק שיחה",
    notFoundTitle: "העמוד לא נמצא",
    notFoundHeading: "אופס, אין כאן שום דבר",
    notFoundDescription: "הקישור שפתחת לא מוביל לעמוד קיים במערכת ביו-בוט.",
    goToLogin: "לעמוד ההתחברות",
    goToDashboard: "ללוח הניהול",
    goToHome: "לעמוד הבית",
    goBack: "חזרה לעמוד הקודם",
    downloadAcademicPdf: "הורדת PDF למערכת שעות ולקורסים שהושלמו",
    generatingPdf: "מייצר קובץ PDF...",
    pdfGenerationFailed: "יצירת קובץ PDF נכשלה. נסה שוב.",
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
    formsSearchPlaceholder: "ابحث عن نموذج أو إجراء...",
    searchButton: "بحث",
    formsLoading: "جارٍ تحميل النماذج...",
    formsLoadError: "حدث خطأ أثناء تحميل النماذج. حاول مرة أخرى لاحقًا.",
    formsEmpty: "لم يتم العثور على نماذج مطابقة.",
    openFile: "افتح الملف",
    formFileMissing: "لا يوجد ملف لهذا النموذج",
    bioBotWelcome: "مرحبا، أنا بيو-بوت. كيف يمكنني مساعدتك بخصوص الإجراءات أو النماذج أو المعلومات الأكاديمية؟",
    bioBotTitle: "دردشة أكاديمية ذكية",
    bioBotSubtitle: "اسأل عن الإجراءات والنماذج والامتحانات ووضعك الأكاديمي",
    bioBotSuggestedForm: "النموذج المناسب:",
    bioBotOpenSuggestedForm: "افتح الملف",
    bioBotError: "حدث خطأ أثناء الحصول على رد من النظام. حاول مرة أخرى.",
    bioBotPlaceholder: "اكتب سؤالك إلى بيو-بوت...",
    bioBotThinking: "يفكر...",
    bioBotSend: "إرسال",
    newChat: "محادثة جديدة",
    chatHistory: "سجل المحادثات",
    noChats: "لا توجد محادثات بعد.",
    deleteChat: "احذف المحادثة",
    notFoundTitle: "الصفحة غير موجودة",
    notFoundHeading: "عذرًا، لا يوجد شيء هنا",
    notFoundDescription: "الرابط الذي فتحته لا يؤدي إلى صفحة موجودة في نظام بيو-بوت.",
    goToLogin: "إلى صفحة تسجيل الدخول",
    goToDashboard: "إلى لوحة الإدارة",
    goToHome: "إلى الصفحة الرئيسية",
    goBack: "العودة إلى الصفحة السابقة",
    downloadAcademicPdf: "تنزيل PDF للجدول والكورسات المكتملة",
    generatingPdf: "جارٍ إنشاء ملف PDF...",
    pdfGenerationFailed: "فشل إنشاء ملف PDF. حاول مرة أخرى.",
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