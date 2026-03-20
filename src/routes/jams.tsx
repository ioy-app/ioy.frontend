import Jam from "@/pages/jams";
import JamDetails from "@/pages/jams/details";
import JamEdit from "@/pages/jams/edit";
import { RouteObject } from "react-router-dom";

export const jams_paths = {
	list: "/j",
	details: (id: number | string) => `/j/${id}`,
	edit: (id: number | string) => `/j/${id}/edit`,
	create: `/j/create`,
};

const jams: RouteObject[] = [
	{
		path: jams_paths.create,
		element: <JamEdit />,
	},
	{
		path: jams_paths.details(":id"),
		element: <JamDetails />,
	},
	{
		path: jams_paths.edit(":id"),
		element: <JamEdit />,
	},
];

export default jams;
