import Routes from ".";
import fetchAPI from "..";

export const auth_login = (data) =>
    fetchAPI(Routes.auth.login as string, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const auth_reg = (data) =>
    fetchAPI(Routes.auth.reg as string, {
        method: "POST",
        body: JSON.stringify(data)
    });

