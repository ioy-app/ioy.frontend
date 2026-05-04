import { RouteObject } from "react-router-dom";
import { Home, About, Feed, Search } from "@/pages";

import games, { games_paths } from "./games";
import user, { user_paths } from "./user";
import dashboard, { dashboard_paths } from "./dashboard";
import Jams from "@/pages/jams";
import Games from "@/pages/games";
import jams, { jams_paths } from "./jams";

export const paths = {
	users: user_paths,
	games: games_paths,
	dashboard: dashboard_paths,
	search: "/search",
	about: "/about",
	terms: "/terms",
	verify: "/verify",
	jams: jams_paths,
};

const routes: RouteObject[] = [
	{
		path: "/",
		Component: Home,
		children: [
			{
				index: true,
				element: <Games />
			},
			{
				path: "/jams",
				element: <Jams />
			},
			{
				path: "/feed",
				element: <Feed />
			},
			{
				path: "/search",
				element: <Search />
			}
		]
	},
	{
		path: paths.about,
		element: <About />,
	},
	...user,
	...games,
	...dashboard,
	...jams,
];

export default routes;
