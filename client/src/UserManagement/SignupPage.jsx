import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import LabeledInput from "../GUIManagement/LabeledInput";
import ActionButton from "../GUIManagement/ActionButton";
import ArithmeticCaptcha from "../GUIManagement/ArithmeticCaptcha";

import { registerUser } from "../Services/authService";

import logo from "../assets/logo.jpg";

export default function SignupPage() {
  const navigate = useNavigate();
  const captchaRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    try {
      setError("");

      const captchaIsValid = captchaRef.current.validateCaptcha();

      if (!captchaIsValid) {
        return;
      }

      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        setError("יש למלא את כל השדות.");
        return;
      }

      const newUser = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "student",
      };

      await registerUser(newUser);

      captchaRef.current.refreshCaptcha();

      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(err.message || "Registration failed");
      captchaRef.current.refreshCaptcha();
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-[1000px] min-h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row">
        <section className="w-full sm:w-3/5 p-8 sm:p-14 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-brand mb-3">
            הרשמה
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-8">
            צרו חשבון חדש במערכת ביו־בוט
          </p>

          <form onSubmit={handleSignup}>
            <LabeledInput
              label="שם פרטי"
              type="text"
              placeholder="הכנס שם פרטי"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <LabeledInput
              label="שם משפחה"
              type="text"
              placeholder="הכנס שם משפחה"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <LabeledInput
              label="אימייל"
              type="email"
              placeholder="הכנס אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <LabeledInput
              label="סיסמה"
              type="password"
              placeholder="הכנס סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <ArithmeticCaptcha ref={captchaRef} />

            {error && (
              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>
            )}

            <ActionButton text="יצירת חשבון" type="submit" />

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="block mx-auto mt-5 text-sm text-slate-500 dark:text-slate-400 hover:text-brand"
            >
              כבר יש לך חשבון? התחברות
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
            הצטרפות למערכת ביו־בוט
          </p>

          <p className="text-center mt-4 text-white/90">
            גישה מהירה למידע אקדמי, נהלים וטפסים במקום אחד
          </p>
        </section>
      </div>
    </div>
  );
}