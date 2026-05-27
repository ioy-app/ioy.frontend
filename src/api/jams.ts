import { Routes, apiInstance } from "@/api";
import jsonToFormData from "@/utils/jsonToFormData";

/**
 * Get jams on range date
 * 
 * @param date_from - From
 * @param date_to - To
*/
export const jams_list = (date_from: string, date_to: string) =>
	apiInstance.get(Routes.jams.list, {
		params: {
			date_from,
			date_to
		}
	});

/**
 * Create new jam
 * 
 * @param props - Jam properties
*/
export const jams_create = (props: Record<string, any>) =>
	apiInstance.post(Routes.jams.list, jsonToFormData(props));

/**
 * Edit jam info
 * 
 * @param id - ID Jam
 * @param props - Jam properties
*/
export const jams_edit = (id: number, props: Record<string, any>) =>
	apiInstance.put(Routes.jams.details(id), jsonToFormData(props));

/**
 * Get jam details
 * 
 * @param id - ID Jam
*/
export const jams_details = (id: number) =>
	apiInstance.get(Routes.jams.details(id));

/**
 * Delete jam by ID
 * 
 * @param id - ID Jam
*/
export const jams_delete = (id: number) =>
	apiInstance.delete(Routes.jams.details(id));

/**
 * Join to jam by ID
 * 
 * @param id - ID Jam
*/
export const jams_join = (id: number) =>
	apiInstance.post(Routes.jams.join(id));

/**
 * Leave to jam by ID
 * 
 * @param id - ID Jam
*/
export const jams_leave = (id: number) =>
	apiInstance.post(Routes.jams.leave(id));

/**
 * Get games by jam
 * 
 * @param id - ID Jam
 * @param params - Filters
*/
export const jams_games = (id: number, params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.jams.games(id), { params });