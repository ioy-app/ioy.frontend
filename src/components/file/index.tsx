import "./styles.less";

const File: React.FC = ({
    label,
    placeholder,
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