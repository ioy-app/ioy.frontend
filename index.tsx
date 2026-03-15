import { createRoot } from "react-dom/client";
import {
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import { Provider } from "react-redux";
import Store from "@/stories";
import { HelmetProvider } from "react-helmet-async";

import * as Pages from "@/pages";
import "./global.css";
import { ModalProvider, NotifyProvider } from "@/hooks";
import "@/i18n";
import routes, { paths } from "@/routes";
import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import Terms from "@/pages/home/pages/terms";

const routers = createBrowserRouter([
	{
		path: paths.terms,
		element: <Terms />,
	},
	{
		path: paths.verify,
		element: <Pages.Verify />
	},
	{
		path: "/",
		Component: Pages.Content,
		errorElement: <Pages.ErrorPage />,
		children: routes,
	}
]);

const app: HTMLElement | null =
	document.getElementById("app");
if (!app) throw new Error("#app isn't found");

const queryClient = new QueryClient();

createRoot(app).render(
	<Provider store={Store}>
		<QueryClientProvider client={queryClient}>
			<NotifyProvider>
				<ModalProvider>
					<HelmetProvider>
						<RouterProvider router={routers} />
					</HelmetProvider>
				</ModalProvider>
			</NotifyProvider>
		</QueryClientProvider>
	</Provider>,
);
