import * as Components from "@/components";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMe, setToken } from "@/stories/login";
import { Routes } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/api/routes";
import { Helmet } from "react-helmet-async";

export default function Content() {
	const dispatch = useDispatch();

	const { data, isError } = useQuery({
		queryKey: [ "profile", "token" ],
		queryFn: async () => {
			const response = await apiInstance.get(
				Routes.profile.refresh,
			);
			return response;
		},
		refetchInterval: 120_000,
		refetchIntervalInBackground: false,
		staleTime: 240_000,
	});

	if (isError) dispatch(setToken(null));
	else {
		dispatch(setToken(data));
		dispatch(fetchMe());
	}

	return (
		<>
			<div className="flex flex-col w-full min-h-screen bg-back text-text">
				<Components.Header />
				<main className="flex-1 py-2 px-4 w-full min-h-full">
					<Outlet />
				</main>
				<Components.Footer />
			</div>
		</>
	);
}
