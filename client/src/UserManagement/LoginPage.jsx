import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LabeledInput from "../GUIManagement/LabeledInput";
import ActionButton from "../GUIManagement/ActionButton";

import { loginUser } from "../Services/authService";
import logo from "../assets/logo.jpg";

export default function LoginPage() {
  const navigate = useNavigate();

  //state hooks to track what the user is typing into the Email and Password fields.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  async function handleLogin(e) {
  e.preventDefault();

  try {
    setError("");

    const user = await loginUser(email, password);

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  } catch (err) {
    console.log(err);
    setError(err.message);
  }
}

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 flex items-center justify-center"
    >
      <div className="w-[1000px] min-h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        <section className="w-3/5 p-14 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-[oklch(48.8%_0.243_264.376)] mb-3">
            התחברות
          </h2>

          <p className="text-slate-600 mb-10">
            ברוכים הבאים למערכת ביו־בוט
          </p>

          <form onSubmit={handleLogin}>
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

        
            {error && (
              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>
            )}

            <ActionButton text="התחברות" type="submit" />

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="block mx-auto mt-5 text-sm text-slate-500 hover:text-[oklch(48.8%_0.243_264.376)]"
            >
              יצירת חשבון חדש
            </button>
          </form>
        </section>

        <section className="w-2/5 bg-[oklch(48.8%_0.243_264.376)] text-white flex flex-col items-center justify-center p-12">
          <img
            src={logo}
            alt="BIOBOT Logo"
            className="w-40 h-40 rounded-full bg-white object-contain p-3 mb-8"
          />

          <h1 className="text-5xl font-extrabold mb-4">
            BIOBOT 2.0
          </h1>

          <p className="text-2xl font-bold text-center">
            ברוכים הבאים למערכת ביו־בוט
          </p>

          <p className="text-center mt-4 text-white/90">
            המידע האקדמי שלך, פשוט ונגיש במקום אחד
          </p>
        </section>
      </div>
    </div>
  );
}