import Routes from ".";
import fetchAPI from "..";

/**
 * Просмотр всех активных сессий
 * @returns {Promise<Response>}
*/
export const sessions_list = (): Promise<Response> =>
    fetchAPI(Routes.sessions.list as string);

/**
 * Удаление активной сессии по ID
 * 
 * @param {number} id ID
 * @returns {Promise<Response>}
*/
export const sessions_delete = (id: number): Promise<Response> =>
    fetchAPI(Routes.sessions.details(id), {
        method: "DELETE"
    });

/**
 * Удаление всех активных сессий
 * @returns {Promise<Response>}
*/
export const sessions_delete_all = (): Promise<Response> =>
    fetchAPI(Routes.sessions.list as string, {
        method: "DELETE"
    });