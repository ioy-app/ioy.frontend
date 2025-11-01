import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./styles.less";

export interface NotifyProps {
    id: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
}

const NotifyContext = createContext(null);
export const NotifyProvider: React.FC = ({
    children
} : {
    children: React.ReactElement;
}) => {
    const [ stack, setStack ] = useState<NotifyProps[] | null>(null);

    const notify = (message: string, type: NotifyProps["type"] = "info") => {
        const id: string = crypto.randomUUID();
        setStack(prev => [ ...(prev && prev || []), {
            id,
            message,
            type
        }]);

        setTimeout(() => {
            setStack(prev => prev.filter(note => note.id !== id));
        }, 3000);
    }

    return (
        <NotifyContext.Provider value={{ notify }}>
            {children}
            <div className="wp_notifies">
                <AnimatePresence>
                    {stack?.map(note => (
                        <motion.div
                            key={note.id}
                            layout
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.3 }}
                            className={`wp_notifies__notify ${note.type}`}
                        >
                        {note.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotifyContext.Provider>
    );
}

const useNotify = () => useContext(NotifyContext);
export default useNotify;