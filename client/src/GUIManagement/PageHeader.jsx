import { useNavigate } from "react-router-dom";
import SmallButton from "./SmallButton";

export default function PageHeader(props) {
  const navigate = useNavigate();

  function handleClick() {
    if (props.onClick) {
      props.onClick();
    } else {
      navigate(props.to || "/home");
    }
  }

  return (
    <header
      dir="rtl"
      className="h-16 bg-[oklch(48.8%_0.243_264.376)] text-white flex items-center justify-between px-8 shadow-md"
    >
      <h1 className="text-xl font-bold">{props.title}</h1>

      {props.buttonText && (
        <SmallButton
          text={props.buttonText}
          onClick={handleClick}
        />
      )}
    </header>
  );
}