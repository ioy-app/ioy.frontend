import { jams_list } from "@/api/jams";
import { Button, Jam, Spin } from "@/components";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import {
	BiChevronLeft,
	BiChevronRight,
	BiX,
} from "react-icons/bi";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";
import { Routes } from "@/api";
import { useModal } from "@/hooks";
import ModalJams from "./modal";
import { paths } from "@/routes";
import { useNavigate } from "react-router";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

/**
 * Jam's calendar
 *
 * @example
 * return <Jams />
 */
const Jams: React.FC = () => {
	const navigator = useNavigate();
	const [ date_from, setDateFrom ] =
		useState<string>(dayjs().startOf('month').format("YYYY-MM-DD"));
	const [ date_to, setDateTo ] =
		useState<string>(dayjs().endOf('month').format("YYYY-MM-DD"));
	const { modal } = useModal();

	const query = useQuery({
		queryKey: [ "jams", date_from, date_to ],
		queryFn: async () => {
			const response = await jams_list(date_from, date_to);
			return response;
		},
	});

	const days = dayjs(date_from).daysInMonth();
	const placeholder = dayjs(date_from).format("MM/YYYY");
	const start_day = dayjs(date_from).startOf('month').day() - 1;
	const calendar_days = [];
	for (let i = 0; i < start_day; i++)
		calendar_days.push(null);
	for (let i = 0; i < days; i++) {
		const date = dayjs(date_from).set("day", i + start_day + 1);
		const jams = query?.data?.items?.filter((jam) => {
			const current_date = dayjs(date?.format("YYYY-MM-DD"));
			const date_start = dayjs(jam?.date_started)?.format("YYYY-MM-DD");
			const date_end = dayjs(jam?.date_finished)?.format("YYYY-MM-DD");

			const isValid = current_date.isBetween(date_start, date_end) || 
						current_date.isSame(date_start) ||
						current_date.isSame(date_end);

			return isValid;
		});
		calendar_days.push({
			jams,
			date: date.format("YYYY-MM-DD"),
			isCurrent: date.format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD")
		});
	}

	const handleDayDetails = (date: string) => modal(
		"",
		(onClose) => (
			<ModalJams
				onClose={(jam_id?: number) => {
					onClose && onClose();
					if (jam_id)
						navigator(paths.jams.details(jam_id));
				}}
				date={date}	
			/>
		)
	);

	return (
		<div className="flex flex-col gap-2 p-4 border border-br rounded-xl w-full">
			<div className="text-placeholder w-full flex items-center justify-center gap-4">
				<Button
					variant="text"
					onClick={() => {
						const newdate = dayjs(date_from).subtract(
							1,
							"month",
						);
						setDateFrom(newdate.format("YYYY-MM-DD"));
						setDateTo(
							newdate.endOf("month").format("YYYY-MM-DD"),
						);
					}}
				>
					<BiChevronLeft />
				</Button>
				<p>{placeholder}</p>
				<Button
					variant="text"
					onClick={() => {
						const newdate = dayjs(date_from).add(
							1,
							"month",
						);
						setDateFrom(newdate.format("YYYY-MM-DD"));
						setDateTo(
							newdate.endOf("month").format("YYYY-MM-DD"),
						);
					}}
				>
					<BiChevronRight />
				</Button>
			</div>
			<div className="grid grid-cols-7 gap-0">
				{calendar_days?.length &&
					calendar_days.map((node, i) => {
						if (!node)
							return (
								<div
									key={i}
									className={`w-full aspect-square text-default flex flex-col items-stretch "bg-back"}`}
								/>
							);
						return (
							<div
								key={i}
								className={`transition-colors cursor-pointer rounded-xl w-full aspect-square text-default flex flex-col items-stretch hover:bg-br/80 ${(node.isCurrent && "bg-br/40") || "bg-back"}`}
								onClick={() => handleDayDetails(node.date)}
							>
								<p className="px-4 py-2">{dayjs(node.date)?.format("DD")}</p>
								<div className="flex flex-col gap-1">
									{node?.jams?.slice(0, 2)?.map((jam, i) => (
										<div
											className={`w-full h-6 bg-primary flex justify-center items-center nth-[2n]:bg-second`}
										>
											<p className="text-white text-default w-[60%] overflow-hidden text-nowrap truncate flex items-center gap-2">
												{jam.is_avatar && (
													<div className="w-6 h-6">
														<img
															src={`/api/v1${Routes.jams.icon(jam.id)}`}
															className="w-full h-full"
														/>
													</div>
												)}
												{jam.title}
											</p>
										</div>
									))}
									{node?.jams?.length > 2 && (
										<div className="w-full h-6 bg-second flex justify-center items-center">
											<p>+{node?.jams?.length - 2}</p>
										</div>
									)}
								</div>
							</div>
						);
				})}
			</div>
		</div>
	);
};

export default Jams;