import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const ArithmeticCaptcha = forwardRef(function ArithmeticCaptcha(props, ref) {
  const [challenge, setChallenge] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState("");
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

  const maxIncorrectAttempts = 3;

  function generateCaptcha() {
    const operations = ["+", "-", "×", "÷"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1, num2, answer;

    if (operation === "+") {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 + num2;
    }

    if (operation === "-") {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      if (num2 > num1) { const temp = num1; num1 = num2; num2 = temp; }
      answer = num1 - num2;
    }

    if (operation === "×") {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 * num2;
    }

    if (operation === "÷") {
      num2 = Math.floor(Math.random() * 9) + 1;
      answer = Math.floor(Math.random() * 10) + 1;
      num1 = num2 * answer;
    }

    setChallenge(`${num1} ${operation} ${num2} = ?`);
    setExpectedAnswer(answer);
    setUserAnswer("");
    setError("");
  }

  useEffect(() => { generateCaptcha(); }, []);

  function validateCaptcha() {
    if (incorrectAttempts >= maxIncorrectAttempts) {
      setError("חרגת ממספר הניסיונות המותר. רענן את השאלה ונסה שוב.");
      return false;
    }

    const numericAnswer = Number(userAnswer);

    if (userAnswer.trim() === "" || Number.isNaN(numericAnswer)) {
      setError("יש להזין תשובה מספרית.");
      return false;
    }

    if (numericAnswer !== expectedAnswer) {
      const newAttempts = incorrectAttempts + 1;
      setIncorrectAttempts(newAttempts);
      if (newAttempts >= maxIncorrectAttempts) {
        setError("חרגת ממספר הניסיונות המותר. לחץ רענון לקבלת שאלה חדשה.");
      } else {
        setError(`תשובת CAPTCHA שגויה. נשארו ${maxIncorrectAttempts - newAttempts} ניסיונות.`);
      }
      return false;
    }

    setError("");
    setIncorrectAttempts(0);
    return true;
  }

  function refreshCaptcha() {
    setIncorrectAttempts(0);
    generateCaptcha();
  }

  useImperativeHandle(ref, () => ({ validateCaptcha, refreshCaptcha }));

  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        אימות CAPTCHA
      </label>

      <div className="flex items-center gap-4 mb-3">
        <span className="text-lg font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-md">
          {challenge}
        </span>

        <button
          type="button"
          onClick={refreshCaptcha}
          title="Refresh CAPTCHA"
          className="border border-slate-300 dark:border-slate-600 dark:text-slate-300 rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          🔄
        </button>
      </div>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="הכנס את התשובה"
        className="w-full border-b-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-2 py-3 outline-none focus:border-brand"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
});

export default ArithmeticCaptcha;
