import { RouteObject } from "react-router-dom";
import { Dashboard } from "@/pages";

export const dashboard_paths = {
	list: `/db`,
};

const dashboard: RouteObject[] = [
	{
		path: dashboard_paths.list,
		element: <Dashboard />
	},
	{
		path: `${dashboard_paths.list}/:tab`,
		element: <Dashboard />
	}
];

export default dashboard;
