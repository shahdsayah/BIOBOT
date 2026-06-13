export default function PrimarySmallButton(props) {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className="bg-[oklch(48.8%_0.243_264.376)] text-white px-6 py-2 rounded-md font-bold hover:opacity-90 transition"
    >
      {props.text}
    </button>
  );
}