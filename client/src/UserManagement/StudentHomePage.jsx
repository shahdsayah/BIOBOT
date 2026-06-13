import { useNavigate } from "react-router-dom";

import { FaUser } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import CardButton from "../GUIManagement/CardButton";

import { getCurrentUser } from "../Services/authService";
import { logoutUser } from "../Services/authService";

import logo from "../assets/logo.jpg";


export default function StudentHomePage() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function loadStudent() {
      if (!auth.currentUser) return;

      const data = await getStudentProfile(auth.currentUser.uid);
      setStudent(data);
    }

    loadStudent();
  }, []);

  async function handleLogout() {
    await logoutUser();
    navigate("/login");
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col">
      <PageHeader
        title="עמוד הבית"
        buttonText="התנתק"
        onClick={handleLogout}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-10">
        <img
          src={logo}
          alt="BIOBOT Logo"
          className="w-36 h-36 rounded-full bg-white object-contain p-3 shadow-lg mb-6"
        />

        <h1 className="text-4xl font-extrabold text-[oklch(48.8%_0.243_264.376)] mb-3 text-center">
          שלום {student?.firstName || "סטודנט"} 👋
        </h1>

        <p className="text-slate-600 text-lg mb-12 text-center">
          ברוכים הבאים למערכת ביו-בוט
        </p>

        <div className="grid grid-cols-3 gap-8">
          <CardButton
            icon={<FaUser />}
            title="פרופיל אישי"
            description="צפייה בפרטים האישיים שלך"
            onClick={() => navigate("/profile")}
          />

          <CardButton
            icon={<FaRobot />}
            title="ביו-בוט"
            description="מעבר לצ׳אט האקדמי החכם"
            onClick={() => navigate("/chat")}
          />

          <CardButton
            icon={<FaFileAlt />}
            title="נהלים וטפסים"
            description="חיפוש טפסים ונהלים אקדמיים"
            onClick={() => navigate("/forms")}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}