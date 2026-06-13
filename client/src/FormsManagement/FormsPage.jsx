import { useState } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

import SearchBar from "../GUIManagement/SearchBar";
import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";
import InfoCard from "../GUIManagement/InfoCard";

export default function FormsPage() {
  const navigate = useNavigate();

  const forms = [
    {
      title: "טופס ערעור",
      description: "הגשת ערעור על ציון מבחן או עבודה.",
      path: "/forms/appeal",
    },
    {
      title: "בקשה למועד מיוחד",
      description: "טופס להגשת בקשה למבחן מיוחד.",
      path: "/forms/special-exam",
    },
    {
      title: "נוהל מצב אקדמי",
      description: "מידע על תנאי מעבר ומצב אקדמי.",
      path: "/forms/academic-status",
    },
    {
      title: "ועדת משמעת",
      description: "נהלים ומידע בנושא ועדות משמעת.",
      path: "/forms/discipline",
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col">
      <PageHeader title="נהלים וטפסים" buttonText="דף הבית" to="/home" />

      <main className="flex-1 flex justify-center mt-10">
        <div className="w-[760px] bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex gap-4 mb-8">
            <SearchBar placeholder="חיפוש טופס או נוהל..." />

            <PrimarySmallButton
              text="חיפוש"
              onClick={() => console.log("search clicked")}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {forms.map((form) => (
              <InfoCard
                key={form.title}
                title={form.title}
                description={form.description}
                buttonText="פתח"
                onClick={() => navigate(form.path)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}