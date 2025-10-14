import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCache, saveCache, clearCache } from "./localStorage";

const initialState = {
    token: getCache("token") || null,
    info: getCache("info") || {}
}

const authSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setLogin: (state, { payload }) => {
            state.info = payload;
            state.token = payload?.token;
            saveCache("token", state.token);
            saveCache("info", state.info);
        },
        clearLogin: (state) => {
            state.info = {};
            state.token = null;
            clearCache("token");
            clearCache("info");
        }
    }
});

export const { setLogin, clearLogin } = authSlice.actions;
export default authSlice.reducer;