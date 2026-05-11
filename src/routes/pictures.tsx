import PictureDetails from "@/pages/pictures/details";
import { RouteObject } from "react-router-dom";

export const pictures_paths = {
	details: (id: number | string) => `/p/${id}`,
	edit: (id: number | string) => `/p/${id}/edit`,
	create: `/p/create`,
};

const pictures: RouteObject[] = [
	{
		path: pictures_paths.create,
		element: <></>,
	},
	{
		path: pictures_paths.details(":id"),
		element: <PictureDetails />,
	},
	{
		path: pictures_paths.edit(":id"),
		element: <></>,
	},
];

export default pictures;
