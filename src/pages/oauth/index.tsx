import React from "react";
import { Outlet } from "react-router-dom";

import Login from "./login";
import Reg from "./reg";

import "./styles.less";
export default function oAuth() {
    return (
        <div className="oauth">
            <Outlet />
        </div>
    )
}

export {
    Login,
    Reg
}