const Button: React.FC<{
	/** Button's content */
	children: React.ReactNode;
	/** Disabled button */
	disabled?: boolean;
	/** Button's form type */
	htmlType?: HTMLButtonElement["type"];
	/** onClick event */
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	/** Button's type */
	variant?:
		| "default"
		| "primary"
		| "second"
		| "danger"
		| "text"
		| "clear";
	/** Button's classes */
	className?: string;
	/** Loading state */
	loading?: boolean;
}> = ({
	children,
	disabled,
	htmlType = "button",
	onClick,
	variant = "default",
	className,
	loading,
}) => (
	<button
		className={`button button-${variant} text-default ${(className && className) || ""} ${(loading && "animate-pulse") || ""}`}
		disabled={disabled}
		type={htmlType}
		onClick={onClick}
	>
		{children && children}
	</button>
);

export default Button;
