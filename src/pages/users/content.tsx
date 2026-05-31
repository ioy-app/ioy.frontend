import confOrder from "@/configs/order.json";

import {
	Button,
	Game,
	MasonryTable,
	Pagination,
	Picture,
	Select,
	Spin,
	User,
} from "@/components";
import { paths } from "@/routes";
import { UserProps } from "@/types";
import GameProps from "@/types/game";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	BiArrowBack,
	BiArrowToBottom,
	BiChevronsLeft,
	BiDownArrowAlt,
	BiRightArrowAlt,
	BiX,
} from "react-icons/bi";
import {
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";

export default function UserContent({
	id,
	fn,
	login,
	onClose,
}: {
	id: string;
	fn: (
		login: string,
		us: URLSearchParams,
	) => Promise<Response>;
}) {
	const { t } = useTranslation();
	const [page, setPage] = useState<number>(1);
	const per_page = 40;
	const [order, setOrder] = useState<string>("new");

	const query = useQuery({
		queryKey: ["user", login, "content", id, page, order],
		queryFn: async () => {
			const us = new URLSearchParams();
			us.set("offset", String((page - 1) * per_page));
			us.set("limit", String(per_page));
			us.set("sort", String(order));

			const response = await fn(login, us);
			return response;
		},
	});

	const sorOptions = confOrder?.map((item) => {
		item.label = t(item.label);
		return item;
	});

	return (
		<div className="w-full gap-4 flex flex-col flex-1">
			<div className="w-full flex flex-col gap-2 items-start">
				<div className="w-full flex flex-row items-center justify-between gap-4">
					<p className="text-title">
						{t(`profile.titles.${id}`)}
					</p>
					<Select
						options={sorOptions}
						className="w-50"
						value={sorOptions.find((v) => v.value == order)}
						onChange={({ target: { value } }) => {
							setOrder(value);
							setPage(1);
						}}
					/>
					<Button
						onClick={() => onClose && onClose()}
						variant="text"
						className="text-2xl"
					>
						<BiX />
					</Button>
				</div>
			</div>
			<div className="flex flex-col gap-8 flex-1">
				<Spin loading={query.status == "pending"}>
					{id == "pictures" ? (
						<MasonryTable
							pictures={query?.data?.items}
							nolink
							onClick={(id: number) => onClose && onClose(paths.pictures.details(id))}
						/>
					) : (
						<div className="grid grid-cols-5 max-lg::grid-cols-4 max-md:grid-cols-3 gap-4 w-full h-fit">
							{query?.data?.items?.map(
								(item: GameProps | UserProps, i: number) => {
									switch (id) {
										case "subscribers":
											return (
												<div>
													<User
														login={(item as UserProps).login}
														nolink
														size="large"
														vertical
														onClick={(_login) =>
															onClose &&
															onClose(
																paths.users.details(_login),
															)
														}
													/>
												</div>
											);
											break;
										case "pictures":
											return (
												<Picture
													dataSource={item}
													nolink
													size="full"
													onClick={(id) =>
														onClose &&
														onClose(paths.pictures.details(id))
													}
												/>
											);
										break;
										default:
											return (
												<div>
													<Game
														dataSource={item as GameProps}
														nolink
														size="full"
														onClick={(id) =>
															onClose &&
															onClose(paths.games.details(id))
														}
													/>
												</div>
											);
											break;
									}
								},
							)}
						</div>
					)}
				</Spin>
				<div className="flex justify-center items-center">
					<Pagination
						current={page}
						total={query?.data?.total}
						per_page={per_page}
						onChange={(offset, page) => setPage(page)}
						disabled={query?.status == "pending"}
					/>
				</div>
			</div>
		</div>
	);
}
