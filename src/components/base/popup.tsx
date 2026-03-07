import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/**
 * Helpers popup
 * @example
 * return <Popup />
 */
const Popup: React.FC<{
	children: React.ReactNode;
	align?: "l" | "r" | "t" | "b";
	label: string;
}> = ({ children, align = "b", label }) => {
	const [isHover, setHover] = useState<boolean>(false);

	let left,
		top,
		items = "center";
	switch (align) {
		case "l":
			left = "right-full mr-2";
			top = "";
			break;
		case "b":
			left = "right-0";
			top = "top-full mt-2";
			items = "end";
			break;
	}

	return (
		<div
			className={`relative flex ${(items && "items-" + items) || ""}`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			{children}
			<AnimatePresence mode="wait">
				<motion.div
					key={label}
					className={`absolute ${(left && left) || ""} ${(top && top) || ""} pointer-events-none w-fit px-4 py-0 border border-br bg-back rounded-full text-placeholder shadow-2xs z-50 text-nowrap`}
					variants={{
						show: {
							opacity: 1,
							y: 0,
						},
						hide: {
							opacity: 0,
							y: 10,
						},
					}}
					animate={isHover ? "show" : "hide"}
					exit={{
						opacity: 0,
					}}
					transition={{
						delay: 0.125,
						duration: 0.125,
					}}
				>
					{label}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default Popup;
