import Routes, { apiInstance } from ".";

export const dashboard_games = (query?: URLSearchParams) =>
	apiInstance.post(
		Routes.dashboard.games +
			((query && `?${query.toString()}`) || ""),
	);

export const dashboard_jams = (query?: URLSearchParams) =>
	apiInstance.post(
		Routes.dashboard.jams +
		((query && `?${query.toString()}`) || "")
	);


export const dashboard_pictures = (query?: URLSearchParams) =>
	apiInstance.post(
		Routes.dashboard.pictures +
		((query && `?${query.toString()}`) || "")
	);