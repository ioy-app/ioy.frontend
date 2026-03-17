import Routes, { apiInstance } from ".";

export const profile_me = () =>
	apiInstance.get(Routes.profile.me);
export const profile_logout = () =>
	apiInstance.get(Routes.profile.logout);
