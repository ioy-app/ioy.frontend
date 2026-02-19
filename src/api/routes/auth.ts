import Routes, { apiInstance } from ".";

export const auth_login = (data: {
    email: string;
}) => apiInstance.post(Routes.auth.login, data);

export const auth_reg = (data: {
    login: string;
    email: string;
}) => apiInstance.post(Routes.auth.reg, data);
