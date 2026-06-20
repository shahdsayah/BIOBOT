import { useEffect, useState } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import LabeledInput from "../GUIManagement/LabeledInput";
import ActionButton from "../GUIManagement/ActionButton";
import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";

import {
  createForm,
  getForms,
  updateForm,
  deleteForm,
} from "../Services/formsService";

export default function AdminFormsPage() {
  const [forms, setForms] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadForms() {
    try {
      const data = await getForms();
      setForms(data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  useEffect(() => {
    loadForms();
  }, []);

  const groupedForms = forms.reduce((groups, form) => {
    const groupName = form.category || "ללא קטגוריה";

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(form);
    return groups;
  }, {});

  async function handleSubmit(e) {
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

      if (editingId) {
        await updateForm(editingId, formData);
        setMessage("הטופס עודכן בהצלחה");
      } else {
        await createForm(formData);
        setMessage("הטופס נוסף בהצלחה");
      }

      resetForm();
      await loadForms();
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  function handleEdit(form) {
    setEditingId(form._id);
    setTitle(form.title);
    setDescription(form.description);
    setCategory(form.category || "");
    setFile(null);
    setMessage("");
    setError("");
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את הטופס?");

    if (!confirmDelete) return;

    try {
      setMessage("");
      setError("");

      await deleteForm(id);
      setMessage("הטופס נמחק בהצלחה");
      await loadForms();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setFile(null);
    setEditingId(null);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <PageHeader title="ניהול טפסים" buttonText="לוח ניהול" to="/admin" />

      <main className="flex-1 py-10 px-8">
        <div className="max-w-[1250px] mx-auto grid grid-cols-2 gap-8">
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 order-1">
            <h2 className="text-3xl font-bold text-brand mb-6">
              טפסים קיימים
            </h2>

            {forms.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">אין טפסים במערכת.</p>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedForms).map(([categoryName, categoryForms]) => (
                  <div key={categoryName}>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-600 pb-2 mb-4">
                      {categoryName}
                    </h3>

                    <div className="space-y-3">
                      {categoryForms.map((form) => (
                        <div
                          key={form._id}
                          className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 flex items-center justify-between gap-4"
                        >
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100">
                              {form.title}
                            </h4>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {form.description}
                            </p>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <PrimarySmallButton
                              text="פתח"
                              onClick={() =>
                                window.open(
                                  `${import.meta.env.VITE_API_URL}${form.fileUrl}`,
                                  "_blank"
                                )
                              }
                            />

                            <PrimarySmallButton
                              text="עדכן"
                              onClick={() => handleEdit(form)}
                            />

                            <button
                              type="button"
                              onClick={() => handleDelete(form._id)}
                              className="bg-red-600 text-white px-5 py-2 rounded-md font-bold hover:opacity-90 transition"
                            >
                              מחק
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 order-2">
            <h2 className="text-3xl font-bold text-brand mb-3">
              {editingId ? "עדכון טופס" : "הוספת טופס חדש"}
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mb-8">
              כאן ניתן להעלות קובצי PDF או Word למערכת
            </p>

            <form onSubmit={handleSubmit}>
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
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  העלאת קובץ
                </label>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full border-b-2 border-slate-300 dark:border-slate-600 dark:text-slate-300 bg-transparent px-2 py-3 outline-none"
                />

                {editingId && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    אם לא תבחר קובץ חדש, הקובץ הקיים יישאר.
                  </p>
                )}
              </div>

              {message && (
                <p className="text-green-600 text-sm mb-4">{message}</p>
              )}

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <ActionButton
                text={editingId ? "שמור עדכון" : "הוסף טופס"}
                type="submit"
              />

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="block mx-auto mt-4 text-sm text-slate-500 dark:text-slate-400 hover:text-brand"
                >
                  ביטול עריכה
                </button>
              )}
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}