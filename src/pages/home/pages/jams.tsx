import { jams_list } from "@/api/routes/jams";
import { Button } from "@/components";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";

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
	const [date_from, setDateFrom] = useState<string>("2026-02-01");
	const [date_to, setDateTo] = useState<string>("2026-02-29");

	const query = useQuery({
		queryKey: ["jams", date_from, date_to],
		queryFn: async () => {
			const response = await jams_list(date_from, date_to);
			return response;
		},
	});

	const days = dayjs(date_from).daysInMonth();
	const placeholder = dayjs(date_from).format("MM/YYYY");
	const calendar_days = [];
	for (let i = 0; i < days; i++) {
		const jams = query?.data?.items?.filter((jam) => {
			const isValid = dayjs(dayjs(date_from).date(i + 1)).isBetween(
				jam.date_started,
				jam.date_finished,
			);

			return isValid;
		});
		calendar_days.push({
			day: i + 1,
			jams,
			isCurrent:
				dayjs(dayjs(date_from).set("date", i + 1)).format("YYYY-MM-DD") ==
				dayjs(Date.now()).format("YYYY-MM-DD"),
		});
	}

	return (
		<div className="flex flex-col gap-2 p-4 border border-br rounded-xl w-full">
			<div className="text-placeholder w-full flex items-center justify-center gap-4">
				<Button
					variant="text"
					onClick={() => {
						const newdate = dayjs(date_from).subtract(1, "month");
						setDateFrom(newdate.format("YYYY-MM-DD"));
						setDateTo(newdate.endOf("month").format("YYYY-MM-DD"));
					}}
				>
					<BiChevronLeft />
				</Button>
				<p>{placeholder}</p>
				<Button
					variant="text"
					onClick={() => {
						const newdate = dayjs(date_from).add(1, "month");
						setDateFrom(newdate.format("YYYY-MM-DD"));
						setDateTo(newdate.endOf("month").format("YYYY-MM-DD"));
					}}
				>
					<BiChevronRight />
				</Button>
			</div>
			<div className="grid grid-cols-7 gap-0">
				{calendar_days?.length &&
					calendar_days.map((node, i) => (
						<div
							key={i}
							className={`w-full aspect-square text-default flex flex-col items-stretch ${(node.isCurrent && "bg-br") || "bg-back"}`}
						>
							<p className="px-4 py-2">{node.day}</p>
							<div className="flex flex-col gap-1">
								{node?.jams?.slice(0, 3)?.map((jam, i) => (
									<div
										className={`w-full h-6 bg-primary flex justify-center items-center nth-[2n]:bg-second`}
									>
										<p className="text-white text-[10pt] w-[60%] overflow-hidden text-nowrap truncate">
											{jam.title}
										</p>
									</div>
								))}
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default Jams;
