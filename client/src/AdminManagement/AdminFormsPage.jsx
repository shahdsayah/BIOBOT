import { useState } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import LabeledInput from "../GUIManagement/LabeledInput";
import ActionButton from "../GUIManagement/ActionButton";

import { createForm } from "../Services/formsService";

export default function AdminFormsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleAddForm(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("createdBy", "admin");

      if (file) {
        formData.append("file", file);
      }

      await createForm(formData);

      setMessage("הטופס נוסף בהצלחה");

      setTitle("");
      setDescription("");
      setCategory("");
      setFile(null);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col">
      <PageHeader title="ניהול טפסים" buttonText="לוח ניהול" to="/admin" />

      <main className="flex-1 flex justify-center py-10">
        <div className="w-[700px] bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-[oklch(48.8%_0.243_264.376)] mb-3">
            הוספת טופס חדש
          </h2>

          <p className="text-slate-500 mb-8">
            כאן ניתן להעלות קובצי PDF או Word למערכת
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
              label="קטגוריה"
              type="text"
              placeholder="בחינות / אקדמי / משמעת"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <div className="w-full mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                העלאת קובץ
              </label>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border-b-2 border-slate-300 px-2 py-3 outline-none"
              />
            </div>

            {message && (
              <p className="text-green-600 text-sm mb-4">{message}</p>
            )}

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <ActionButton text="הוסף טופס" type="submit" />
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}