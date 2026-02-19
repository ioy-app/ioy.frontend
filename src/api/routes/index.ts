import Store, { dispatch } from "@/stories";

import * as Profile from "./profile";
import * as Sessions from "./sessions";
import * as Users from "./users";
import * as oAuth from "./auth";
import * as Games from "./games";
import * as Comments from "./comments";
import * as Jams from "./jams";

import axios from "axios";
export const apiInstance = axios.create({
    withCredentials: true,
    baseURL: "/api/v1"
});

apiInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});

apiInstance.interceptors.response.use((config) => config?.data, async (err) => {
    if (err.response.status == 401) {
        const response = await apiInstance.get(Routes.profile.refresh);
        localStorage.setItem("token", response?.token);
    }
});

export const apiFileInstance = apiInstance;
apiFileInstance.interceptors.response.use((config) => config, async (err) => {
    console.log(err);
    if (err.response.status == 401) {
        try {
            const response = await apiInstance.get(Routes.profile.refresh);
            if (response?.token)
                localStorage.setItem("token", response?.token);
        }
        catch(err) {
            console.log("???", err);
        }
    }
});

const path: string = "";
const Routes = {
    sessions: {
        list: `/sessions`,
        details: (id: number) => `/sessions/${id}`
    },
    profile: {
        refresh: `/sessions/update`,
        me: `/auth/me`,
        logout: `/auth/logout`
    },
    users: {
        details: (login: string) => `/users/${login}`,
        subscribe: (login: string) => `/users/${login}/subscribe`,
        games: (login: string) => `/users/${login}/games`,
        jams: (login: string) => `/users/${login}/jams`,
        avatar: (login: string) => `/users/${login}/avatar`,
        subscribers: (login: string) => `/users/${login}/subscribers`,
        favorites: (login: string) => `/users/${login}/favorites`,
        likes: (login: string) => `/users/${login}/likes`,
        email: `/users/email`
    },
    auth: {
        login: `/auth/login`,
        reg: `/auth/reg`
    },
    games: {
        list: `/games`,
        details: (id: number) => `/games/${id}`,
        icon: (id: number) => `/games/${id}/icon`,
        subscribe: (id: number) => `/games/${id}/subscribe`,
        game: (id: number) => `/games/${id}/game`,
        like: (id: number) => `/games/${id}/like`,
        create: `/games/create`
    },
    dashboard: {
        games: `/games/my`
    },
    comments: {
        details: (id: number) => `/comments/${id}`,
        answers: (id: number, commentid: number) => `/comments/${id}/${commentid}`,
        create: (id: number) => `/comments/${id}`,
        reply: (id: number, commentid: number) => `/comments/${id}/${commentid}`,
        like: (id: number) => `/comments/${id}/like`
    },
    search: `/search`,
    jams: {
        list: `/jams`,
        details: (id: number) => `/jams/${id}`
    }
}



export default Routes;
export {
    Profile,
    Sessions,
    Users,
    oAuth,
    Games,
    Comments,
    Jams
}
