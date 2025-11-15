import { createContext, useContext } from "react";
import useModal from "./modal";
import useNotify from "./notify";

const AppContext = createContext(null);
export const AppProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { modal } = useModal();
    const { notify } = useNotify();

    return (
        <AppContext.Provider value={{ modal, notify }}>
            {children}
        </AppContext.Provider>
    );
}

const useApp = () => useContext(AppContext);
export default useApp;