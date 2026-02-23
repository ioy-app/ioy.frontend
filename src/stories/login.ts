import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profile_me } from "@/api/routes/profile";

interface initialStateProps {
    token: string | null;
    id: number | null;
    login: string | null;
    loading: boolean;
    is_avatar?: boolean;
}

export const fetchMe = createAsyncThunk(
  'login/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profile_me();
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'errors.unknown');
    }
  }
);

const initialState: initialStateProps = {
    token: localStorage.getItem("token"),
    id: null,
    login: null,
    loading: true,
    is_avatar: false
}

const authSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setLogin: (state, { payload }) => {
            state.id = payload?.id;
            state.token = payload?.token;
            state.login = payload?.login;
            state.is_avatar = payload?.is_avatar;
            localStorage.setItem("token", payload?.token);
        },
        setToken: (state, { payload }) => {
            state.token = payload?.token;
            if (!state.token) {
                state.id = null;
                state.login = null;
                state.is_avatar = false;
            }
        },
        clearLogin: (state) => {
            state.id = null;
            state.token = null;
            state.login = null;
            state.is_avatar = false;
        },
        changeLogin: (state, { payload }) => {
            state.login = payload.login;
        },
        getMe: (state) => {
            (async () => {
                try {
                    const response = await profile_me();
                    state.id = response.id;
                    state.login = response.login;
                    state.is_avatar = response?.is_avatar;
                }
                catch(err) {
                    state.id = null;
                    state.token = null;
                    state.login = null;
                    state.is_avatar = false;
                }
            })();
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchMe.pending, state => {
                state.loading = true;
                state.login = null;
                state.id = null;
                state.is_avatar = false;
            })
            .addCase(fetchMe.fulfilled, (state, { payload: { id, login, is_avatar }}) => {
                state.login = login;
                state.id = id;
                state.loading = false;
                state.is_avatar = is_avatar;
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.login = null;
                state.id = null;
                state.loading = false;
                state.is_avatar = false;
            });
    }
});

export const { setLogin, clearLogin, setToken, getMe, changeLogin } = authSlice.actions;
export default authSlice.reducer;