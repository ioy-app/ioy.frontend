import * as Profile from "./profile";
import * as Sessions from "./sessions";
import * as Users from "./users";
import * as oAuth from "./auth";
import * as Games from "./games";

const path: string = "/api/v1";
const Routes = {
    sessions: {
        list: `${path}/sessions`,
        details: (id: number) => `${path}/sessions/${id}`
    },
    profile: {
        refresh: `${path}/sessions/update`,
        me: `${path}/auth/me`,
        logout: `${path}/auth/logout`
    },
    users: {
        details: (login: string) => `${path}/users/${login}`,
        subscribe: (login: string) => `${path}/users/${login}/subscribe`,
        games: (login: string) => `${path}/users/${login}/games`,
        jams: (login: string) => `${path}/users/${login}/jams`,
        avatar: (login: string) => `${path}/users/${login}/avatar`,
        subscribers: (login: string) => `${path}/users/${login}/subscribers`,
        favorites: (login: string) => `${path}/users/${login}/favorites`,
        likes: (login: string) => `${path}/users/${login}/likes`
    },
    auth: {
        login: `${path}/auth/login`,
        reg: `${path}/auth/reg`
    },
    games: {
        list: `${path}/games`,
        details: (id: number) => `${path}/games/${id}`,
        icon: (id: number) => `${path}/games/${id}/icon`,
        subscribe: (id: number) => `${path}/games/${id}/subscribe`,
        game: (id: number) => `${path}/games/${id}/game`,
        like: (id: number) => `${path}/games/${id}/like`
    }
}



export default Routes;
export {
    Profile,
    Sessions,
    Users,
    oAuth,
    Games
}