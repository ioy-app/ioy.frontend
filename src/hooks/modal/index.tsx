import { createContext, useContext, useState, ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./styles.less";

export interface ModalProps {
    id: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    footer?: () => React.ReactNode;
}

const ModalContext = createContext(null);
export const ModalProvider: React.FC = ({
    children
} : {
    children: React.ReactElement;
}) => {
    const [ stack, setStack ] = useState<ModalProps[] | null>(null);

    const modal = (message: string, type: ModalProps["type"] = "info", footer: () => React.ReactNode) => {
        const id: string = crypto.randomUUID();
        document.body.style.overflow = "hidden";
        setStack(prev => [ ...(prev && prev || []), {
            id,
            message,
            type,
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
                    {stack?.map(note => (
                        <motion.div
                            key={note.id}
                            layout
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.25 }}
                            transition={{ duration: 0.3 }}
                            className={`wp_modals__modal modal_${note.type}`}
                        >
                            {typeof(note.message) == "string" ? note.message : <note.message {...note} onClose={() => {
                                document.body.style.overflow = "";
                                setStack(prev => prev.filter(tnote => note.id !== tnote.id));
                            }}/>}
                            <div className="wp_modals__modal_footer">
                                {note.footer(() => {
                                    document.body.style.overflow = "";
                                    setStack(prev => prev.filter(tnote => note.id !== tnote.id));
                                })}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ModalContext.Provider>
    );
}

const useModal = () => useContext(ModalContext);
export default useModal;