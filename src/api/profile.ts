import { Routes, apiInstance } from "@/api";

/**
 * Profile info
*/
export const profile_me = () =>
	apiInstance.get(Routes.profile.me);

/**
 * Profile logout
*/
export const profile_logout = () =>
	apiInstance.get(Routes.profile.logout);
