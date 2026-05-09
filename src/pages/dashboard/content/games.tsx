import confOrder from "@/configs/order.json";

import {
	BiBookmark,
	BiBox,
	BiComment,
	BiEditAlt,
	BiHeart,
	BiLike,
	BiPlus,
	BiSearch,
	BiSearchAlt,
} from "react-icons/bi";
import confStatus from "../configs/status.json";

import { dashboard_games } from "@/api/routes/dashboard";
import { useEffect, useState } from "react";

import * as Components from "@/components";
import dayjs from "dayjs";
import {
	Link,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { games_paths } from "@/routes/games";
import { paths } from "@/routes";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

const Games: React.FC = () => {
	const { t } = useTranslation();
	const navigator = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const max = 10;
	const current_page = Number(
		searchParams.get("page") || 1,
	);
	const status = searchParams.get("status");
	const sort = searchParams.get("sort");
	const searchQS = searchParams.get("search");

	const query = useQuery({
		queryKey: [
			"dashboard",
			"games",
			searchParams?.toString(),
		],
		queryFn: async () => {
			const search = new URLSearchParams();

			search.set(
				"offset",
				String((current_page - 1) * max),
			);
			search.set("limit", String(max));
			if (sort) search.set("sort", sort);
			if (status) search.set("status", status);
			if (searchQS) search.set("search", searchQS);

			const result = await dashboard_games(search);
			return result;
		},
	});

	const onSubmit = async (data) => {
		const us = new URLSearchParams();
		if (data.search) us.set("search", data.search);
		if (data.status && data.status != "all")
			us.set("status", data.status);
		if (data.sort) us.set("sort", data.sort);
		setSearchParams(us);
	};

	const methods = useForm();

	useEffect(() => {
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
		if (searchParams.get("sort"))
			methods.setValue("sort", searchParams.get("sort"));
	}, [searchParams]);

	const sorOptions = confOrder?.map((item) => {
		item.label = t(item.label);
		return item;
	});

	return (
		<div className="w-full flex flex-col gap-4">
			<FormProvider {...methods}>
				<form
					className="flex gap-4 items-center flex-wrap"
					onSubmit={methods.handleSubmit(onSubmit)}
				>
					<Components.Input
						type="search"
						{...methods.register("search")}
						placeholder={t(
							"dashboard.placeholders.games.search",
						)}
					/>
					<div className="flex flex-wrap items-center justify-between gap-4 w-full">
						<div className="flex flex-wrap gap-4 items-center">
							<Components.Select
								placeholder={t(
									"dashboard.placeholders.status",
								)}
								options={confStatus.map((record) => ({
									...record,
									label: t(record.label),
								}))}
								{...methods.register("status")}
								className="w-50"
							/>
							<Components.Select
								options={sorOptions}
								className="w-50"
								placeholder={t(
									"dashboard.placeholders.order",
								)}
								{...methods.register("sort")}
							/>
						</div>
						<Components.Button
							variant="primary"
							htmlType="submit"
						>
							<BiSearch />
						</Components.Button>
					</div>
				</form>
			</FormProvider>
			<Components.Table
				columns={[
					{
						title: t("dashboard.table.games.game"),
						dataIndex: "id",
						render: (data, game) => (
							<Link
								to={paths.games.details(game?.id)}
								className="group flex items-center gap-2 w-fit"
							>
								<Components.Game
									dataSource={
										{
											id: game?.id,
											is_avatar: game?.is_avatar,
											jam_result: game?.jam_result
										} as GameProps
									}
									nolink
									size={12}
								/>
								<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
									{game?.title}
								</p>
							</Link>
						),
					},
					{
						title: t("dashboard.table.games.version"),
						dataIndex: "version",
					},
					{
						title: t("dashboard.table.games.status"),
						dataIndex: "status",
						render: (status) =>
							t(`dashboard.statuses.` + status),
					},
					{
						title: t("dashboard.table.games.date_created"),
						dataIndex: "date_created",
						render: (date) =>
							dayjs(date)?.isValid() &&
							dayjs(date).format("HH:mm DD.MM.YYYY"),
					},
					{
						title: t("dashboard.table.games.date_updated"),
						dataIndex: "date_updated",
						render: (date) =>
							dayjs(date)?.isValid() &&
							dayjs(date).format("HH:mm DD.MM.YYYY"),
					},
					{
						title: <BiHeart />,
						dataIndex: "likes",
					},
					{
						title: <BiBookmark />,
						dataIndex: "saves",
					},
					{
						title: <BiComment />,
						dataIndex: "comments",
					}
				]}
				data={query?.data?.items}
				loading={query?.isPending}
				control={(row, i) => (
					<>
						<Components.Button
							variant="second"
							onClick={() =>
								navigator(games_paths.edit(row?.id))
							}
						>
							<BiEditAlt />
						</Components.Button>
					</>
				)}
				header={
					<div className="w-full flex items-center justify-end gap-4">
						<Components.Button
							variant="primary"
							onClick={() => navigator(games_paths.create)}
						>
							<BiPlus />
							{t("buttons.add_game")}
						</Components.Button>
					</div>
				}
				footer={
					<Components.Pagination
						total={query?.data?.total || 1}
						current={current_page}
						per_page={max}
						onChange={(offset, page) => {
							searchParams.set("page", String(page));
							setSearchParams(searchParams);
							query.refetch();
						}}
					/>
				}
				nodata={
					<>
						<BiBox className="text-2xl" />
						<p className="text-placeholder">
							{t("dashboard.labels.nodata")}
						</p>
					</>
				}
			/>
		</div>
	);
};

export default Games;
