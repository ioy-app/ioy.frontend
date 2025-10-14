import React from "react";
import { createRoot } from "react-dom/client";
import {
    RouterProvider,
    createBrowserRouter
} from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./src/store";

import * as Pages from "@/pages";
import "@/styles/main.less";

const routers = createBrowserRouter([
    {
        path: "/",
        Component: Pages.Content,
        errorElement: <Pages.Error />,
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
                path: "/g/:id",
                element: <Pages.Game />
            }
        ]
    },
    {
        path: "/oauth",
        Component: Pages.oAuth,
        errorElement: <Pages.Error />,
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

createRoot(document.getElementById("app")).render(
    <Provider store={Store}>
        <RouterProvider
            router={routers}
        />
    </Provider>
);