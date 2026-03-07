import Routes from ".";
import fetchAPI from "..";

export const search = (query?: URLSearchParams) =>
	fetchAPI(Routes.search + ((query && `?${query.toString()}`) || ""), {
		method: "GET",
	});
