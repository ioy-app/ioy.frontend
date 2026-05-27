import confOrder from "@/configs/order.json";
import {
	comments_answers,
	comments_create,
	comments_delete,
	comments_like,
	comments_list,
	comments_reply,
} from "@/api/comments";
import { Button, Select, Spin, ViewModel } from "@/components";
import Comment from "@/components/content/comment";
import CommentForm from "@/components/content/comment/form";
import CommentProps from "@/types/comment";
import { useModal, useNotify } from "@/hooks";
import { StoreProps } from "@/stories";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const Comments: React.FC<{
	type: "game" | "picture"
}> = ({
	type="game"
}) => {
	const params = useParams();
	const id = params?.id;
	const { t } = useTranslation();
	const { notify } = useNotify();
	const { modal } = useModal();
	const queryClient = useQueryClient();
	const [order, setOrder] = useState<"new" | "old">("new");
	const { token, login, is_avatar } = useSelector(
		(state: StoreProps) => state.login,
	);

	const query = useInfiniteQuery({
		queryKey: [ "comments", type, id, order ],
		initialPageParam: 0,
		queryFn: async ({ pageParam }) => {
			const response = await comments_list(
				Number(id),
				{
					offset: pageParam,
					order,
					type
				}
			);
			return response;
		},
		getNextPageParam: (lastPage) => {
			const next =
				Number(lastPage.offset) + Number(lastPage.limit);
			if (next < lastPage.total) return next;

			return null;
		},
	});

	const like = useMutation({
		mutationFn: async (id: number) => {
			const response = await comments_like(Number(id));
			return response;
		},
		onError: (err) => notify(t(err.toString()), "error"),
		onSuccess: (data, params) => {
			const is_like = data?.status == "liked";
			queryClient.setQueryData(
				["comments", type, id, order],
				({ pages, pageParams }) => {
					const recursiveFind = (
						obj: CommentProps,
						visited = new Set<number>(),
					) => {
						if (visited.has(obj.id)) return false;
						visited.add(obj.id);

						if (obj.id == params) {
							obj.is_like = is_like;
							obj.likes +=
								Number(is_like) - Number(!is_like);
							return true;
						} else {
							let isFind = false;
							if (obj?.answers?.length)
								for (const answer of obj.answers)
									if (recursiveFind(answer, visited)) {
										isFind = true;
										break;
									}
							return isFind;
						}
					};

					return {
						pageParams,
						pages: pages.map((page) => {
							page.items.map((comment) => {
								recursiveFind(comment);
								return comment;
							});
							return page;
						}),
					};
				},
			);
		},
	});

	const del = useMutation({
		mutationFn: async (commentid: number) => {
			const response = await comments_delete(
				Number(id),
				Number(commentid),
			);
			return response;
		},
		onError: (err) => notify(t(err.toString()), "error"),
		onSuccess: (data, params) => {
			const is_deleted = data?.status == "deleted";
			notify(
				t(
					`notify.${is_deleted ? "deleted.comment" : "denied"}`,
				),
				is_deleted ? "success" : "warning",
			);
			queryClient.setQueryData(
				["comments", type, id, order],
				({ pages, pageParams }) => {
					const recursiveFind = (
						obj: CommentProps,
						visited = new Set<number>(),
					) => {
						if (visited.has(obj.id)) return false;
						visited.add(obj.id);
						if (!is_deleted) return true;
						if (obj.id == params) {
							obj.deleted = true;
							return true;
						} else {
							let isFind = false;
							if (obj?.answers?.length)
								for (const answer of obj.answers)
									if (recursiveFind(answer, visited)) {
										isFind = true;
										break;
									}
							return isFind;
						}
					};

					return {
						pageParams,
						pages: pages.map((page) => {
							page.items.map((comment) => {
								recursiveFind(comment);
								return comment;
							});
							return page;
						}),
					};
				},
			);
		},
	});

	const create = useMutation({
		mutationFn: async (props: {
			comment_id?: number;
			comment: string;
		}) => {
			let response;
			if (typeof props.comment_id == "undefined")
				response = await comments_create(
					Number(id),
					props.comment,
					type
				);
			else
				response = await comments_reply(
					Number(id),
					Number(props.comment_id),
					props.comment,
				);
			return response;
		},
		onError: (err) => notify(t(err.toString()), "error"),
		onSuccess: (data, params) => {
			const globalComment = {
				...data,
				author: {
					login,
					is_avatar,
				},
				likes: 0,
				is_like: false,
				is_me: true,
			};
			queryClient.setQueryData(
				["comments", type, id, order],
				({ pages, pageParams }) => {
					const recursiveFind = (
						obj: CommentProps,
						visited = new Set<number>(),
					) => {
						if (visited.has(obj.id)) return false;
						visited.add(obj.id);
						if (obj.id == params.comment_id) {
							if (!obj.answers?.length) obj.answers = [];
							obj.answers.unshift(globalComment);
							obj.answers_total = obj.answers.length;
							return true;
						} else {
							let isFind = false;
							if (obj?.answers?.length)
								for (const answer of obj.answers)
									if (recursiveFind(answer, visited)) {
										isFind = true;
										break;
									}
							return isFind;
						}
					};

					return {
						pageParams,
						pages: pages.map((page) => {
							if (typeof params.comment_id == "undefined") {
								page.items.unshift(globalComment);
							} else {
								page.items.map((comment) => {
									recursiveFind(comment);
									return comment;
								});
							}
							return page;
						}),
					};
				},
			);
		},
	});

	const loadNext = useMutation({
		mutationFn: async (props: {
			commentid: number;
			offset: number;
		}) => {
			const response = await comments_answers(
				Number(id),
				Number(props.commentid),
				{
					offset: props.offset,
					limit: 5
				}
			);
			return response;
		},
		onError: (err) => notify(t(err.toString()), "error"),
		onSuccess: (data, params) => {
			queryClient.setQueryData(
				["comments", type, id, order],
				({ pages, pageParams }) => {
					const recursiveFind = (
						obj: CommentProps,
						visited = new Set<number>(),
					) => {
						if (visited.has(obj.id)) return false;
						visited.add(obj.id);
						if (obj.id == params.commentid) {
							if (!obj.answers?.length) obj.answers = [];
							obj.answers.push(...data.items);
							return true;
						} else {
							let isFind = false;
							if (obj.answers)
								for (const answer of obj.answers)
									if (recursiveFind(answer, visited)) {
										isFind = true;
										break;
									}
							return isFind;
						}
					};

					return {
						pageParams,
						pages: pages.map((page) => {
							page.items.map((comment) => {
								recursiveFind(comment);
								return comment;
							});
							return page;
						}),
					};
				},
			);
		},
	});

	const orders = confOrder.map((record) => ({
		...record,
		label: t(record.label),
	}));

	const comments = [].concat(
		...(query.data?.pages?.map((page) => page?.items) ||
			[]),
	);

	return (
		<div className="w-full mt-12 flex flex-col gap-4">
			<div className="w-full flex justify-between items-center gap-4">
				<p className="text-placeholder">
					{t("games.labels.comments")} (
					{query?.data?.pages?.[0]?.total || 0})
				</p>
				<Select
					placeholder={t("games.placeholders.order")}
					options={orders}
					onChange={({ target: { value } }) =>
						setOrder(value as "new" | "old")
					}
					value={orders.find((ord) => ord.value == order)}
					className="w-50"
					disabled={!comments?.length}
				/>
			</div>
			{token && (
				<CommentForm
					onOk={(comment) => create.mutate({ comment })}
				/>
			)}
			<Spin loading={query?.isPending}>
				<InfiniteScroll
					className="w-full gap-4 flex flex-col"
					dataLength={comments?.length}
					next={() => query.fetchNextPage()}
					hasMore={query.hasNextPage}
					loader={(<Spin loading/>)}
					endMessage={(
						<div className="flex flex-col justify-center items-center py-4 gap-2 text-xl text-text/35">
							<ViewModel
								name="computer-comments"
								href="/resources/gltf/computer.gltf"
								spdX={.2}
								spdY={-.5}
							/>
							<p>{t("games.comments.empty")}</p>
						</div>
					)}
				>
					{comments?.map((comment, i) => (
						<Comment
							{...comment}
							key={i}
							onLike={(id) => like.mutate(id)}
							onOk={(comment_id, comment) =>
								create.mutate({
									comment_id,
									comment,
								})
							}
							onLoadNext={(offset) =>
								loadNext.mutate({
									commentid: comment.id,
									offset,
								})
							}
							onDelete={(comment_id, comment_text) => {
								modal(
									() => (
										<div className="flex flex-col gap-2">
											<p className="text-placeholder">
												{t("games.comments.confirm")}
											</p>
											<div className="w-full p-4 border border-br rounded-xl">
												{comment_text}
											</div>
										</div>
									),
									(onClose) => (
										<div className="pt-4 w-full flex items-center gap-4 justify-end">
											<Button onClick={() => onClose()}>
												{t("buttons.cancel")}
											</Button>
											<Button
												variant="danger"
												onClick={() => {
													onClose();
													del.mutate(comment_id);
												}}
											>
												{t("buttons.ok")}
											</Button>
										</div>
									),
								);
							}}
							disabled={loadNext.isPending}
						/>
					))}
				</InfiniteScroll>
			</Spin>
		</div>
	);
};

export default Comments;
