/**
 * Component for select date
 * @example
 * return <DatePicker />
*/
const DatePicker: React.FC<{
  /** Change event */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Input name */
  name: string;
  /** Ref link */
  ref?: React.Ref<HTMLInputElement>;
  /** Value */
  value?: string;
}> = ({
  onChange,
  name,
  ref,
  value
}) => (
  <input
    ref={ref}
    name={name}
    value={value}
    onChange={onChange}
    className="flex gap-4 px-4 py-2 border border-br rounded-2xl appearance-none outline-none cursor-pointer text-text dark:scheme-dark"
    type="datetime-local"
  />
);

export default DatePicker;