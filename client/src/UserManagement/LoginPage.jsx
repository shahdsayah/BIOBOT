import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/languageContext";

import LabeledInput from "../GUIManagement/LabeledInput";
import ActionButton from "../GUIManagement/ActionButton";
import ArithmeticCaptcha from "../GUIManagement/ArithmeticCaptcha";
import PageHeader from "../GUIManagement/PageHeader";

import { loginUser } from "../Services/authService";
import logo from "../assets/logo.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const captchaRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setError("");

      const captchaIsValid = captchaRef.current.validateCaptcha();

      if (!captchaIsValid) {
        return;
      }

      if (!email.trim() || !password.trim()) {
        setError(t("loginFieldsRequired"));
        return;
      }

      const user = await loginUser(email.trim().toLowerCase(), password);

      captchaRef.current.refreshCaptcha();

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Login failed");
      captchaRef.current.refreshCaptcha();
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col"
    >
      <PageHeader title="BIOBOT 2.0" showLanguageToggle />
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[1000px] min-h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row">
        <section className="w-full sm:w-3/5 p-8 sm:p-14 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-brand mb-3">
            {t("loginTitle")}
          </h2>

          <p className="text-slate-600 dark:text-slate-200 mb-10">
            {t("loginWelcome")}
          </p>

          <form onSubmit={handleLogin}>
            <LabeledInput
              label={t("loginEmail")}
              type="email"
              placeholder={t("loginEmailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <LabeledInput
              label={t("loginPassword")}
              type="password"
              placeholder={t("loginPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <ArithmeticCaptcha ref={captchaRef} />

            {error && (
              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>
            )}

            <ActionButton text={t("loginButton")} type="submit" />

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="block mx-auto mt-5 text-sm text-slate-500 dark:text-slate-200 hover:text-brand"
            >
              {t("loginCreateAccount")}
            </button>
          </form>
        </section>

        <section className="hidden sm:flex w-2/5 bg-brand text-white flex-col items-center justify-center p-12">
          <img
            src={logo}
            alt="BIOBOT Logo"
            className="w-40 h-40 rounded-full bg-white object-contain p-3 mb-8"
          />

          <h1 className="text-5xl font-extrabold mb-4">
            BIOBOT 2.0
          </h1>

          <p className="text-2xl font-bold text-center">
            {t("loginBrandWelcome")}
          </p>

          <p className="text-center mt-4 text-white/90">
            {t("loginBrandSub")}
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}