import { Routes, apiInstance } from "@/api";

/**
 * Login
 * 
 * @param data - User's creds
*/
export const auth_login = (data: { email: string }) =>
	apiInstance.post(Routes.auth.login, data);

/**
 * Registration new user
 * 
 * @param data - Creds for new user
*/
export const auth_reg = (
	data: {
		login: string;
		email: string;
	}
) =>
	apiInstance.post(Routes.auth.reg, data);

/**
 * Verify created account
 * @param code - Code
*/
export const auth_verify = (code: string) =>
	apiInstance.get(Routes.auth.verify, {
		params: {
			code
		}
	});