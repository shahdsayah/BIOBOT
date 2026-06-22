import { useNavigate } from "react-router-dom";
import SmallButton from "./SmallButton";
import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from "../Services/themeService";
import { useLanguage } from "../contexts/languageContext";

export default function PageHeader(props) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toggleLanguage, currentLanguageLabel, nextLanguageLabel } = useLanguage();

  function handleClick() {
    if (props.onClick) {
      props.onClick();
    } else {
      navigate(props.to || "/home");
    }
  }

  return (
    <header
      dir="rtl"
      className="h-16 bg-brand text-white flex items-center justify-between px-8 shadow-md"
    >
      <h1 className="text-xl font-bold">{props.title}</h1>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md transition"
          title={theme === "dark" ? "מצב בהיר" : "מצב כהה"}
        >
          {theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
        </button>

        {props.showLanguageToggle && (
          <button
            type="button"
            onClick={toggleLanguage}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md transition text-sm font-bold"
            title={`עבור ל${nextLanguageLabel}`}
          >
            {nextLanguageLabel}
          </button>
        )}

        {props.buttonText && (
          <SmallButton text={props.buttonText} onClick={handleClick} />
        )}
      </div>
    </header>
  );
}
