export default function PrimarySmallButton(props) {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className="bg-brand text-white px-6 py-2 rounded-md font-bold hover:opacity-90 transition"
    >
      {props.text}
    </button>
  );
}
