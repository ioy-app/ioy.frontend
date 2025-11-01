import React from "react";
import { createRoot } from "react-dom/client";
import {
    RouterProvider,
    createBrowserRouter
} from "react-router-dom";
import { Provider } from "react-redux";
import Store from "@/store";

import * as Pages from "@/pages";
import "@/styles/index.less";
import { NotifyProvider } from "@/hooks";

const routers = createBrowserRouter([
    {
        path: "/",
        Component: Pages.Content,
        errorElement: <Pages.ErrorPage />,
        children: [
            {
                index: true,
                element: <Pages.Home />
            },
            {
                path: "/stories",
                element: <Pages.Stories/>
            },
            {
                path: "/u/:login",
                element: <Pages.Profile />
            },
            {
                path: "/u/:login/edit",
                element: <Pages.ProfileEdit />
            },
            {
                path: "/g/:id",
                element: <Pages.Game />
            }
        ]
    },
    {
        path: "/oauth",
        Component: Pages.oAuth,
        errorElement: <Pages.ErrorPage />,
        children: [
            {
                index: true,
                element: <Pages.oAuthLogin />
            },
            {
                path: "reg",
                element: <Pages.oAuthReg />
            }
        ]
    }
]);

const app: HTMLElement | null = document.getElementById("app");
if (!app)
    throw new Error("Контейнер #app не найден");
createRoot(app).render(
    <Provider store={Store}>
        <NotifyProvider>
            <RouterProvider
                router={routers}
            />
        </NotifyProvider>
    </Provider>
);