import dayjs from "dayjs";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Button from "./button";
import { BiCalendarAlt } from "react-icons/bi";
import { RefCallBack } from "react-hook-form";

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
  ref?: RefCallBack;
  /** Value */
  value?: string;
  /** DatePicker with time */
  hasTime?: boolean;
  /** Disabled */
  disabled?: boolean;
}> = ({
  onChange,
  name,
  ref,
  value,
  hasTime,
  disabled
}) => {
  const localRef = useRef(null);
  const [ localValue, setValue ] = useState<string | null>(value);
  const [ isActive, setActive ] = useState<boolean>(false);

  useEffect(() => { setValue(value); }, [ value ]);

  const parseValue = useMemo(() => {
    const _date = dayjs(localValue);
    if (!_date || !_date?.isValid())
      return null;

    return _date.format(hasTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD");
  }, [ localValue, hasTime ]);

  const drawValue = useMemo(() => {
    const _date = dayjs(parseValue);
    if (!_date || !_date?.isValid())
      return hasTime ? "--:-- DD.MM.YYYY" : "DD.MM.YYYY";

    return _date.format(hasTime ? "HH:mm DD.MM.YYYY" : "DD.MM.YYYY");
  }, [ parseValue ]);

  const setRef = useCallback((node) => {
    ref && ref(node);
    localRef.current = node;
  }, []);

  return (
    <label className={`group transition-colors relative flex items-center gap-4 px-4 py-2 border border-br rounded-2xl appearance-none outline-none cursor-pointer text-text dark:scheme-dark ${disabled && "border-disabled text-disabled-content cursor-not-allowed" || "hover:border-primary"} ${isActive && "border-primary" || ""}`}>
      <p className={`text-placeholder transition-colors select-none ${disabled && "text-disabled-content cursor-not-allowed" || "group-hover:text-primary"}`}>{drawValue}</p>
      <Button
        variant="text"
        className={`${disabled && "text-disabled-content" || "group-hover:text-primary"} ${isActive && "text-primary" || ""}`}
        onClick={() => {
          if (!localRef?.current || disabled)
            return;

          localRef.current.showPicker();
          localRef.current.focus();
          setActive(true);
        }}
        disabled={disabled}
      >
        <BiCalendarAlt />
      </Button>
      <input
        ref={setRef}
        name={name}
        value={parseValue}
        onChange={(event) => {
          setValue(event?.target?.value || null);
          onChange && onChange(event);
        }}
        onBlur={() => setActive(false)}
        className="opacity-0 absolute bottom-0 left-0 -z-1"
        type={hasTime ? "datetime-local" : "date"}
        disabled={disabled}
      />
    </label>
  );
}

export default DatePicker;