import Routes, { apiInstance } from ".";
import fetchAPI, { jsonToFormData } from "..";

export const users_details = (login: string) =>
    fetchAPI(Routes.users.details(login));

export const users_subscribe = (login: string) =>
    fetchAPI(Routes.users.subscribe(login), {
        method: "POST"
    });

export const users_games = (login: string, us?: URLSearchParams) =>
    fetchAPI(Routes.users.games(login) + (us && `?${us.toString()}` || ""));

export const users_likes = (login: string, us?: URLSearchParams) =>
    fetchAPI(Routes.users.likes(login) + (us && `?${us.toString()}` || ""));

export const users_jams = (login: string) =>
    fetchAPI(Routes.users.jams(login));

export const users_subscribers = (login: string, us?: URLSearchParams) =>
    fetchAPI(Routes.users.subscribers(login) + (us && `?${us.toString()}` || ""));

export const users_favorites = (login: string, us?: URLSearchParams) =>
    fetchAPI(Routes.users.favorites(login) + (us && `?${us.toString()}` || ""));

export const users_edit = (login: string, obj) =>
    apiInstance.put(Routes.users.details(login), jsonToFormData(obj));
    // fetchAPI(Routes.users.details(login), {
    //     method: "PUT",
    //     headers: {
    //         "Content-Type": "no-content"
    //     },
    //     body: jsonToFormData(obj)
    // });
export const users_edit_email = (current_email: string, email: string) =>
    fetchAPI(Routes.users.email, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            current_email,
            email
        })
    });