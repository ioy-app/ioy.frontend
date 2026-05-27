import { Routes, apiInstance } from "@/api";

/**
 * Create new report by target
 * 
 * @param target_id - Target ID
 * @param type - Target type
 * @param message - Report message
*/
export const reports_create = (
	target_id: number,
	type: "game" | "jam" | "picture" | "comment" | "user",
	message: string
) =>
	apiInstance.post(Routes.reports.list, {
		target_id,
		type,
		message
	});

/**
 * Get reports list (Only for Admin)
 * 
 * @param params - Filters
*/
export const reports_list = (params: Record<string, any>) =>
	apiInstance.get(Routes.reports.list, { params });

/**
 * Answer for report (Only for Admin)
 * 
 * @param report_id - ID Report 
 * @param data - Answer's data
*/
export const reports_answer = (
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
) =>
	apiInstance.put(Routes.reports.details(report_id), data);