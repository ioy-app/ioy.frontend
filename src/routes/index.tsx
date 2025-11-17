import { Home } from "@/pages";
import games, { games_paths } from "./games";
import user, { user_paths } from "./user";
import { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
    {
        index: true,
        element: <Home />
    },
    ...user,
    ...games
];

export const paths = {
    users: user_paths,
    games: games_paths
}

export default routes;