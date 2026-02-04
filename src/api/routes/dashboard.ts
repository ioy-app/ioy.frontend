import Routes from ".";
import fetchAPI from "..";

export const dashboard_games = (query?: URLSearchParams) =>
    fetchAPI(Routes.dashboard.games + (query && `?${query.toString()}` || ""), {
        method: "POST"
    });
