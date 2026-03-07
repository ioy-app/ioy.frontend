import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface NotifyProps {
	id: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
}

const NotifyContext = createContext(null);
export const NotifyProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [stack, setStack] = useState<NotifyProps[] | null>(
		null,
	);

	const notify = (
		message: string,
		type: NotifyProps["type"] = "info",
	) => {
		const id: string = crypto.randomUUID();
		setStack((prev) => [
			...((prev && prev) || []),
			{
				id,
				message,
				type,
			},
		]);

		setTimeout(
			() =>
				setStack((prev) =>
					prev.filter((note) => note.id !== id),
				),
			1800,
		);
	};

	return (
		<NotifyContext.Provider value={{ notify }}>
			{children}
			<div className="flex z-255 fixed bottom-0 left-0 w-full h-full p-4 pointer-events-none flex-col-reverse items-start gap-2">
				<AnimatePresence>
					{stack?.map((note) => (
						<motion.div
							key={note.id}
							layout
							initial={{
								opacity: 0,
								y: 50,
							}}
							animate={{
								opacity: 1,
								y: 0,
							}}
							exit={{
								opacity: 0,
								y: 50,
							}}
							transition={{
								duration: 0.3,
							}}
							className={`notify notify-${note.type}`}
						>
							{note.message}
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</NotifyContext.Provider>
	);
};

const useNotify = () => useContext(NotifyContext);
export default useNotify;
