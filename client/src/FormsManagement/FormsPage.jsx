import { useState, useEffect } from "react";
import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

import SearchBar from "../GUIManagement/SearchBar";
import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";
import InfoCard from "../GUIManagement/InfoCard";
import { useLanguage } from "../contexts/languageContext";

import { getStudentForms, getFormFileUrl } from "../Services/studentFormsService";

export default function FormsPage() {
  const { t } = useLanguage();
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadForms() {
      try {
        setLoading(true);
        const data = await getStudentForms();
        setForms(data);
        setFilteredForms(data);
      } catch (err) {
        setError(t("formsLoadError"));
      } finally {
        setLoading(false);
      }
    }

    loadForms();
  }, [t]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredForms(forms);
      return;
    }
    const filtered = forms.filter((form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForms(filtered);
  };

  const handleOpenForm = (form) => {
    const fullUrl = getFormFileUrl(form);
    if (fullUrl) {
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } else {
      alert(t("formFileMissing"));
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <PageHeader
        title={t("formsPage")}
        buttonText={t("homeButton")}
        to="/home"
        showLanguageToggle
      />

      <main className="flex-1 flex justify-center mt-10 px-4">
        <div className="w-full max-w-[760px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          
          <div className="flex gap-4 mb-8">
            <SearchBar 
              placeholder={t("formsSearchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            />

            <PrimarySmallButton
              text={t("searchButton")}
              onClick={handleSearch}
            />
          </div>

          {loading && <p className="text-center text-slate-500 dark:text-slate-400">{t("formsLoading")}</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && filteredForms.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400">{t("formsEmpty")}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredForms.map((form) => (
              <InfoCard
                key={form._id || form.title}
                title={form.title}
                description={form.description}
                buttonText={t("openFile")}
                onClick={() => handleOpenForm(form)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}