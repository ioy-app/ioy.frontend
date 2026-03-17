import Routes, { apiInstance } from ".";
import fetchAPI, { jsonToFormData } from "..";

export const comments_list = (
	id: number,
	offset: number = 0,
	limit: number = 5,
	sort: "new" | "old" = "new",
) =>
	apiInstance.get(Routes.comments.details(id), {
		params: {
			offset,
			limit,
			sort,
		},
	});

export const comments_answers = (
	id: number,
	commentid: number,
	offset: number = 0,
	limit: number = 5,
) =>
	apiInstance.get(Routes.comments.answers(id, commentid), {
		params: {
			offset,
			limit,
		},
	});

export const comments_like = (id: number) =>
	apiInstance.post(Routes.comments.like(id));
export const comments_create = (
	id: number,
	comment: string,
) =>
	apiInstance.post(Routes.comments.create(id), { comment });
export const comments_delete = (
	id: number,
	commentid: number,
) =>
	apiInstance.delete(Routes.comments.reply(id, commentid));
export const comments_reply = (
	id: number,
	commentid: number,
	comment: string,
) =>
	apiInstance.post(Routes.comments.reply(id, commentid), {
		comment,
	});
