import Routes, { apiFileInstance, apiInstance } from ".";
import fetchAPI, { jsonToFormData } from "..";

export const games_list = () =>
    fetchAPI(Routes.games.list as string);

export const games_details = (id: number) =>
    fetchAPI(Routes.games.details(id));

export const games_delete = (id: number) =>
    fetchAPI(Routes.games.details(id), {
        method: "DELETE"
    });

export const games_subscribe = (id: number) =>
    fetchAPI(Routes.games.subscribe(id), {
        method: "POST"
    });

export const games_like = (id: number) =>
    fetchAPI(Routes.games.like(id), {
        method: "POST"
    });

export const games_icon = async (id: number) => {
    const data = await apiFileInstance.get(Routes.games.icon(id), {
        responseType: "blob"
    });

    return URL.createObjectURL(data);
}

export const games_create = (obj: FormData) =>
    apiInstance.post(Routes.games.create, jsonToFormData(obj));
    // fetchAPI(Routes.games.create, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "no-content"
    //     },
    //     body: jsonToFormData(obj)
    //})
export const games_edit = (id: number, obj: FormData) =>
    apiInstance.put(Routes.games.details(id), jsonToFormData(obj));
    // fetchAPI(Routes.games.details(id), {
    //     method: "PUT",
    //     headers: {
    //         "Content-Type": "no-content"
    //     },
    //     body: jsonToFormData(obj)
    // })