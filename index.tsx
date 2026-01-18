import { createRoot } from "react-dom/client";
import {
    RouterProvider,
    createBrowserRouter
} from "react-router-dom";
import { Provider } from "react-redux";
import Store from "@/stories";

import * as Pages from "@/pages";
import "./global.css";
import { ModalProvider, NotifyProvider } from "@/hooks";
import "@/i18n";

import routes from "@/routes";
import { AppProvider } from "@/hooks/app";
import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";

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

const queryClient = new QueryClient();

createRoot(app).render(
    <Provider store={Store}>
        <QueryClientProvider client={queryClient}>
            <NotifyProvider>
                <ModalProvider>
                    <AppProvider>
                        <RouterProvider router={routers} />
                    </AppProvider>
                </ModalProvider>
            </NotifyProvider>
        </QueryClientProvider>
    </Provider>
);