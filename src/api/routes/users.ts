import Routes, { apiInstance } from ".";
import fetchAPI, { jsonToFormData } from "..";

export const users_self = () =>
	apiInstance.get(Routes.users.self);

export const users_details = (login: string) =>
	apiInstance.get(Routes.users.details(login));

export const users_subscribe = (login: string) =>
	apiInstance.post(Routes.users.subscribe(login));

export const users_games = (
	login: string,
	us?: URLSearchParams,
) =>
	apiInstance.get(
		Routes.users.games(login) +
			((us && `?${us.toString()}`) || ""),
	);

export const users_pictures = (
	login: string,
	us?: URLSearchParams,
) =>
	apiInstance.get(
		Routes.users.pictures(login) +
			((us && `?${us.toString()}`) || ""),
	);

export const users_likes = (
	login: string,
	us?: URLSearchParams,
) =>
	apiInstance.get(
		Routes.users.likes(login) +
			((us && `?${us.toString()}`) || ""),
	);

export const users_jams = (login: string) =>
	apiInstance.get(Routes.users.jams(login));

export const users_subscribers = (
	login: string,
	us?: URLSearchParams,
) =>
	apiInstance.get(
		Routes.users.subscribers(login) +
			((us && `?${us.toString()}`) || ""),
	);

export const users_favorites = (
	login: string,
	us?: URLSearchParams,
) =>
	apiInstance.get(
		Routes.users.favorites(login) +
			((us && `?${us.toString()}`) || ""),
	);

export const users_edit = (login: string, obj) =>
	apiInstance.put(
		Routes.users.details(login),
		jsonToFormData(obj),
	);

export const users_edit_email = (
	current_email: string,
	email: string,
) =>
	apiInstance.put(Routes.users.email, {
		current_email,
		email,
	});

export const users_delete = () =>
	apiInstance.post(Routes.users.delete);
