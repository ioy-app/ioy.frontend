import { Home } from "@/pages";
import games from "./games";
import user from "./user";
import { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
    {
        index: true,
        element: <Home />
    },
    ...user,
    ...games
]

export default routes;