export default function LabeledInput(props) {
  return (
    <div className="w-full mb-5">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {props.label}
      </label>

      <input
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        className="w-full border-b-2 border-slate-300 dark:border-slate-600 bg-transparent px-2 py-3 outline-none focus:border-brand text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
    </div>
  );
}
