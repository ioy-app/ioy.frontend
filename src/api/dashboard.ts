import { Routes, apiInstance } from "@/api";

/**
 * Dashboard's instances list
 * 
 * @param params - Filters
*/
export const dashboard_instances = (params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.dashboard.instances, { params });

/**
 * Dashboard's jams list
 * 
 * @param params - Filters
*/
export const dashboard_jams = (params?: Record<string, any> | URLSearchParams) =>
	apiInstance.post(Routes.dashboard.jams, { params });

/**
 * Dashboard's likes list
 * 
 * @param params - Filters
*/
export const dashboard_likes = (params?: Record<string, any> | URLSearchParams) =>
	apiInstance.get(Routes.dashboard.likes, { params });