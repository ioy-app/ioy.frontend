import confOrder from "@/configs/order.json";

import {
	BiBox,
	BiCheck,
	BiEditAlt,
	BiPlus,
	BiReply,
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
import { paths } from "@/routes";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { answer_report, reports } from "@/api/routes/reports";
import { UserProps } from "@/types";
import { useModal } from "@/hooks";
import JamProps from "@/types/jam";

const Reports: React.FC = () => {
	const { t } = useTranslation();
	const { modal } = useModal();
	const [ searchParams, setSearchParams ] = useSearchParams();

	const max = 10;
	const current_page = Number(
		searchParams.get("page") || 1,
	);

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

	const handleOpen = (data, i) => {
		modal("", (onClose) => <ReportAnswer onClose={onClose} data={data} />);
	}

	const methods = useForm();

	useEffect(() => {
		if (searchParams.get("sort"))
			methods.setValue("sort", searchParams.get("sort"));
	}, [searchParams]);

	return (
		<div className="w-full flex flex-col gap-4">
			<Components.Table
				columns={[
					{
						title: t("dashboard.table.reports.target_id"),
						dataIndex: "instance",
						render: (instance, data) => <RenderInstance instance={instance} data={data} />,
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
						title: t("dashboard.table.reports.answer_id"),
						dataIndex: "answerdata",
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
						title: t("dashboard.table.reports.answer"),
						dataIndex: "answer",
					},
					{
						title: t(
							"dashboard.table.reports.date_answered",
						),
						dataIndex: "date_answered",
						render: (date) =>
							dayjs(date)?.isValid() &&
							dayjs(date).format("HH:mm DD.MM.YYYY"),
					}
				]}
				control={(row, i) => (
					<>
						<Components.Button
							variant="second"
							onClick={() => handleOpen(row, i)}
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

const ReportAnswer: React.FC<{
	onClose: () => void;
	data: Record<string, any>;
}> = ({
	onClose,
	data
}) => {
	const { t } = useTranslation();
	const local = useForm();
	const [ isLoading, setLoading ] = useState<boolean>(false);

	const handleSubmit = async (fd) => {
		try {
			setLoading(true);
			const response = await answer_report(data?.id, fd);
			console.log(response);
			onClose && onClose();
		}
		catch(err) {
			console.log(err);
		}
		finally { setLoading(false); }
		//console.log(data, fd);
	}

	return (
		<FormProvider {...local}>
			<form
				className="flex w-full flex-col gap-4"
				onSubmit={local.handleSubmit(handleSubmit)}
			>
				<p className="text-title text-center">{t("report.title")}</p>
				<div className="flex gap-4 items-start">
					<p className="text-placeholder">{t("dashboard.table.reports.target_id")}:</p>
					<RenderInstance data={data} instance={data?.instance} />
				</div>
				<div className="flex gap-4 items-start">
					<p className="text-placeholder">{t("dashboard.table.reports.source_id")}:</p>
					<div className="flex gap-2 items-center">
						<Components.User
							dataSource={
								{
									id: data?.sourcedata?.id,
									is_avatar: data?.sourcedata?.is_avatar,
								} as UserProps
							}
							login={data?.sourcedata?.login}
							nolink
							size={12}
						/>
						<p className="text-default">
							{data?.sourcedata?.login}
						</p>
					</div>
				</div>
				<div className="flex gap-4 items-start">
					<p className="text-placeholder">{t("dashboard.table.reports.message")}:</p>
					<p className="text-default">{data?.message}</p>
				</div>
				<div className="flex flex-col gap-4">
					<Components.Checkbox
						{...local.register("params.ban_instance_3d")}
						placeholder={t("report.params.ban_instance_3d")}
						disabled={isLoading}
					/>
					<Components.Checkbox
						{...local.register("params.ban_instance_30d")}
						placeholder={t("report.params.ban_instance_30d")}
						disabled={isLoading}
					/>
					<Components.Checkbox
						{...local.register("params.delete_instance")}
						placeholder={t("report.params.delete_instance")}
						disabled={isLoading}
					/>
					<Components.Checkbox
						{...local.register("params.unban_instance")}
						placeholder={t("report.params.unban_instance")}
						disabled={isLoading}
					/>
				</div>
				<Components.Textarea
					{...local.register("answer")}
					placeholder={t("report.placeholders.answer")}
					label={t("report.labels.answer")}
					disabled={isLoading}
				/>
				<div className="flex justify-end items-center gap-4">
					<Components.Button
						variant="primary"
						htmlType="submit"
						disabled={isLoading}
					>
						{t("buttons.save")}
						<BiCheck />
					</Components.Button>
				</div>
			</form>
		</FormProvider>
	);
}

const RenderInstance: React.FC<{}> = ({ instance, data }) => {
	switch (data.target_type) {
		case "jam":
			return (
				<div
					className="group flex items-center gap-2 w-fit"
				>
					<Components.Jam
						dataSource={
							{
								id: instance?.id,
								is_avatar: instance?.is_avatar,
							} as JamProps
						}
						nolink
						size={12}
					/>
					<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
						{instance?.title}
					</p>
				</div>
			);
		break;
		case "game":
			return (
				<div
					className="group flex items-center gap-2 w-fit"
				>
					<Components.Game
						dataSource={
							{
								id: instance?.id,
								is_avatar: instance?.is_avatar,
								jam_result: instance?.jam_result
							} as GameProps
						}
						nolink
						size={12}
					/>
					<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
						{instance?.title}
					</p>
				</div>
			);
		break;
		case "picture":
			return (
				<div
					className="group flex items-center gap-2 w-50"
				>
					<Components.Picture
						dataSource={
							{
								id: instance?.id
							} as GameProps
						}
						nolink
						size="full"
					/>
					<p className="text-default group-hover:text-primary transition-colors cursor-pointer">
						{instance?.title}
					</p>
				</div>
			);
		break;
		case "user":
			return (
				<div
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
				</div>
			);
			break;
		case "comment":
			return (
				<div className="flex items-start gap-2 w-full flex-col">
					<div
						className="group flex gap-2 items-center"
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
					</div>
					<p className="text-default border border-br px-4 py-2 rounded-xl w-full">
						{instance?.comment}
					</p>
					<p className="text-placeholder w-full flex justify-end">{dayjs(instance?.date_created).format("HH:mm DD.MM.YYYY")}</p>
				</div>
			);
		break;
	}

	return null;
}

export default Reports;
