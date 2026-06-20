import PrimarySmallButton from "./PrimarySmallButton";

export default function InfoCard(props) {
  return (
    <div className="border border-slate-300 dark:border-slate-600 rounded-xl p-6 bg-white dark:bg-slate-800 hover:shadow-md transition">
      <h2 className="text-xl font-bold text-brand mb-3">
        {props.title}
      </h2>

      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {props.description}
      </p>

      {props.buttonText && (
        <PrimarySmallButton text={props.buttonText} onClick={props.onClick} />
      )}
    </div>
  );
}
