import { Routes, apiInstance } from "@/api";
import jsonToFormData from "@/utils/jsonToFormData";

/**
 * Get user's details
 * 
 * @param login - Login 
*/
export const users_details = (login: string) =>
	apiInstance.get(Routes.users.details(login));

/**
 * Get self details
*/
export const users_me = () =>
	apiInstance.get(Routes.users.self);

/**
 * Subscribe to user
 * 
 * @param login - Login 
*/
export const users_subscribe = (login: string) =>
	apiInstance.post(Routes.users.subscribe(login));

/**
 * Get games by user
 * 
 * @param login - Login
 * @param params - Filters
*/
export const users_games = (login: string, params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.users.games(login), {
		params
	});

/**
 * Get pictures by user
 * 
 * @param login - Login
 * @param params - Filters
*/
export const users_pictures = (login: string, params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.users.pictures(login), {
		params
	});

/**
 * Get likes instances by user
 * 
 * @param login - Login
 * @param params - Filters
*/
export const users_likes = (login: string, params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.users.likes(login), {
		params
	});

/**
 * Get following by user
 * 
 * @param login - Login
 * @param params - Filters
*/
export const users_following = (login: string, params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.users.subscribers(login), {
		params
	});

/**
 * Get jams by user
 * 
 * @param login - Login
 * @param params - Filters
*/
export const users_jams = (login: string, params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.users.jams(login), {
		params
	});

/**
 * Edit user info
 * 
 * @param login - Login
 * @param props - Properties
*/
export const users_edit = (login: string, props: Record<string, any>) =>
	apiInstance.put(Routes.users.details(login), jsonToFormData(props));

/**
 * Change user's email
 * 
 * @param current_email - Current email
 * @param new_email - New email
*/
export const users_edit_email = (current_email: string, new_email: string) =>
	apiInstance.put(Routes.users.email, {
		current_email,
		email: new_email
	});

/**
 * Delete user's account
*/
export const users_delete = () =>
	apiInstance.post(Routes.users.delete);