import React from "react";
import { Outlet } from "react-router-dom";

import Login from "./login";
import Reg from "./reg";

import "./styles.less";
import { Tabs } from "@/components";
export default function oAuth({
    onClose
}) {
    return (
        <div className="oauth">
            <Tabs
                headers={[
                    {
                        label: "Вход",
                        value: "login"
                    },
                    {
                        label: "Регистрация",
                        value: "reg"
                    }
                ]}
                content={{
                    login: <Login onClose={onClose} />,
                    reg: <Reg onClose={onClose} />
                }}
            />
        </div>
    )
}

export {
    Login,
    Reg
}

/* <Tabs
            headers={[
                {
                    label: "Вход",
                    value: "login"
                },
                {
                    label: "Регистрация",
                    value: "reg"
                }
            ]}
            content={{
                login: <Login />,
                reg: <Reg />
            }}
        /> */