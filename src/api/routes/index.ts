import Store, { dispatch } from "@/stories";

import * as Profile from "./profile";
import * as Sessions from "./sessions";
import * as Users from "./users";
import * as oAuth from "./auth";
import * as Games from "./games";
import * as Comments from "./comments";
import * as Jams from "./jams";

import axios from "axios";
export const apiInstance = axios.create({
	withCredentials: true,
	baseURL: "/api/v1",
});

apiInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token)
		config.headers.Authorization = `Bearer ${token}`;
	return config;
});

apiInstance.interceptors.response.use(
	(config) => config?.data,
	async (err) => {
		if (err.response.status == 401) {
			try {
				const response = await apiInstance.get(
					Routes.profile.refresh,
				);
				if (response?.token) {
					localStorage.setItem("token", response?.token);
					return apiInstance(err.config);
				}
			} catch (err) {
				localStorage.removeItem("token");
			} finally {
				return apiInstance(err.config);
			}
		}

		return Promise.reject({
			status: err?.response?.status || 0,
			message: err?.response?.data?.msg,
			data: err?.response?.data,
			originalError: err,
		});
	},
);

export const apiFileInstance = apiInstance;
apiFileInstance.interceptors.response.use(
	(config) => config,
	async (err) => {
		if (err?.response?.status == 401) {
			try {
				const response = await apiInstance.get(
					Routes.profile.refresh,
				);
				if (response?.token) {
					localStorage.setItem("token", response?.token);
					return apiInstance(err.config);
				} else {
					localStorage.removeItem("token");
				}
			} catch (err) {
				console.log("???", err);
			}
		}

		return Promise.reject({
			status: err?.status || 0,
			message: err?.message,
			originalError: err,
		});
	},
);

const path: string = "";
const Routes = {
	sessions: {
		list: `/sessions`,
		details: (id: number) => `/sessions/${id}`,
	},
	profile: {
		refresh: `/sessions/update`,
		me: `/auth/me`,
		logout: `/auth/logout`,
	},
	users: {
		self: `/users/self`,
		details: (login: string) => `/users/${login}`,
		subscribe: (login: string) =>
			`/users/${login}/subscribe`,
		games: (login: string) => `/users/${login}/games`,
		jams: (login: string) => `/users/${login}/jams`,
		avatar: (login: string) => `/users/${login}/avatar`,
		subscribers: (login: string) =>
			`/users/${login}/subscribers`,
		favorites: (login: string) =>
			`/users/${login}/favorites`,
		likes: (login: string) => `/users/${login}/likes`,
		email: `/users/change-email`,
		delete: `/users/delete`,
	},
	auth: {
		login: `/auth/login`,
		reg: `/auth/reg`,
		verify: `/auth/verify`
	},
	games: {
		list: `/games`,
		details: (id: number) => `/games/${id}`,
		icon: (id: number) => `/games/${id}/icon`,
		subscribe: (id: number) => `/games/${id}/subscribe`,
		game: (id: number) => `/games/${id}/game`,
		like: (id: number) => `/games/${id}/like`,
		create: `/games/create`,
	},
	dashboard: {
		games: `/games/my`,
		jams: `/jams/my`
	},
	comments: {
		details: (id: number) => `/comments/${id}`,
		answers: (id: number, commentid: number) =>
			`/comments/${id}/${commentid}`,
		create: (id: number) => `/comments/${id}`,
		reply: (id: number, commentid: number) =>
			`/comments/${id}/${commentid}`,
		like: (id: number) => `/comments/${id}/like`,
	},
	search: `/search`,
	jams: {
		list: `/jams`,
		details: (id: number) => `/jams/${id}`,
		icon: (id: number) => `/jams/${id}/icon`,
		join: (id: number) => `/jams/${id}/join`,
		leave: (id: number) => `/jams/${id}/leave`,
		games: (id: number) => `/jams/${id}/games`
	},
	reports: {
		list: "/reports",
		details: (id: number) => `/reports/${id}`
	},
	feed: {
		global: "/feed/global"
	}
};

export default Routes;
export {
	Profile,
	Sessions,
	Users,
	oAuth,
	Games,
	Comments,
	Jams,
};
