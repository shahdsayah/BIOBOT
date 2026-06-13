export default function CardButton(props) {
  return (
    <div
      onClick={props.onClick}
      className="w-72 h-56 bg-white rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition flex flex-col justify-center items-center p-6 text-center"
    >
      {props.icon && (
        <div className="text-4xl text-[oklch(48.8%_0.243_264.376)] mb-5">
          {props.icon}
        </div>
      )}

      <h2 className="text-2xl font-bold text-[oklch(48.8%_0.243_264.376)]">
        {props.title}
      </h2>

      <p className="text-slate-500 mt-4">{props.description}</p>
    </div>
  );
}