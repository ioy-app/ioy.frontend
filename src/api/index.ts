import Store, { dispatch } from "@/store";
import { setToken } from "@/store/login";

import Routes from "./routes";

export default async function fetchAPI(
    path: string,
    init?: RequestInit
) {
    const token: string | null = Store.getState().login.token;

    const result = await fetch(path, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: "include"
    });

    if (!result.ok) {
        switch(result.status) {
            case 401: {
                const result_refresh = await fetch(Routes.profile.refresh, {
                    method: "POST"
                }),
                json_refresh = await result_refresh.json();
                if (!result_refresh.ok) {
                    dispatch(setToken(null));
                    throw new Error(json_refresh?.msg);
                }
                dispatch(setToken(json_refresh));
                return (await fetchAPI(path, init));
            } break;
            case 403: {
                dispatch(setToken(null));
                const json = await result.json();
                throw new Error(json?.msg);
            } break;
            default: {
                const json = await result.json();
                throw new Error(json?.msg);
            } break;
        }
    }

    return result;
}

export {
    Routes
}