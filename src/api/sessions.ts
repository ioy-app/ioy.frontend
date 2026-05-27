import { Routes, apiInstance } from "@/api";

/**
 * Get all sessions by user
*/
export const sessions_list = () =>
	apiInstance.get(Routes.sessions.list);

/**
 * Delete session by ID
 * 
 * @param id - ID Session
*/
export const sessions_delete = (id: number) =>
	apiInstance.delete(Routes.sessions.details(id));

/**
 * Delete all sessions by user
*/
export const sessions_delete_all = () =>
	apiInstance.delete(Routes.sessions.list);