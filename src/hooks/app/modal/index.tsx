import { createContext, useContext, useState, ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./styles.less";

export interface ModalProps {
    id: string;
    message?: React.FC<ModalProps> | string;
    footer?: (callback: () => void) => React.ReactNode;
    onClose?: () => void;
}

const ModalContext = createContext(null);
export const ModalProvider: React.FC<{ children?: React.ReactNode; }> = ({ children }) => {
    const [ stack, setStack ] = useState<ModalProps[] | null>(null);

    const modal = (message: string | React.FC<ModalProps>, footer: () => React.ReactNode) => {
        const id: string = crypto.randomUUID();
        document.body.style.overflow = "hidden";
        setStack(prev => [ ...(prev && prev || []), {
            id,
            message,
            footer
        }]);
    }

    return (
        <ModalContext.Provider value={{ modal }}>
            {children}
            <div
                className={`wp_modals ${stack?.length > 0 && "wp_modals__show" || ""}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        document.body.style.overflow = "";
                        setStack(null);
                    }
                }}
            >
                <AnimatePresence>
                    {stack?.map(({ id, message: Message, footer }: ModalProps) => {
                        const onClose = () => {
                            document.body.style.overflow = "";
                            setStack(prev => prev.filter((note: ModalProps) => id !== note.id));
                        }

                        return (
                            <motion.div
                                key={id}
                                layout
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.25 }}
                                transition={{ duration: 0.3 }}
                                className={`wp_modals__modal modal`}
                            >
                                {typeof Message == "string" ? Message : <Message id={id} onClose={onClose} />}
                                <div className="wp_modals__modal_footer">{footer(onClose)}</div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ModalContext.Provider>
    );
}

const useModal = () => useContext(ModalContext);
export default useModal;