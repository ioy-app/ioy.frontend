import Routes from ".";
import fetchAPI, { jsonToFormData } from "..";

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

export const users_subscribers = (login: string) =>
    fetchAPI(Routes.users.subscribers(login));

export const users_favorites = (login: string) =>
    fetchAPI(Routes.users.favorites(login));

export const users_edit = (login: string, obj) =>
    fetchAPI(Routes.users.details(login), {
        method: "PUT",
        headers: {
            "Content-Type": "no-content"
        },
        body: jsonToFormData(obj)
    });