export default function SmallButton(props) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="bg-white text-brand px-5 py-2 rounded-md font-bold hover:opacity-90 transition"
    >
      {props.text}
    </button>
  );
}
