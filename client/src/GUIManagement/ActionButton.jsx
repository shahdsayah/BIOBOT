export default function ActionButton(props) {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className="w-full bg-[oklch(48.8%_0.243_264.376)] text-white py-3 font-bold rounded-md hover:opacity-90 transition"
    >
      {props.text}
    </button>
  );
}