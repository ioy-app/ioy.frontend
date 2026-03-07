import { Game, GameEdit } from "@/pages";
import { RouteObject } from "react-router-dom";

export const games_paths = {
	details: (id: number | string) => `/g/${id}`,
	edit: (id: number | string) => `/g/${id}/edit`,
	create: `/g/create`,
};

const games: RouteObject[] = [
	{
		path: games_paths.create,
		element: <GameEdit />,
	},
	{
		path: games_paths.details(":id"),
		element: <Game />,
	},
	{
		path: games_paths.edit(":id"),
		element: <GameEdit />,
	},
];

export default games;
