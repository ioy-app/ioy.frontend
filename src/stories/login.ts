import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profile_me } from "@/api/routes/profile";

interface initialStateProps {
    token: string | null,
    id: number | null,
    login: string | null,
    loading: boolean
}

export const fetchMe = createAsyncThunk(
  'login/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profile_me();
      console.log(response);
      if (!response.ok) throw new Error('errors.denied');
        const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'errors.unknown');
    }
  }
);

const initialState: initialStateProps = {
    token: null,
    id: null,
    login: null,
    loading: true
}

const authSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setLogin: (state, { payload }) => {
            state.id = payload?.id;
            state.token = payload?.token;
            state.login = payload?.login;
        },
        setToken: (state, { payload }) => {
            state.token = payload?.token;
            if (!state.token) {
                state.id = null;
                state.login = null;
            }
        },
        clearLogin: (state) => {
            state.id = null;
            state.token = null;
            state.login = null;
        },
        changeLogin: (state, { payload }) => {
            state.login = payload.login;
        },
        getMe: (state) => {
            (async () => {
                try {
                    const response = await profile_me();
                    if (!response.ok)
                        throw "errors.denied";
                    const json = await response.json();

                    state.id = json.id;
                    state.login = json.login;
                }
                catch(err) {
                    state.id = null;
                    state.token = null;
                    state.login = null;
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
            })
            .addCase(fetchMe.fulfilled, (state, { payload: { id, login }}) => {
                state.login = login;
                state.id = id;
                state.loading = false;
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.login = null;
                state.id = null;
                state.loading = false;
            });
    }
});

export const { setLogin, clearLogin, setToken, getMe, changeLogin } = authSlice.actions;
export default authSlice.reducer;