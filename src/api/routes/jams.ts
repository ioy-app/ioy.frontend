import fetchAPI, { Routes } from "..";

export const jams_list = async (
	date_from: string,
	date_to: string,
) => {
	const us = new URLSearchParams();
	us.set("date_from", date_from);
	us.set("date_to", date_to);
	return fetchAPI(Routes.jams.list + `?${us.toString()}`);
};
