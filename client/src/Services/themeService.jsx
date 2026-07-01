/** @file Theme context providing dark/light mode toggle. Persists the selected theme to localStorage. */

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

/** Wraps the app in a div that carries the "dark" class and provides toggleTheme(). */
export function ThemeProvider({ children }) {
  // Empty string = light mode; "dark" = dark mode (applied as a class on the wrapper div)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${theme} min-h-screen`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/** Returns { theme, toggleTheme }. */
export function useTheme() {
  return useContext(ThemeContext);
}