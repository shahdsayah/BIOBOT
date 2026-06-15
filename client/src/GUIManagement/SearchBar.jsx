export default function SearchBar(props) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      onKeyUp={props.onKeyUp} //to support enter key to search :) 
      className="
        flex-1
        border
        border-slate-300
        rounded-xl
        px-4
        py-3
        outline-none
        focus:border-[oklch(48.8%_0.243_264.376)]
      "
    />
  );
}