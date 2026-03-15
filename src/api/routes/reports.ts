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

export const answer_report = (
	report_id: number,
	data: {
		answer: string,
		params: {
			ban_instance_3d?: boolean;
			ban_instance_30d?: boolean;
			delete_instance?: boolean;
			unban_instance?: boolean;
		}
	}
) => apiInstance.put(Routes.reports.details(report_id), data);
