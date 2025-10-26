import { configureStore } from "@reduxjs/toolkit";

import Stories from "./Stories";
import Login from "./login";

const Store = configureStore({
    reducer: {
        Stories: Stories,
        login: Login
    }
})

export type StoreProps = ReturnType<typeof Store.getState>;
export const { dispatch } = Store;
export default Store;