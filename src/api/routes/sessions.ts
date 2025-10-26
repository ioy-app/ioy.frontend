import Routes from ".";
import fetchAPI from "..";

export const sessions_list = () =>
    fetchAPI(Routes.sessions.list as string);

export const sessions_delete = (id: number) =>
    fetchAPI(Routes.sessions.details(id), {
        method: "DELETE"
    });