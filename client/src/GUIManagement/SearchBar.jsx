export default function SearchBar(props) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      onKeyUp={props.onKeyUp}
      className="flex-1 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-xl px-4 py-3 outline-none focus:border-brand"
    />
  );
}
