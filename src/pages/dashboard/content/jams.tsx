import confOrder from "@/configs/order.json";
import confJamsTypes from "../configs/jams.json";
import {
	BiBox,
	BiEditAlt,
	BiPlus,
	BiSearch
} from "react-icons/bi";

import { dashboard_jams } from "@/api/dashboard";
import { useEffect, useState } from "react";

import * as Components from "@/components";
import dayjs from "dayjs";
import {
	Link,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { paths } from "@/routes";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { jams_paths } from "@/routes/jams";

const Jams: React.FC = () => {
	const { t } = useTranslation();
	const navigator = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const max = 10;
	const current_page = Number(
		searchParams.get("page") || 1,
	);
	const sort = searchParams.get("sort");
	const jams = searchParams.get("jams");
	const searchQS = searchParams.get("search");

	const query = useQuery({
		queryKey: [
			"dashboard",
			"jams",
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
			if (jams) search.set("jams", jams);
			if (searchQS) search.set("search", searchQS);

			const result = await dashboard_jams(search);
			return result;
		},
	});

	const onSubmit = async (data) => {
		const us = new URLSearchParams();
		for (const [ key, value ] of Object.entries(data)) {
			if (!value)
				continue;

			us.set(key, String(value));
		}
		setSearchParams(us);
	};

	const methods = useForm();

	useEffect(() => {
		for (const [ key, value ] of searchParams.entries())
			methods.setValue(key, value);
	}, [ searchParams ]);

	const sorOptions = confOrder?.map((item) => {
		item.label = t(item.label);
		return item;
	});

	const jamsOptions = confJamsTypes?.map((item) => {
		item.label = t(item.label);
		return item;
	});

	return (
		<div className="w-full flex flex-col gap-4">
			<FormProvider {...methods}>
				<form
					className="flex gap-4 items-center"
					onSubmit={methods.handleSubmit(onSubmit)}
				>
					<Components.Input
						type="search"
						{...methods.register("search")}
						placeholder={t(
							"dashboard.placeholders.jams.search",
						)}
					/>
					<Components.Select
						options={jamsOptions}
						className="w-50"
						placeholder={t(
							"dashboard.placeholders.jams.sort",
						)}
						{...methods.register("jams")}
						isFirstOption
					/>
					<Components.Select
						options={sorOptions}
						className="w-50"
						placeholder={t(
							"dashboard.placeholders.order",
						)}
						{...methods.register("sort")}
					/>
					<Components.Button
						variant="primary"
						htmlType="submit"
					>
						<BiSearch />
					</Components.Button>
				</form>
			</FormProvider>
			<Components.Table
				columns={[
					{
						title: t("dashboard.table.jams.jam"),
						dataIndex: "id",
						render: (data, jam) => (
							<Link
								to={paths.jams.details(jam?.id)}
								className="group flex items-center gap-2 w-fit"
							>
								<Components.Jam
									dataSource={
										{
											id: jam?.id,
											is_avatar: jam?.is_avatar,
										} as GameProps
									}
									nolink
									size={12}
								/>
								<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
									{jam?.title}
								</p>
							</Link>
						),
					},
					{
						title: t(
							"dashboard.table.jams.started_to_finished",
						),
						dataIndex: "date_created",
						render: (_, row) => (
							<div className="flex items-center gap-1 text-default">
								<p>{dayjs(row.date_started)?.isValid() && dayjs(row.date_started).format("HH:mm DD.MM.YYYY")}</p>
								<p>—</p>
								<p>{dayjs(row.date_finished)?.isValid() && dayjs(row.date_finished).format("HH:mm DD.MM.YYYY")}</p>
							</div>
						)
					},
					{
						title: t(
							"dashboard.table.jams.vote_started_to_finished",
						),
						dataIndex: "date_vote_started",
						render: (_, row) => (
							<div className="flex items-center gap-1 text-default">
								<p>{dayjs(row.date_vote_started)?.isValid() && dayjs(row.date_vote_started).format("HH:mm DD.MM.YYYY")}</p>
								<p>—</p>
								<p>{dayjs(row.date_vote_finished)?.isValid() && dayjs(row.date_vote_finished).format("HH:mm DD.MM.YYYY")}</p>
							</div>
						)
					},
				]}
				data={query?.data?.items}
				loading={query?.isPending}
				header={
					<div className="w-full flex items-center justify-end gap-4">
						<Components.Button
							variant="primary"
							onClick={() => navigator(jams_paths.create)}
						>
							<BiPlus />
							{t("buttons.add_jam")}
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

export default Jams;
