import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const cacheName = 'aHomePageContent';
import { cacheTime, getCache, saveCache } from "./localStorage";

export const fetchHomePageContent = createAsyncThunk(
    "HomePageContent/games",
    async (_, { getState }) => {
        const { HomePageContent } = getState();
        if (HomePageContent.games.timestamp && (Date.now() - HomePageContent.games.timestamp < cacheTime)) {
            console.log("Получение данных из кеша");
            return HomePageContent.games.items;
        }

        const cachedData = getCache(cacheName);
        if (cachedData) {
            console.log("Получение данных из кеша (localStorage)");
            return cachedData;
        }
        
        console.log("Получение новых данных");
        const response = await fetch("https://dummyjson.com/recipes").then(e => e.json());
        saveCache(cacheName, response.recipes);

        return response.recipes;
    }
)

const slice = createSlice({
    name: "HomePageContent",
    initialState: {
        games: {
            items: [],
            loading: false,
            error: null,
            timestamp: null
        }
    },
    reducers: {
        clearCache: (state) => {
            state.games.timestamp = null;
            state.games.items = [];
            try { localStorage.removeItem(cacheName); }
            catch(err) {
                console.error("Ошибка при очистке кеша:", e);
                state.games.error = "Ошибка при очистке кеша";
            } 
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHomePageContent.pending, (state) => {
            state.games.loading = true;
            state.games.error = null;
        })
        .addCase(fetchHomePageContent.fulfilled, (state, action) => {
            state.games.loading = false;
            state.games.items = action.payload;
            state.games.timestamp = Date.now();
        })
        .addCase(fetchHomePageContent.rejected, (state, action) => {
            state.games.loading = false;
            state.games.error = action.error.message;
        })
    }
});

export const { clearCache } = slice.actions;
export default slice.reducer;