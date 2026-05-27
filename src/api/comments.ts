import { Routes, apiInstance } from "@/api";

/**
 * Get comment by instance
 * 
 * @param id - ID Target
 * @param params - Filters
*/
export const comments_list = (id: number, params: Record<string, any>) =>
	apiInstance.get(Routes.comments.details(id), { params });

/**
 * Get answers by comment
 * 
 * @param id - ID Target
 * @param comment_id - ID Comment
 * @param params - Filters
*/
export const comments_answers = (
	id: number,
	comment_id: number,
	params: Record<string, any>
) =>
	apiInstance.get(Routes.comments.answers(id, comment_id), { params });

/**
 * Set Like/Dislike to comment
 * 
 * @param id - ID Comment
*/
export const comments_like = (id: number) =>
	apiInstance.post(Routes.comments.like(id));

/**
 * Create new comment for instance
 * 
 * @param id - ID Target
 * @param comment - Comment
 * @param type - Type
*/
export const comments_create = (
	id: number,
	comment: string,
	type: "game" | "picture"
) =>
	apiInstance.post(Routes.comments.create(id), {
		comment,
		type
	});

/**
 * Reply to instance
 * 
 * @param id - ID Target
 * @param comment_id - ID Comment
 * @param comment - Comment
*/
export const comments_reply = (
	id: number,
	comment_id: number,
	comment: string
) =>
	apiInstance.post(Routes.comments.reply(id, comment_id), {
		comment
	});

/**
 * Delete comment
 * 
 * @param id - ID Target
 * @param comment_id - ID Comment
*/
export const comments_delete = (id: number, comment_id: number) =>
	apiInstance.delete(Routes.comments.reply(id, comment_id));