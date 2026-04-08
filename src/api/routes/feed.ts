import Routes, { apiInstance } from ".";

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