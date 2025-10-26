import Routes from ".";
import fetchAPI from "..";

export const users_details = (login: string) =>
    fetchAPI(Routes.users.details(login));

export const users_subscribe = (login: string) =>
    fetchAPI(Routes.users.subscribe(login), {
        method: "POST"
    });

export const users_games = (login: string) =>
    fetchAPI(Routes.users.games(login));

export const users_jams = (login: string) =>
    fetchAPI(Routes.users.jams(login));