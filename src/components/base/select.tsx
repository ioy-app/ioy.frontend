import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	BiChevronDown,
	BiChevronUp,
	BiFileBlank,
} from "react-icons/bi";

interface Option {
	label: React.ReactNode;
	value: string;
}

type SelectComponentProps = {
	options: Option[];
} & Omit<
	React.SelectHTMLAttributes<HTMLSelectElement>,
	"children"
>;

const Select: React.FC<SelectComponentProps> = ({
	name,
	options,
	value,
	onChange,
	placeholder,
	className,
	ref,
	isFirstOption,
	align = "bottom",
	disabled,
}) => {
	const { t } = useTranslation();
	const [isOpen, setOpen] = useState<boolean>(false);
	const [localValue, setValue] = useState<unknown>(value);
	const localRef = useRef(null);

	useEffect(() => {
		const value = localRef?.current?.value;
		if (!value) return;

		const option = options?.find(
			(opt) => opt.value == value,
		);
		setValue(option);
	}, [localRef?.current]);

	useEffect(() => {
		if (isFirstOption) {
			onChange &&
				onChange({
					target: {
						name: name,
						value: option?.[0]?.value,
					},
				});
			setValue(options?.[0]);
		}
	}, []);

	return (
		<div
			className="flex flex-col gap-2 relative select-none"
			ref={(e) => {
				ref && ref(e);
				localRef.current = e;
			}}
			onMouseLeave={() => setOpen(false)}
		>
			<div
				className={`rounded-xl border ${(isOpen && "border-primary") || "border-br"} text-default h-10 flex flex-row gap-2 items-center justify-between px-4 py-2 ${className && className} transition-colors ${(disabled && "hover:border-disabled border-disabled cursor-not-allowed text-disabled-content") || "hover:border-primary cursor-pointer group"}`}
				onClick={() =>
					!disabled && setOpen((prev) => !prev)
				}
			>
				{(localValue || placeholder) && (
					<p className="overflow-hidden truncate ...">
						{localValue?.label || placeholder}
					</p>
				)}
				{!isOpen ? (
					<BiChevronDown className="text-2xl text-br group-hover:text-primary" />
				) : (
					<BiChevronUp className="text-2xl text-primary" />
				)}
			</div>
			{isOpen && (
				<div
					className={`absolute w-full flex flex-col gap-4 px-4 py-2 rounded-xl border border-br bg-back z-1 ${(align == "bottom" && "top-full") || "bottom-full"} w-fit shadow-md right-0`}
				>
					{!options?.length && (
						<div className="flex flex-1 flex-col justify-center items-center p-4">
							<BiFileBlank className="text-2xl text-disabled-content" />
							<p className="text-center text-placeholder">
								{t("select.nodata")}
							</p>
						</div>
					)}
					{options?.map((option: Option, i: number) => (
						<div
							className={`group cursor-pointer text-default transition-colors ${(option.value == localValue?.value && "text-primary") || "text-text"}`}
							key={i}
							onClick={() => {
								setValue(option);
								setOpen(false);
								onChange &&
									onChange({
										target: {
											name: name,
											value: option.value,
										},
									});
							}}
						>
							<p className="group-hover:text-primary overflow-hidden truncate ...">
								{option.label}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Select;
