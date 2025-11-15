import { Game } from "@/pages";
import { RouteObject } from "react-router-dom";

const games: RouteObject[] = [
    {
        path: "/g/:id",
        element: <Game />
    }
];

export default games;