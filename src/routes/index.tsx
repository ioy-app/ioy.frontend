import { RouteObject } from "react-router-dom";
import { Home } from "@/pages";

import games, { games_paths } from "./games";
import user, { user_paths } from "./user";
import dashboard, { dashboard_paths } from "./dashboard";

const routes: RouteObject[] = [
    {
        index: true,
        element: <Home />
    },
    ...user,
    ...games,
    ...dashboard
];

export const paths = {
    users: user_paths,
    games: games_paths,
    dashboard: dashboard_paths
}

export default routes;