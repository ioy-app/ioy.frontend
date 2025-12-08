import "./styles.less";

const File: React.FC<{
    label?: string,
    name: string;
    ref?: any;
    onChange?: (event: any) => void;
    accept?: string;
    value?: any;
}> = ({
    label,
    name,
    ref,
    onChange,
    accept,
    value
}) => {
    return (
        <label className="inputfile_label">
            {label && <p className="inputfile_label__title">{label}:</p>}
            <input
                accept={accept}
                type="file"
                className="inputfile_label__input"
                value={value}
                name={name}
                ref={ref}
                onChange={onChange}
            />
        </label>
    )
}

export default File;