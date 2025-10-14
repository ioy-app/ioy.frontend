import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const cacheName = 'aStories';
import { cacheTime, getCache, saveCache } from "./localStorage";

export const fetchStories = createAsyncThunk(
    "Stories/posts",
    async (_, { getState }) => {
        const { Stories } = getState();
        if (Stories.timestamp && (Date.now() - Stories.timestamp < cacheTime)) {
            console.log("Получение данных из кеша");
            return Stories.items;
        }

        const cachedData = getCache(cacheName);
        if (cachedData) {
            console.log("Получение данных из кеша (localStorage)");
            return cachedData;
        }
        
        console.log("Получение новых данных");
        const response = await fetch("https://dummyjson.com/posts").then(e => e.json());
        saveCache(cacheName, response.posts);

        return response.posts;
    }
)

const slice = createSlice({
    name: "Stories",
    initialState: {
        Stories: {
            items: [],
            loading: false,
            error: null,
            timestamp: null
        }
    },
    reducers: {
        clearCache: (state) => {
            state.Stories.timestamp = null;
            state.Stories.items = [];
            try { localStorage.removeItem(cacheName); }
            catch(err) {
                console.error("Ошибка при очистке кеша:", e);
                state.Stories.error = "Ошибка при очистке кеша";
            } 
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchStories.pending, (state) => {
            state.Stories.loading = true;
            state.Stories.error = null;
        })
        .addCase(fetchStories.fulfilled, (state, action) => {
            state.Stories.loading = false;
            state.Stories.items = action.payload;
            state.Stories.timestamp = Date.now();
        })
        .addCase(fetchStories.rejected, (state, action) => {
            state.Stories.loading = false;
            state.Stories.error = action.error.message;
        })
    }
});

export const { clearCache } = slice.actions;
export default slice.reducer;