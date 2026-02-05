import Routes from ".";
import fetchAPI, { jsonToFormData } from "..";

export const games_list = () =>
    fetchAPI(Routes.games.list as string);

export const games_details = (id: number) =>
    fetchAPI(Routes.games.details(id));

export const games_subscribe = (id: number) =>
    fetchAPI(Routes.games.subscribe(id), {
        method: "POST"
    });

export const games_like = (id: number) =>
    fetchAPI(Routes.games.like(id), {
        method: "POST"
    });

export const games_icon = (id: number) =>
    fetchAPI(Routes.games.icon(id));

export const games_create = (obj: FormData) =>
    fetchAPI(Routes.games.create, {
        method: "POST",
        headers: {
            "Content-Type": "no-content"
        },
        body: jsonToFormData(obj)
    })
export const games_edit = (id: number, obj: FormData) =>
    fetchAPI(Routes.games.details(id), {
        method: "PUT",
        headers: {
            "Content-Type": "no-content"
        },
        body: jsonToFormData(obj)
    })