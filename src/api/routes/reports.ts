import Routes, { apiInstance } from ".";

export const add_report = (
	target_id: number,
	type: "jam" | "game" | "user" | "comment",
	message: string,
) =>
	apiInstance.post(Routes.reports.list, {
		target_id,
		type,
		message,
	});

export const reports = (offset: number, limit: number) =>
	apiInstance.get(Routes.reports.list, {
		params: {
			offset,
			limit,
		},
	});
