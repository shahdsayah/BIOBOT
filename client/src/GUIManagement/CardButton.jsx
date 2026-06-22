export default function CardButton(props) {
  return (
    <div
      onClick={props.onClick}
      className="w-full min-h-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition flex flex-col justify-center items-center p-6 text-center"
    >
      {props.icon && (
        <div className="text-4xl text-brand mb-5">
          {props.icon}
        </div>
      )}

      <h2 className="text-2xl font-bold text-brand">
        {props.title}
      </h2>

      <p className="text-slate-500 dark:text-slate-400 mt-4">{props.description}</p>
    </div>
  );
}
