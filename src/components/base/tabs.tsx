import { AnimatePresence, motion } from "framer-motion";
import {
	ReactNode,
	useEffect,
	useState
} from "react";
import { useTranslation } from "react-i18next";
import { BiFolder } from "react-icons/bi";

export interface HeaderProps {
	label: React.ReactNode;
	value: string;
}

const Tabs: React.FC<{
	headers: HeaderProps[];
	content: Record<string, ReactNode>;
	onChange?: (tab: string) => void;
	value?: string;
}> = ({
	headers,
	content,
	onChange,
	value
}) => {
	const [ selectTab, setSelectTab ] = useState<HeaderProps | null>(headers[0]);
	const { t } = useTranslation();

	useEffect(() => {
		if (!headers)
			return;
		if (selectTab?.value == value || !value)
			return;

		setSelectTab(headers?.find?.(head => head?.value == value));
	}, [
		headers,
		value
	]);

	return (
		<div className="text-placeholder flex flex-col gap-4 w-full">
			<div className="flex flex-row items-center border-b border-b-br overflow-hidden overflow-x-auto no-scrollbar">
				{headers.map((header: HeaderProps, i: number) => (
					<div
						className={`px-4 py-2 select-none cursor-default rounded-t-xl ${(header?.value == selectTab?.value && "text-text bg-primary font-light") || "cursor-pointer"} transition-colors`}
						onClick={() => {
							setSelectTab(header);
							onChange && onChange?.(header?.value)
						}}
						key={i}
					>
						{header.label}
					</div>
				))}
			</div>
			<AnimatePresence mode="wait">
				<motion.div
					initial={{
						opacity: 0
					}}
					animate={{
						opacity: 1
					}}
					exit={{
						opacity: 0
					}}
					transition={{
						duration: .1,
						ease: "easeInOut"
					}} 
					key={selectTab?.value}
				>
					{(content &&
						content[(selectTab as HeaderProps)?.value]) || (
						<div className="w-full h-full flex-1 justify-center items-center gap-1 flex flex-col text-disabled">
							<BiFolder className="text-4xl" />
							<p className="text-placeholder">
								{t("tabs.nodata")}
							</p>
						</div>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default Tabs;
