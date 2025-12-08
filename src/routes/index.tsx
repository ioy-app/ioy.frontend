import { RouteObject } from "react-router-dom";
import { Home } from "@/pages";

import games, { games_paths } from "./games";
import user, { user_paths } from "./user";
import dashboard, { dashboard_paths } from "./dashboard";
import search, { search_paths } from "./search";

const routes: RouteObject[] = [
    {
        index: true,
        element: <Home />
    },
    ...user,
    ...games,
    ...dashboard,
    ...search
];

export const paths = {
    users: user_paths,
    games: games_paths,
    dashboard: dashboard_paths,
    search: search_paths
}

export default routes;