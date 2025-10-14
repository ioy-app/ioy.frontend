import { configureStore } from "@reduxjs/toolkit";

import HomePageContent from "./HomePageContent";
import Stories from "./Stories";
import Login from "./login";

const Store = configureStore({
    reducer: {
        HomePageContent: HomePageContent,
        Stories: Stories,
        login: Login
    }
})

export default Store;