/** @file Shared white/dark card shell used to wrap page sections (admin panels, forms). */

export default function SectionCard({ as: Tag = "div", className = "", children }) {
  return (
    <Tag className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 ${className}`}>
      {children}
    </Tag>
  );
}
