import { Game } from "@/pages";
import { RouteObject } from "react-router-dom";

export const games_paths = {
    details: (id: number | string) => `/g/${id}`
}

const games: RouteObject[] = [
    {
        path: games_paths.details(":id"),
        element: <Game />
    }
];

export default games;