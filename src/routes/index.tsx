import { RouteObject } from "react-router-dom";
import { Home, About } from "@/pages";

import games, { games_paths } from "./games";
import user, { user_paths } from "./user";
import dashboard, { dashboard_paths } from "./dashboard";
import Jams from "@/pages/home/pages/jams";
import Games from "@/pages/home/pages/games";

const routes: RouteObject[] = [
    {
        path: "/",
        Component: Home,
        children: [
            {
                index: true,
                element: <Games />
            },
            {
                path: "/jams",
                element: <Jams />
            }
        ]
    },
    {
        path: "/about",
        element: <About />
    },
    ...user,
    ...games,
    ...dashboard
];

export const paths = {
    users: user_paths,
    games: games_paths,
    dashboard: dashboard_paths,
    search: "/",
    about: "/about"
}

export default routes;