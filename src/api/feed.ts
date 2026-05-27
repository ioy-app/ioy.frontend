import { Routes, apiInstance } from "@/api";

/**
 * Get feed's posts
 * 
 * @param offset - Offset
 * @param limit - Limit
*/
export const feed_global = (
	offset: number = 0,
	limit: number = 20
) =>
	apiInstance.get(Routes.feed.global, {
		params: {
			offset,
			limit
		}
	});