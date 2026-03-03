import { RouteObject } from "react-router-dom";
import { Home, About } from "@/pages";

import games, { games_paths } from "./games";
import user, { user_paths } from "./user";
import dashboard, { dashboard_paths } from "./dashboard";
import Jams from "@/pages/home/pages/jams";
import Games from "@/pages/home/pages/games";
import jams, { jams_paths } from "./jams";

export const paths = {
    users: user_paths,
    games: games_paths,
    dashboard: dashboard_paths,
    search: "/",
    about: "/about",
    terms: "/terms",
    jams: jams_paths
}

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
                path: jams_paths.list,
                element: <Jams />
            }
        ]
    },
    {
        path: paths.about,
        element: <About />
    },
    ...user,
    ...games,
    ...dashboard,
    ...jams
];

export default routes;