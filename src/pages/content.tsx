import React, { useEffect } from "react";
import * as Components from "@/components";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMe, setToken } from "@/stories/login";
import { NotifyProvider } from "@/hooks";
import { Routes } from "@/api";

export default function Content() {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const result_refresh = await fetch(Routes.profile.refresh),
                json_refresh = await result_refresh.json();
                if (!result_refresh.ok) {
                    dispatch(setToken(null));
                    throw new Error(json_refresh?.msg);
                }
                dispatch(setToken(json_refresh));
            }
            catch(err) {}
            finally {
                dispatch(fetchMe());
            }
        })();
        
    }, [ dispatch ]);

    return (
        <>
            <Components.Header />
            <main className="flex w-lvw">
                <Outlet />
            </main>
            <Components.Footer />
        </>
    );
}