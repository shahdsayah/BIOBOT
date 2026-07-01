/** @file Admin forms management page component. */

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
import API_BASE_URL from "../Services/apiConfig";
import { useLanguage } from "../contexts/languageContext";
import { useToast } from "../contexts/ToastContext";
import EmptyState from "../GUIManagement/EmptyState";
import SectionCard from "../GUIManagement/SectionCard";

/*
 * Page: Admin Forms
 * Upload, edit, and delete academic forms (PDF/Word). Inline editing with toast notifications on save/delete.
 */
export default function AdminFormsPage() {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [forms, setForms] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadForms() {
    try {
      const data = await getForms();
      setForms(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadForms();
  }, []);

  const groupedForms = forms.reduce((groups, form) => {
    const groupName = form.category || t("adminFormsNoCategory");
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(form);
    return groups;
  }, {});

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("createdBy", "admin");

      if (file) formData.append("file", file);

      if (editingId) {
        await updateForm(editingId, formData);
        addToast(t("adminFormsUpdated"));
      } else {
        await createForm(formData);
        addToast(t("adminFormsAdded"));
      }

      resetForm();
      await loadForms();
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    }
  }

  function handleEdit(form) {
    setEditingId(form._id);
    setTitle(form.title);
    setDescription(form.description);
    setCategory(form.category || "");
    setFile(null);
    setError("");
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(t("adminFormsDeleteConfirm"));
    if (!confirmDelete) return;

    try {
      setError("");
      await deleteForm(id);
      addToast(t("adminFormsDeleted"));
      await loadForms();
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
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
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <PageHeader title={t("adminFormsTitle")} buttonText={t("adminFormsBack")} to="/admin" showLanguageToggle />

      <main className="flex-1 py-10 px-8">
        <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionCard as="section" className="order-1">
            <h2 className="text-3xl font-bold text-brand mb-6">
              {t("adminFormsExisting")}
            </h2>

            {forms.length === 0 ? (
              <EmptyState icon="📄" title={t("emptyFormsTitle")} description={t("emptyFormsDesc")} />
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedForms).map(([categoryName, categoryForms]) => (
                  <div key={categoryName}>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-500 pb-2 mb-4">
                      {categoryName}
                    </h3>

                    <div className="space-y-3">
                      {categoryForms.map((form) => (
                        <div
                          key={form._id}
                          className="border border-slate-200 dark:border-slate-500 rounded-xl p-4 flex items-center justify-between gap-4"
                        >
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100">
                              {form.title}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-200 mt-1">
                              {form.description}
                            </p>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <PrimarySmallButton
                              text={t("adminFormsOpen")}
                              onClick={() => window.open(`${API_BASE_URL}${form.fileUrl}`, "_blank")}
                            />
                            <PrimarySmallButton
                              text={t("adminFormsUpdateBtn")}
                              onClick={() => handleEdit(form)}
                            />
                            <button
                              type="button"
                              onClick={() => handleDelete(form._id)}
                              className="bg-red-600 text-white px-5 py-2 rounded-md font-bold hover:opacity-90 transition"
                            >
                              {t("adminFormsDeleteBtn")}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard as="section" className="order-2">
            <h2 className="text-3xl font-bold text-brand mb-3">
              {editingId ? t("adminFormsEditTitle") : t("adminFormsAddTitle")}
            </h2>

            <p className="text-slate-500 dark:text-slate-200 mb-8">
              {t("adminFormsSubtitle")}
            </p>

            <form onSubmit={handleSubmit}>
              <LabeledInput
                label={t("adminFormsFieldName")}
                type="text"
                placeholder={t("adminFormsFieldNamePlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <LabeledInput
                label={t("adminFormsFieldDesc")}
                type="text"
                placeholder={t("adminFormsFieldDescPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <LabeledInput
                label={t("adminFormsFieldCategory")}
                type="text"
                placeholder={t("adminFormsFieldCategoryPlaceholder")}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <div className="w-full mb-5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  {t("adminFormsFileLabel")}
                </label>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full border-b-2 border-slate-300 dark:border-slate-500 dark:text-slate-200 bg-transparent px-2 py-3 outline-none"
                />

                {editingId && (
                  <p className="text-xs text-slate-500 dark:text-slate-200 mt-2">
                    {t("adminFormsFileNote")}
                  </p>
                )}
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <ActionButton
                text={editingId ? t("adminFormsSaveBtn") : t("adminFormsAddBtn")}
                type="submit"
              />

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="block mx-auto mt-4 text-sm text-slate-500 dark:text-slate-200 hover:text-brand"
                >
                  {t("adminFormsCancelEdit")}
                </button>
              )}
            </form>
          </SectionCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}
