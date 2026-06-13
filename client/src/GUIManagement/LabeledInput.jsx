export default function LabeledInput(props) {
  return (
    <div className="w-full mb-5">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {props.label}
      </label>

      <input
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        className="w-full border-b-2 border-slate-300 px-2 py-3 outline-none focus:border-[oklch(48.8%_0.243_264.376)]"
      />
    </div>
  );
}