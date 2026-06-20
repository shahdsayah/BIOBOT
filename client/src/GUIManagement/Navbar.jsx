import { Link } from "react-router-dom";
import logo from "../assets/hero.png";

export default function Navbar() {
  const menuItems = [
    { label: "עמוד הבית", path: "/home" },
    { label: "ביו־בוט", path: "/chat" },
    { label: "נהלים וטפסים", path: "/forms" },
    { label: "פרופיל", path: "/profile" },
  ];

  return (
    <header
      dir="rtl"
      className="h-16 bg-[oklch(48.8%_0.243_264.376)] text-white flex items-center justify-between px-8 shadow-md"
    >
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="BIOBOT Logo"
          className="w-10 h-10 rounded-full bg-white object-contain p-1"
        />
        <h1 className="text-xl font-bold">BIOBOT 2.0</h1>
      </div>

      <nav className="flex gap-4">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className="font-bold hover:underline">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}