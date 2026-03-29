import { apiInstance } from ".";
import { jsonToFormData, Routes } from "..";

/** List Jams */
export const jams_list = async (date_from: string, date_to: string) => 
	apiInstance.get(Routes.jams.list, {
		params: {
			date_from,
			date_to
		}
	});

/** Create Jam */
export const jams_create = async (body) =>
	apiInstance.post(Routes.jams.list, jsonToFormData(body));

/** Edit Jam */
export const jams_edit = async (id: number, body) =>
	apiInstance.put(Routes.jams.details(id), jsonToFormData(body));

/** Show Jam */
export const jams_details = async (id: number) =>
	apiInstance.get(Routes.jams.details(id));

/** Delete Jam  */
export const jams_delete = async (id: number) =>
	apiInstance.delete(Routes.jams.details(id));

export const jams_join = async (id: number) =>
	apiInstance.post(Routes.jams.join(id));

export const jams_leave = async (id: number) =>
	apiInstance.post(Routes.jams.leave(id));