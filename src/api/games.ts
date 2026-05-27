import {
	Routes,
	apiFileInstance,
	apiInstance
} from "@/api";
import jsonToFormData from "@/utils/jsonToFormData";

/**
 * Get games list
 * 
 * @param params - Filters
*/
export const games_list = (params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.games.list, { params });

/**
 * Get popular tags by games
*/
export const games_tags = () =>
	apiInstance.get(Routes.games.tags);

/**
 * Get game details by ID
 * 
 * @param id - ID Game
*/
export const games_details = (id: number) =>
	apiInstance.get(Routes.games.details(id));

/**
 * Delete game by ID
 * 
 * @param id - ID Game
*/
export const games_delete = (id: number) =>
	apiInstance.delete(Routes.games.details(id));

/**
 * Like/Dislike game by ID
 * 
 * @param id - ID Game
*/
export const games_like = (id: number) =>
	apiInstance.post(Routes.games.like(id));

/**
 * Get game icon
 * 
 * @param id - ID Game 
*/
export const games_icon = async (id: number) =>
	URL.createObjectURL(await apiFileInstance.get(Routes.games.icon(id), {
		responseType: "blob"
	}));

/**
 * Added new game
 * 
 * @param props - Game properties
*/
export const games_create = (props: Record<string, any>) =>
	apiInstance.post(Routes.games.create, jsonToFormData(props));

/**
 * Edit game info
 * 
 * @param id - ID Game
 * @param props - Game properties
*/
export const games_edit = (id: number, props: Record<string, any>) =>
	apiInstance.put(Routes.games.details(id), jsonToFormData(props));

/**
 * Get user's votes by game
 * 
 * @param id - ID Game
*/
export const games_votes_list = (id: number) =>
	apiInstance.get(Routes.games.votes(id));

/**
 * Set jam's vote for game
 * 
 * @param id - ID Game
 * @param nomination - Nomination title
 * @param score - Score (1, 2, 3)
*/
export const games_votes_put = (
	id: number,
	nomination: string,
	score: number
) =>
	apiInstance.put(Routes.games.votes(id), {
		nomination,
		score
	});