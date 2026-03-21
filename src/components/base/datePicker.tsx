/**
 * Component for select date
 * @example
 * return <DatePicker />
*/
const DatePicker: React.FC<{}> = ({
  onChange,
  name,
  ref,
  value
}) => {
  return (
    <input
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      className="flex gap-4 px-4 py-2 border border-br rounded-2xl appearance-none outline-none cursor-pointer text-text dark:scheme-dark"
      type="datetime-local"
    />
  );
}

export default DatePicker;