const Input: React.FC<{
	/** Label's className */
	className?: string;
	/** Input's className  */
	classNameChild?: string;
	/** Name */
	name: string;
	/** Label */
	label?: string;
	/** Input's type */
	type?: "text" | "password" | "search" | "email";
	/** Placeholder */
	placeholder?: string;
	/** Disabled */
	disabled?: boolean;
	/** Local change event */
	onLocalChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/** Form event change. Work only without onLocalChange! */
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/** Form event press any keys */
	onKeyPress?: (
		e: React.KeyboardEvent<HTMLInputElement> &
			React.ChangeEvent<HTMLInputElement>,
	) => void;
}> = ({
	className,
	classNameChild,
	label,
	type = "text",
	placeholder,
	disabled,
	name,
	onLocalChange,
	...props
}) => (
	<label
		className={`box-border border border-br w-full rounded-xl px-4 py-2 has-focus:border-primary has-focus:text-primary transition-colors ${(className && className) || ""} ${(!label && "h-10 px-0 py-0 flex flex-row items-center") || ""}`}
	>
		{label && <p className="text-placeholder transition-colors">{label}</p>}
		<input
			name={name}
			type={type}
			placeholder={placeholder}
			disabled={disabled}
			className={`outline-none text-default w-full transition-colors ${(classNameChild && classNameChild) || ""} ${(!label && "px-0 py-2 h-full") || ""}`}
			{...props}
			onChange={(e) => {
				onLocalChange && onLocalChange(e);
				props?.onChange && !onLocalChange && props.onChange(e);
			}}
		/>
	</label>
);

export default Input;
