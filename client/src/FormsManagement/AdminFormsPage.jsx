import { useState } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import LabeledInput from "../GUIManagement/LabeledInput";
import ActionButton from "../GUIManagement/ActionButton";

export default function AdminFormsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  function handleAddForm(e) {
    e.preventDefault();

    const newForm = {
      title,
      description,
      link,
      category,
    };

    console.log("New form:", newForm);

    setMessage("הטופס נוסף בהצלחה - בשלב הבא נחבר למסד הנתונים");

    setTitle("");
    setDescription("");
    setLink("");
    setCategory("");
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col">
      <PageHeader title="ניהול טפסים" buttonText="דף הבית" to="/home" />

      <main className="flex-1 flex justify-center py-10">
        <div className="w-[700px] bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-[oklch(48.8%_0.243_264.376)] mb-3">
            הוספת טופס חדש
          </h2>

          <p className="text-slate-500 mb-8">
            עמוד זה מיועד למנהל מערכת בלבד. כאן ניתן להוסיף טפסים ונהלים למערכת.
          </p>

          <form onSubmit={handleAddForm}>
            <LabeledInput
              label="שם הטופס"
              type="text"
              placeholder="לדוגמה: טופס ערעור"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <LabeledInput
              label="תיאור"
              type="text"
              placeholder="תיאור קצר של הטופס"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <LabeledInput
              label="קישור לטופס"
              type="text"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />

            <LabeledInput
              label="קטגוריה"
              type="text"
              placeholder="לדוגמה: בחינות / אקדמי / משמעת"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            {message && (
              <p className="text-green-600 text-sm mb-4 font-bold">
                {message}
              </p>
            )}

            <ActionButton text="הוסף טופס" type="submit" />
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}