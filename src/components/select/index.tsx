import "./styles.less";

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
        <select className="wp_select" {...props}>
            {options && options?.map(((opt: Option, i: number) => (
                <option key={i} value={opt.value}>
                    {opt.label}
                </option>
            )))}
        </select>
    );
}

export default Select;