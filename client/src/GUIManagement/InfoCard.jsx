import PrimarySmallButton from "./PrimarySmallButton";

export default function InfoCard(props) {
return ( <div
   className="
     border
     border-slate-300
     rounded-xl
     p-6
     bg-white
     hover:shadow-md
     transition
   "
 > <h2
     className="
       text-xl
       font-bold
       text-[oklch(48.8%_0.243_264.376)]
       mb-3
     "
   >
{props.title} </h2>

  <p className="text-slate-600 mb-6">
    {props.description}
  </p>

  {props.buttonText && (
    <PrimarySmallButton
      text={props.buttonText}
      onClick={props.onClick}
    />
  )}
</div>

);
}
