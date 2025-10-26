import Routes from ".";
import fetchAPI from "..";

export const games_list = () =>
    fetchAPI(Routes.games.list as string);

export const games_details = (id: number) =>
    fetchAPI(Routes.games.details(id));

export const games_icon = (id: number) =>
    fetchAPI(Routes.games.icon(id));