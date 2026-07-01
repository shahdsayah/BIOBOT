/** @file Signup page component. */

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/languageContext";

import LabeledInput from "../GUIManagement/LabeledInput";
import ActionButton from "../GUIManagement/ActionButton";
import ArithmeticCaptcha from "../GUIManagement/ArithmeticCaptcha";
import PageHeader from "../GUIManagement/PageHeader";

import { registerUser } from "../Services/authService";

import logo from "../assets/logo.jpg";

/*
 * Page: Signup
 * Registration form with first name, last name, email, password, semester selection, and CAPTCHA.
 */
export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const captchaRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [semester, setSemester] = useState("");

  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    try {
      setError("");

      const captchaIsValid = captchaRef.current.validateCaptcha();

      if (!captchaIsValid) {
        return;
      }

      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !semester) {
        setError(t("signupFieldsRequired"));
        return;
      }

      const newUser = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "student",
        semester: Number(semester),
      };

      await registerUser(newUser);

      captchaRef.current.refreshCaptcha();

      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
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
            {t("signupTitle")}
          </h2>

          <p className="text-slate-600 dark:text-slate-200 mb-8">
            {t("signupWelcome")}
          </p>

          <form onSubmit={handleSignup}>
            <LabeledInput
              label={t("signupFirstName")}
              type="text"
              placeholder={t("signupFirstNamePlaceholder")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <LabeledInput
              label={t("signupLastName")}
              type="text"
              placeholder={t("signupLastNamePlaceholder")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <LabeledInput
              label={t("signupEmail")}
              type="email"
              placeholder={t("signupEmailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <LabeledInput
              label={t("signupPassword")}
              type="password"
              placeholder={t("signupPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="w-full mb-5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t("signupSemester")}
              </label>

              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full border-b-2 border-slate-300 dark:border-slate-500 dark:bg-transparent dark:text-slate-200 px-2 py-3 outline-none"
              >
                <option value="">{t("signupSemesterPlaceholder")}</option>
                {Array.from({ length: 8 }, (_, index) => {
                  const value = index + 1;
                  return (
                    <option key={value} value={value}>
                      {t("signupSemesterOption", { n: value })}
                    </option>
                  );
                })}
              </select>
            </div>

            <ArithmeticCaptcha ref={captchaRef} />

            {error && (
              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>
            )}

            <ActionButton text={t("signupButton")} type="submit" />

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="block mx-auto mt-5 text-sm text-slate-500 dark:text-slate-200 hover:text-brand"
            >
              {t("signupHaveAccount")}
            </button>
          </form>
        </section>

        <section className="hidden sm:flex w-2/5 bg-brand text-white flex-col items-center justify-center p-12">
          <img
            src={logo}
            alt="BIOBOT Logo"
            className="w-40 h-40 rounded-full bg-white object-contain p-3 mb-8"
          />

          <h1 className="text-5xl font-extrabold mb-4">BIOBOT 2.0</h1>

          <p className="text-2xl font-bold text-center">
            {t("signupBrandWelcome")}
          </p>

          <p className="text-center mt-4 text-white/90">
            {t("signupBrandSub")}
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}