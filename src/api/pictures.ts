import {
	Routes,
	apiFileInstance,
	apiInstance
} from "@/api";
import jsonToFormData from "@/utils/jsonToFormData";

/**
 * Get pictures list
 * 
 * @param params - Filters 
*/
export const pictures_list = (params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.pictures.list, { params });

/**
 * Get popular tags by pictures
*/
export const pictures_tags = () =>
	apiInstance.get(Routes.pictures.tags);

/**
 * Get picture details by ID
 * 
 * @param id - ID Picture
*/
export const pictures_details = (id: number) =>
	apiInstance.get(Routes.pictures.details(id));

/**
 * Delete picture by ID
 * 
 * @param id - ID Picture
*/
export const pictures_delete = (id: number) =>
	apiInstance.delete(Routes.pictures.details(id));

/**
 * Like/Dislike picture by ID
 * 
 * @param id - ID Picture
*/
export const pictures_like = (id: number) =>
	apiInstance.post(Routes.pictures.like(id));

/**
 * Picture's image
 * 
 * @param id - ID Picture
*/
export const picture_image = async (id: number) =>
	URL.createObjectURL(await apiFileInstance.get(Routes.pictures.image(id), { responseType: "blob" }));

/**
 * Add new picture
 * 
 * @param props - Picture properties
*/
export const pictures_create = (props: Record<string, any>) =>
	apiInstance.post(Routes.pictures.list, jsonToFormData(props));

/**
 * Edit picture info
 * 
 * @param id - ID Picture
 * @param props - Picture properties
*/
export const pictures_edit = (id: number, props: Record<string, any>) =>
	apiInstance.put(Routes.pictures.details(id), jsonToFormData(props));

/**
 * Get user's votes by picture
 * 
 * @param id - ID Picture
*/
export const pictures_votes_list = (id: number) =>
	apiInstance.get(Routes.pictures.votes(id));

/**
 * Set jam's vote for picture
 * 
 * @param id - ID Picture
 * @param nomination - Nomination title
 * @param score - Score (1, 2, 3)
*/
export const pictures_votes_put = (
	id: number,
	nomination: string,
	score: number
) =>
	apiInstance.put(Routes.pictures.votes(id), {
		nomination,
		score
	});