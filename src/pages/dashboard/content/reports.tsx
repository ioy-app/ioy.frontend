import confOrder from "@/configs/order.json";

import {
	BiBox,
	BiEditAlt,
	BiPlus,
	BiReply,
	BiSearch,
	BiSearchAlt,
} from "react-icons/bi";
import confStatus from "../status.json";

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
import { users_favorites } from "@/api/routes/users";
import { useSelector } from "react-redux";
import { StoreProps } from "@/stories";
import { reports } from "@/api/routes/reports";
import { UserProps } from "@/types";

const Reports: React.FC = () => {
	const { t } = useTranslation();
	const navigator = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { login } = useSelector(
		(state: StoreProps) => state.login,
	);

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
			"reports",
			searchParams?.toString(),
		],
		queryFn: async () => {
			const result = await reports(
				(current_page - 1) * max,
				max,
			);
			return result;
		},
	});

	const onSubmit = async (data) => {
		const us = new URLSearchParams();
		if (data.sort) us.set("sort", data.sort);
		setSearchParams(us);
	};

	const methods = useForm();

	useEffect(() => {
		if (searchParams.get("sort"))
			methods.setValue("sort", searchParams.get("sort"));
	}, [searchParams]);

	const sorOptions = confOrder?.map((item) => {
		item.label = t(item.label);
		return item;
	});

	return (
		<div className="w-full flex flex-col gap-4">
			<Components.Table
				columns={[
					{
						title: t("dashboard.table.reports.target_id"),
						dataIndex: "instance",
						render: (instance, data) => {
							switch (data.target_type) {
								case "game":
									return (
										<Link
											to={paths.games.details(instance?.id)}
											className="group flex items-center gap-2 w-fit"
										>
											<Components.Game
												dataSource={
													{
														id: instance?.id,
														is_avatar: instance?.is_avatar,
													} as GameProps
												}
												nolink
												size={12}
											/>
											<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
												{instance?.title}
											</p>
										</Link>
									);
									break;
								case "user":
									return (
										<Link
											to={paths.users.details(instance?.id)}
											className="group flex items-center gap-2 w-fit"
										>
											<Components.User
												dataSource={
													{
														id: instance?.id,
														is_avatar: instance?.is_avatar,
													} as UserProps
												}
												login={instance?.login}
												nolink
												size={12}
											/>
											<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
												{instance?.login}
											</p>
										</Link>
									);
									break;
								case "comment":
									return (
										<div className="flex items-start gap-2 w-full flex-col">
											<Link
												className="group flex gap-2 items-center"
												to={paths.users.details(instance?.userdata?.login)}
											>
												<Components.User
													dataSource={
														{
															id: instance?.userdata?.id,
															is_avatar: instance?.userdata?.is_avatar,
														} as UserProps
													}
													login={instance?.userdata?.login}
													nolink
													size={12}
												/>
												<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
													{instance?.userdata?.login}
												</p>
											</Link>
											<p className="text-default border border-br px-4 py-2 rounded-xl w-full">
												{instance?.comment}
											</p>
											<p className="text-placeholder w-full flex justify-end">{dayjs(instance?.date_created).format("HH:mm DD.MM.YYYY")}</p>
										</div>
									);
								break;
							}

							return null;
						},
					},
					{
						title: t("dashboard.table.reports.source_id"),
						dataIndex: "sourcedata",
						render: (data) => (
							<Link
								to={paths.users.details(data?.login)}
								className="group flex items-center gap-2 w-fit"
							>
								<Components.User
									dataSource={
										{
											id: data?.id,
											is_avatar: data?.is_avatar,
										} as UserProps
									}
									login={data?.login}
									nolink
									size={12}
								/>
								<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
									{data?.login}
								</p>
							</Link>
						),
					},
					{
						title: t("dashboard.table.reports.message"),
						dataIndex: "message",
					},
					{
						title: t(
							"dashboard.table.reports.date_created",
						),
						dataIndex: "date_created",
						render: (date) =>
							dayjs(date)?.isValid() &&
							dayjs(date).format("HH:mm DD.MM.YYYY"),
					},
					{
						title: t("dashboard.table.reports.answer"),
						dataIndex: "answer",
					},
					{
						title: t(
							"dashboard.table.reports.date_answered",
						),
						dataIndex: "date_updated",
						render: (date) =>
							dayjs(date)?.isValid() &&
							dayjs(date).format("HH:mm DD.MM.YYYY"),
					}
				]}
				control={(row, i) => (
					<>
						<Components.Button
							variant="second"
							onClick={() => {
								
							}}
						>
							<BiReply />
						</Components.Button>
					</>
				)}
				data={query?.data?.items}
				loading={query?.isPending}
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
			/>
		</div>
	);
};

export default Reports;
