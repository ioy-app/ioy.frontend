import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface ModalProps {
	id: string;
	message?: React.FC<ModalProps> | string;
	footer?: (callback: () => void) => React.ReactNode;
	onClose?: () => void;
}

const ModalContext = createContext(null);
export const ModalProvider: React.FC<{ children?: React.ReactNode }> = ({
	children,
}) => {
	const [stack, setStack] = useState<ModalProps[] | null>(null);

	const modal = (
		message: string | React.FC<ModalProps>,
		footer: () => React.ReactNode,
	) => {
		const id: string = crypto.randomUUID();
		document.body.style.overflow = "hidden";
		setStack((prev) => [
			...((prev && prev) || []),
			{
				id,
				message,
				footer,
			},
		]);
	};

	return (
		<ModalContext.Provider value={{ modal }}>
			{children}
			<AnimatePresence>
				{stack?.map((prop, i) => {
					const { id, message: Message, footer } = prop;
					const onClose = () => {
						if (i == 0) document.body.style.overflow = "";
						setStack((prev) =>
							prev.filter((note: ModalProps) => id !== note.id),
						);
					};

					return (
						<div
							className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#000000cc] z-250 px-4 py-8"
							key={`modal-${i}`}
							onClick={(e) => {
								if (e.target === e.currentTarget) {
									if (i == 0) document.body.style.overflow = "";
									setStack((prev) => prev?.filter((stack) => stack != prop));
								}
							}}
						>
							<motion.div
								key={id}
								layout
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.25 }}
								transition={{ duration: 0.3 }}
								className="bg-back text-text w-full max-h-full md:h-fit md:w-2xl rounded-2xl p-4 overflow-x-hidden overflow-y-auto"
							>
								{typeof Message == "string" ? (
									Message
								) : (
									<Message id={id} onClose={onClose} />
								)}
								<div className="flex flex-row w-full gap-4 justify-end items-center">
									{typeof footer != "function"
										? footer
										: footer(onClose) || null}
								</div>
							</motion.div>
						</div>
					);
				})}
			</AnimatePresence>
		</ModalContext.Provider>
	);
};

const useModal = () => useContext(ModalContext);
export default useModal;
