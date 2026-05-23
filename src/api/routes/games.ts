import Routes, { apiFileInstance, apiInstance } from ".";
import fetchAPI, { jsonToFormData } from "..";

export const games_list = (offset: number, search?: string, count?: number) =>
	apiInstance.get(Routes.games.list as string, {
		params: {
			offset,
			search,
			count
		}
	});

export const games_tags = () =>
	apiInstance.get(Routes.games.tags as string);

export const games_details = (id: number) =>
	fetchAPI(Routes.games.details(id));

export const games_delete = (id: number) =>
	fetchAPI(Routes.games.details(id), {
		method: "DELETE",
	});

export const games_subscribe = (id: number) =>
	fetchAPI(Routes.games.subscribe(id), {
		method: "POST",
	});

export const games_like = (id: number) =>
	fetchAPI(Routes.games.like(id), {
		method: "POST",
	});

export const games_icon = async (id: number) => {
	const data = await apiFileInstance.get(
		Routes.games.icon(id),
		{
			responseType: "blob",
		},
	);

	return URL.createObjectURL(data);
};

export const games_create = (obj: FormData) =>
	apiInstance.post(
		Routes.games.create,
		jsonToFormData(obj)
	);

export const games_edit = (id: number, obj: FormData) =>
	apiInstance.put(
		Routes.games.details(id),
		jsonToFormData(obj)
	);

export const games_votes_list = (id: number) =>
	apiInstance.get(Routes.games.votes(id))

export const games_votes_put = (
	id: number,
	nomination: string,
	score: number
) => apiInstance.put(Routes.games.votes(id), {
	nomination,
	score
});