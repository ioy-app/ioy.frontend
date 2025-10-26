import React, { useEffect } from "react";
import * as Components from "@/components";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMe } from "@/store/login";

export default function Content() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMe());
    }, [ dispatch ]);

    return (
        <>
            <Components.Header />
            <Outlet />
        </>
    );
}