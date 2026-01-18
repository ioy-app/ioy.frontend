import Routes from ".";
import fetchAPI, { jsonToFormData } from "..";

export const comments_list = (id: number, offset: number = 0, limit: number = 5) => {
    const us = new URLSearchParams({
        offset: String(offset),
        limit: String(limit)
    });
    return fetchAPI(Routes.comments.details(id) + `?${us.toString()}`);
}

export const comments_answers = (id: number, commentid: number, offset: number = 0, limit: number = 5) => {
    const us = new URLSearchParams({
        offset: String(offset),
        limit: String(limit)
    });
    return fetchAPI(Routes.comments.answers(id, commentid) + `?${us.toString()}`);
}

export const comments_like = (id: number) =>
    fetchAPI(Routes.comments.like(id), {
        method: "POST"
    });

export const comments_create = (id: number, comment: string) =>
    fetchAPI(Routes.comments.create(id), {
        method: "POST",
        body: JSON.stringify({
            comment
        })
    });

export const comments_delete = (id: number, commentid: number) =>
    fetchAPI(Routes.comments.reply(id, commentid), {
        method: "DELETE"
    });

export const comments_reply = (id: number, commentid: number, comment: string) =>
    fetchAPI(Routes.comments.reply(id, commentid), {
        method: "POST",
        body: JSON.stringify({
            comment
        })
    });
