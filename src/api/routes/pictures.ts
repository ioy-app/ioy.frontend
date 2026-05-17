import Routes, { apiFileInstance, apiInstance } from ".";
import fetchAPI, { jsonToFormData } from "..";

export const pictures_list = (offset: number, search?: string) =>
	apiInstance.get(Routes.pictures.list as string, {
		params: {
			offset,
			search
		}
	});

export const pictures_tags = () =>
	apiInstance.get(Routes.pictures.tags as string);

export const pictures_details = (id: number) =>
	fetchAPI(Routes.pictures.details(id));

export const pictures_delete = (id: number) =>
	fetchAPI(Routes.pictures.details(id), {
		method: "DELETE",
	});

export const pictures_like = (id: number) =>
	fetchAPI(Routes.pictures.like(id), {
		method: "POST",
	});

export const picture_image = async (id: number) => {
	const data = await apiFileInstance.get(
		Routes.pictures.image(id),
		{
			responseType: "blob",
		},
	);

	return URL.createObjectURL(data);
};

export const pictures_create = (obj: FormData) =>
	apiInstance.post(
		Routes.pictures.list,
		jsonToFormData(obj)
	);

export const pictures_edit = (id: number, obj: FormData) =>
	apiInstance.put(
		Routes.pictures.details(id),
		jsonToFormData(obj)
	);

export const pictures_votes_list = (id: number) =>
	apiInstance.get(Routes.pictures.votes(id))

export const pictures_votes_put = (
	id: number,
	nomination: string,
	score: number
) => apiInstance.put(Routes.pictures.votes(id), {
	nomination,
	score
});