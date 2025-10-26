import Routes from ".";
import fetchAPI from "..";

export const oauth_login = (data) =>
    fetchAPI(Routes.oauth.login as string, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const oauth_reg = (data) =>
    fetchAPI(Routes.oauth.reg as string, {
        method: "POST",
        body: JSON.stringify(data)
    });

