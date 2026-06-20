export default function SmallButton(props) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="bg-white text-[oklch(48.8%_0.243_264.376)] px-5 py-2 rounded-md font-bold hover:opacity-90 transition"
    >
      {props.text}
    </button>
  );
}