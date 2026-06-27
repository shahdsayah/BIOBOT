import { useEffect, useState } from "react";
import { FaUsers, FaUserShield, FaUserGraduate } from "react-icons/fa";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import SearchBar from "../GUIManagement/SearchBar";

import {
  getCurrentUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../Services/authService";
import { useLanguage } from "../contexts/languageContext";

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = getCurrentUser();

  async function loadUsers() {
    try {
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleChangeRole(user) {
    const newRole = user.role === "admin" ? "student" : "admin";
    const confirmChange = window.confirm(
      t("adminUsersConfirmRole", { name: `${user.firstName} ${user.lastName}`, role: newRole })
    );
    if (!confirmChange) return;

    try {
      setError("");
      await updateUser(user._id, { role: newRole });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteUser(user) {
    if (currentUser?._id === user._id) {
      alert(t("adminUsersCannotDeleteSelf"));
      return;
    }

    const confirmDelete = window.confirm(
      t("adminUsersConfirmDelete", { name: `${user.firstName} ${user.lastName}` })
    );
    if (!confirmDelete) return;

    try {
      setError("");
      await deleteUser(user._id);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  const admins = users.filter((user) => user.role === "admin");

  const students = users
    .filter((user) => user.role === "student")
    .filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`;
      const email = user.email || "";
      return (
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortType === "name")
        return `${a.firstName || ""} ${a.lastName || ""}`.localeCompare(
          `${b.firstName || ""} ${b.lastName || ""}`, "he"
        );
      if (sortType === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortType === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  function renderUserCard(user, icon, roleLabel) {
    return (
      <div
        key={user._id}
        className="border border-slate-200 dark:border-slate-500 rounded-xl p-4 flex items-center justify-between gap-4"
      >
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            {user.firstName} {user.lastName}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-200">{user.email}</p>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {t("adminUsersCreatedAt")}{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("he-IL")
              : t("adminUsersNotAvailable")}
          </p>

          <span className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-sm mt-3">
            {icon}
            {roleLabel}
          </span>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleChangeRole(user)}
            className="bg-brand text-white px-4 py-2 rounded-md font-bold hover:opacity-90 transition"
          >
            {t("adminUsersChangeRole")}
          </button>

          <button
            type="button"
            onClick={() => handleDeleteUser(user)}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:opacity-90 transition"
          >
            {t("adminUsersDeleteBtn")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <PageHeader title={t("adminUsersTitle")} buttonText={t("adminUsersBack")} to="/admin" showLanguageToggle />

      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-[1250px] mx-auto">
          {loading && (
            <p className="text-slate-500 dark:text-slate-200 text-center">{t("adminUsersLoading")}</p>
          )}

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FaUserGraduate className="text-4xl text-brand" />
                  <div>
                    <h1 className="text-3xl font-bold text-brand">
                      {t("adminUsersStudentsTitle")}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-200">
                      {t("adminUsersStudentsDesc")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <SearchBar
                    placeholder={t("adminUsersSearchPlaceholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="border border-slate-300 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200 rounded-xl px-4 py-2 outline-none"
                  >
                    <option value="newest">{t("adminUsersSortNewest")}</option>
                    <option value="oldest">{t("adminUsersSortOldest")}</option>
                    <option value="name">{t("adminUsersSortName")}</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {students.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-200">{t("adminUsersNoStudents")}</p>
                  ) : (
                    students.map((user) => renderUserCard(user, <FaUserGraduate />, "student"))
                  )}
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FaUsers className="text-4xl text-brand" />
                  <div>
                    <h1 className="text-3xl font-bold text-brand">
                      {t("adminUsersAdminsTitle")}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-200">
                      {t("adminUsersAdminsDesc")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {admins.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-200">{t("adminUsersNoAdmins")}</p>
                  ) : (
                    admins.map((user) => renderUserCard(user, <FaUserShield />, "admin"))
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
