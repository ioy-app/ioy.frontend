import { BiChevronDown } from "react-icons/bi";

interface Option {
    label: React.ReactNode;
    value: string;
}

type SelectComponentProps = { options: Option[] } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children">;


const Select: React.FC<SelectComponentProps> = ({
    options,
    ...props
}) => {
    return (
        <label className="px-4 py-2 rounded-xl border border-br text-default h-10 flex flex-row gap-2 items-center cursor-pointer">
            <select
                className="appearance-none outline-none"
                {...props}
            >
                {options && options?.map(((opt: Option, i: number) => (
                    <option key={i} value={opt.value}>
                        {opt.label}
                    </option>
                )))}
            </select>
            <BiChevronDown className="text-2xl" />
        </label>
    );
}

export default Select;