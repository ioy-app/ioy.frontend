const Textarea: React.FC<{
	/** Textarea's className */
	className?: string;
	/** Textarea's className  */
	classNameChild?: string;
	/** Name */
	name: string;
	/** Label */
	label?: string;
	/** Placeholder */
	placeholder?: string;
	/** Disabled */
	disabled?: boolean;
	/** Local change event */
	onLocalChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	/** Form event change. Work only without onLocalChange! */
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({
	className,
	classNameChild,
	label,
	placeholder,
	disabled,
	name,
	onLocalChange,
	...props
}) => (
	<label
		className={`border border-br w-full rounded-xl px-4 py-2 has-focus:border-primary has-focus:text-primary transition-colors ${(className && className) || ""}`}
	>
		{label && <p className="text-placeholder transition-colors">{label}</p>}
		<textarea
			name={name}
			placeholder={placeholder}
			disabled={disabled}
			className={`outline-none text-default w-full transition-colors h-25 resize-none ${(classNameChild && classNameChild) || ""}`}
			{...props}
			onChange={(e) => {
				onLocalChange && onLocalChange(e);
				props?.onChange && !onLocalChange && props.onChange(e);
			}}
		/>
	</label>
);

export default Textarea;
