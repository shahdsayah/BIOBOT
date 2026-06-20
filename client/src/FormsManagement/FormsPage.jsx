import { useState, useEffect } from "react";
import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

import SearchBar from "../GUIManagement/SearchBar";
import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";
import InfoCard from "../GUIManagement/InfoCard";

// Import your student forms service utilities
import { getStudentForms, getFormFileUrl } from "../Services/studentFormsService";

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch forms dynamically from the database on mount
  useEffect(() => {
    async function loadForms() {
      try {
        setLoading(true);
        const data = await getStudentForms();
        setForms(data);
        setFilteredForms(data); // Initial view displays all forms
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת הטפסים. אנא נסה שוב מאוחר יותר.");
      } finally {
        setLoading(false);
      }
    }
    loadForms();
  }, []);

  // 2. Handle search functionality
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

  // 3. Open/Download Form File URL
  const handleOpenForm = (form) => {
    const fullUrl = getFormFileUrl(form);
    if (fullUrl) {
      // Opens the file (PDF/Docx/Image) in a new browser tab where they can view/download it
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("קובץ לא נמצא עבור טופס זה");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <PageHeader title="נהלים וטפסים" buttonText="דף הבית" to="/home" />

      <main className="flex-1 flex justify-center mt-10 px-4">
        <div className="w-full max-w-[760px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          
          {/* Search Bar Container */}
          <div className="flex gap-4 mb-8">
            <SearchBar 
              placeholder="חיפוש טופס או נוהל..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Optional: Enables live searching as you type
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()} 
            />

            <PrimarySmallButton
              text="חיפוש"
              onClick={handleSearch}
            />
          </div>

          {/* Status Messages */}
          {loading && <p className="text-center text-slate-500 dark:text-slate-400">טוען טפסים...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && filteredForms.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400">לא נמצאו טפסים תואמים.</p>
          )}

          {/* Dynamic Forms Grid Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredForms.map((form) => (
              <InfoCard
                key={form._id || form.title} // MongoDB uses _id
                title={form.title}
                description={form.description}
                buttonText="פתח קובץ"
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