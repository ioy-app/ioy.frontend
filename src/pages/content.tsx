import React from "react";
import * as Components from "@/components";
import { Outlet } from "react-router-dom";


export default function Content() {
    return (
        <>
            <Components.Header />
            <Outlet />
        </>
    );
}