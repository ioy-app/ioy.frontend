import Routes, { apiInstance } from ".";
import fetchAPI from "..";

export const dashboard_games = (query?: URLSearchParams) =>
	apiInstance.post(
		Routes.dashboard.games + ((query && `?${query.toString()}`) || ""),
	);
// fetchAPI( + (query && `?${query.toString()}` || ""), {
//     method: "POST"
// });
