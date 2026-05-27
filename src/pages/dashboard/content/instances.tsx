import confOrder from "@/configs/order.json";
import confTypes from "../configs/types.json";
import confTypesFilter from "../configs/typesFilter.json";
import confStatus from "../configs/status.json";

import {
	BiBookmark,
	BiBox,
	BiComment,
	BiEditAlt,
	BiFileBlank,
	BiGridAlt,
	BiHeart,
	BiLike,
	BiPlus,
	BiSearch,
	BiSearchAlt,
	BiTrash,
} from "react-icons/bi";


import { dashboard_instances } from "@/api/dashboard";
import { useEffect, useState } from "react";

import * as Components from "@/components";
import dayjs from "dayjs";
import {
	Link,
	NavLink,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { games_paths } from "@/routes/games";
import { paths } from "@/routes";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { pictures_paths } from "@/routes/pictures";
import Popup from "@/components/base/popup";

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
	const type = searchParams.get("type");

	const query = useQuery({
		queryKey: [
			"dashboard",
			"instances",
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
			if (type) search.set("type", type);
			if (searchQS) search.set("search", searchQS);

			const result = await dashboard_instances(search);
			return result;
		},
	});

	const onSubmit = async (data) => {
		const us = new URLSearchParams();
		if (data.search) us.set("search", data.search);
		if (data.status && data.status != "all")
			us.set("status", data.status);
		if (data.sort) us.set("sort", data.sort);
		if (data.type && data.type != "all") us.set("type", data.type);
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
		if (searchParams.get("type"))
			methods.setValue(
				"type",
				searchParams.get("type"),
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
					<div className="flex gap-4 w-full">
						<Components.Input
							type="search"
							{...methods.register("search")}
							placeholder={t(
								"dashboard.placeholders.instances.search",
							)}
						/>
						<Components.Button
							variant="primary"
							htmlType="submit"
						>
							<BiSearch />
						</Components.Button>
					</div>
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
								placeholder={t(
									"dashboard.placeholders.type",
								)}
								options={confTypesFilter.map((record) => ({
									...record,
									label: t(record.label),
								}))}
								{...methods.register("type")}
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
					</div>
				</form>
			</FormProvider>
			<Components.Table
				columns={[
					{
						title: "",
						dataIndex: "id",
						render: (_, instance) => {
							switch(instance?.type) {
								case "game":
									return (
										<NavLink
											to={paths.games.edit(instance?.id)}
											className="group flex items-center gap-2 w-fit"
										>
											<Components.Game
												dataSource={{
													id: instance?.id,
													is_avatar: instance?.is_avatar,
													jam_result: instance?.jam_result,
													hype: instance?.hype
												}}
												nolink
												size={12}
											/>
											<p className="text-default group-hover:text-primary transition-colors">{instance?.title}</p>
											{instance?.version && (
												<div className="text-default border border-text text-text group-hover:text-primary group-hover:border-primary px-4 py-1 rounded-2xl transition-colors">
													{instance?.version}
												</div>
											)}
										</NavLink>
									);
								break;
								case "picture":
									return (
										<NavLink
											to={paths.pictures.edit(instance?.id)}
											className="group flex items-center gap-2 w-fit"
										>
											<div className="flex justify-center items-center w-12 aspect-square">
												<Components.Picture
													dataSource={{
														id: instance?.id,
														jam_result: instance?.jam_result,
														hype: instance?.hype
													}}
													nolink
													size="full"
												/>
											</div>
											<p className="text-default group-hover:text-primary transition-colors">{instance?.title}</p>
										</NavLink>
									);
								break;
							}
						}
					},
					{
						title: t("dashboard.table.instances.status"),
						dataIndex: "status",
						render: (status) =>
							t(`dashboard.statuses.` + status),
					},
					{
						title: t("dashboard.table.instances.date_created"),
						dataIndex: "date_created",
						render: (date) =>
							dayjs(date)?.isValid() &&
							dayjs(date).format("HH:mm DD.MM.YYYY"),
					},
					{
						title: t("dashboard.table.instances.date_updated"),
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
						title: <BiComment />,
						dataIndex: "comments",
					}
				]}
				data={query?.data?.items}
				loading={query?.isPending}
				header={
					<div className="w-full flex items-center justify-end gap-4">
						<Components.Select
							options={confTypes?.filter(record => record?.value != "all").map((record) => ({
								...record,
								label: t(record.label),
							}))}
							placeholder={(
								<span className="flex gap-2 items-center">
									{t("dashboard.placeholders.instances.upload")}
								</span>
							)}
							onChange={({ target: { value }}) => {
								switch(value) {
									case "games":
										navigator(games_paths.create);
									break;
									case "pictures":
										navigator(pictures_paths.create);
									break;
								}
							}}
						/>
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
