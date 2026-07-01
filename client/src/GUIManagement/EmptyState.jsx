/** @file EmptyState component — centered placeholder shown when a list has no items. */

/** Renders a centered icon, title, and description for empty list states.
 * @param {{ icon, title, description }} props
 */
export default function EmptyState({ icon = "📭", title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      <span className="text-5xl">{icon}</span>
      {title && (
        <p className="text-slate-700 dark:text-slate-200 font-semibold text-lg">{title}</p>
      )}
      {description && (
        <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs">{description}</p>
      )}
    </div>
  );
}
