import Routes from ".";
import fetchAPI from "..";

export const profile_me = () =>
    fetchAPI(Routes.profile.me as string);

export const profile_logout = () =>
    fetchAPI(Routes.profile.logout as string);

