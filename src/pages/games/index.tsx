import { games_list } from "@/api/routes/games";
import { search } from "@/api/routes/search";
import {
	Button,
	Game,
	Input,
	Meta,
	Pagination,
	Table,
	Tag,
	User,
} from "@/components";
import { paths } from "@/routes";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BiBox, BiChevronsLeft, BiSearch } from "react-icons/bi";
import {
	Link,
	NavLink,
	useSearchParams,
} from "react-router";

/**
 * Games pages for home
 * @example
 * return <Games />
 */
const Games: React.FC<{}> = ({}) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const methods = useForm();
	const { t } = useTranslation();

	const {
		isFetching,
		data: { games, tags },
	} = useQuery({
		queryKey: ["home", "games"],
		queryFn: async () => {
			const response = await games_list();
			return response;
		},
		initialData: () => ({
			games: [],
			tags: [],
		}),
	});

	useEffect(() => {
		methods.setValue("search", null);

		if (searchParams.get("search"))
			methods.setValue(
				"search",
				searchParams.get("search"),
			);
		if (searchParams.get("status"))
			methods.setValue(
				"status",
				searchParams.get("status"),
			);
	}, [searchParams]);

	const isSearch = searchParams.get("search");
	const max = 20;
	const current_page = Number(
		searchParams.get("page") || 1,
	);

	const submit = (data) => {
		const us = new URLSearchParams(data);

		if (!data?.search) us.delete("search");

		setSearchParams(us);
	};

	const searchQuery = useQuery({
		queryKey: ["search", searchParams?.toString()],
		queryFn: async () => {
			if (!searchParams.get("search"))
				return {
					items: [],
					total: 0,
				};

			const us = new URLSearchParams();

			us.set("offset", String((current_page - 1) * max));
			us.set("limit", String(max));
			us.set("search", searchParams.get("search"));

			const response = await search(us);
			return response;
		},
		initialData: {
			items: [],
			total: 0,
		},
	});

	return (
		<FormProvider {...methods}>
			<Meta
				title="ioy.app"
				description={t("about.description")}
				url=""
			/>
			<form
				className="col-span-4 flex flex-col gap-4 w-full h-fit"
				onSubmit={methods.handleSubmit(submit)}
			>
				<div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2">
					{games?.map((game: GameProps, i: number) => (
						<Game
							dataSource={game}
							key={i}
							size="full"
						/>
					))}
				</div>
				<div className="flex gap-4 flex-wrap justify-center items-center py-8">
					{tags?.map((tag: string, i: number) => (
						<NavLink
							to={`/?search=${tag}`}
							className="cursor-pointer"
						>
							<Tag title={tag} key={i} />
						</NavLink>
					))}
				</div>
			</form>
		</FormProvider>
	);
};

export default Games;
