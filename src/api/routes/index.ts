import * as Profile from "./profile";
import * as Sessions from "./sessions";
import * as Users from "./users";
import * as oAuth from "./oauth";
import * as Games from "./games";

const path: string = "/api/v1";

interface DefaultProps {
    list?: string;
    details: (id: number) => string;
}

interface ProfileProps {
    refresh: string;
    me: string;
    logout: string;
}

interface UsersProps {
    details: (login: string) => string;
    subscribe: (login: string) => string;
    games: (login: string) => string;
    jams: (login: string) => string;
    avatar: (login: string) => string;
}

interface oAuthProps {
    login: string;
    reg: string;
}

interface GamesProps {
    list: string;
    details: (id: number) => string;
    icon: (id: number) => string;
}

interface RoutesProps {
    sessions: DefaultProps;
    profile: ProfileProps;
    users: UsersProps;
    oauth: oAuthProps;
    games: GamesProps;
}

const Routes: RoutesProps = {
    sessions: {
        list: `${path}/sessions`,
        details: (id: number) => `${path}/sessions/${id}`
    },
    profile: {
        refresh: `${path}/refresh`,
        me: `${path}/me`,
        logout: `${path}/logout`
    },
    users: {
        details: (login: string) => `${path}/users/${login}`,
        subscribe: (login: string) => `${path}/users/${login}/subscribe`,
        games: (login: string) => `${path}/users/${login}/games`,
        jams: (login: string) => `${path}/users/${login}/jams`,
        avatar: (login: string) => `${path}/users/${login}/avatar`
    },
    oauth: {
        login: `${path}/oauth/login`,
        reg: `${path}/oauth/reg`
    },
    games: {
        list: `${path}/games`,
        details: (id: number) => `${path}/games/${id}`,
        icon: (id: number) => `${path}/games/${id}/icon`
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