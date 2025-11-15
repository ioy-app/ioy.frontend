import React from "react";
import { createRoot } from "react-dom/client";
import {
    RouterProvider,
    createBrowserRouter
} from "react-router-dom";
import { Provider } from "react-redux";
import Store from "@/stories";

import * as Pages from "@/pages";
import "@/styles/index.less";
import { ModalProvider, NotifyProvider } from "@/hooks";
import "@/i18n";

import routes from "@/routes";
import { AppProvider } from "@/hooks/app";
const routers = createBrowserRouter([
    {
        path: "/",
        Component: Pages.Content,
        errorElement: <Pages.ErrorPage />,
        children: routes
    }
]);

const app: HTMLElement | null = document.getElementById("app");
if (!app)
    throw new Error("#app is not defined");

createRoot(app).render(
    <Provider store={Store}>
        <NotifyProvider>
            <ModalProvider>
                <AppProvider>
                    <RouterProvider router={routers} />
                </AppProvider>
            </ModalProvider>
        </NotifyProvider>
    </Provider>
);