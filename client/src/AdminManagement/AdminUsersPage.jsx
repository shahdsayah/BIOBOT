
import { FaUsers, FaUserShield } from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";

export default function AdminUsersPage() {
  const users = [
    {
      id: 1,
      firstName: "שהד",
      lastName: "אבו סיאח",
      email: "shahd@test.com",
      role: "student",
    },
    {
      id: 2,
      firstName: "מנהל",
      lastName: "מערכת",
      email: "admin@test.com",
      role: "admin",
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col">
      <PageHeader title="ניהול משתמשים" buttonText="לוח ניהול" to="/admin" />

      <main className="flex-1 p-8">
        <div className="max-w-[1000px] mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <FaUsers className="text-4xl text-[oklch(48.8%_0.243_264.376)]" />

            <div>
              <h1 className="text-3xl font-bold text-[oklch(48.8%_0.243_264.376)]">
                משתמשים במערכת
              </h1>
              <p className="text-slate-500">
                צפייה במשתמשים והרשאות במערכת
              </p>
            </div>
          </div>

          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b text-slate-600">
                <th className="py-3">שם</th>
                <th className="py-3">אימייל</th>
                <th className="py-3">תפקיד</th>
                <th className="py-3">פעולות</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-4 font-bold">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="py-4">{user.email}</td>

                  <td className="py-4">
                    <span className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm">
                      <FaUserShield />
                      {user.role}
                    </span>
                  </td>

                  <td className="py-4">
                    <PrimarySmallButton text="שינוי הרשאה" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}