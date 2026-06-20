export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 h-14 px-8 flex items-center justify-between"
    >
      <div className="font-semibold">BIOBOT 2.0 - Group B7</div>

      <div className="flex items-center gap-6 text-sm">
        <a
          href="https://w3.braude.ac.il/new-student/flyer2022/online/station/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          כניסה למערכות המכללה
        </a>

        <span>|</span>

        <span>© 2026</span>
      </div>
    </footer>
  );
}
