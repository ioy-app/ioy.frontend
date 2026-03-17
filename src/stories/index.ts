import { configureStore } from "@reduxjs/toolkit";

import Login from "./login";

const Store = configureStore({
	reducer: {
		login: Login,
	},
});

export type StoreProps = ReturnType<typeof Store.getState>;
export const { dispatch } = Store;
export default Store;
