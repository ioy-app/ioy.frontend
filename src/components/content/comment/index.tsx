import { useTranslation } from "react-i18next";
import User from "../user";
import CommentProps from "@/types/comment";
import {
	BiDownArrowAlt,
	BiHeart,
	BiMessageError,
	BiReply,
	BiTrash,
} from "react-icons/bi";
import dayjs from "dayjs";
import Button from "@/components/base/button";
import { useEffect, useState } from "react";
import CommentForm from "./form";
import Popup from "@/components/base/popup";
import { useSelector } from "react-redux";
import { StoreProps } from "@/stories";
import { useModal } from "@/hooks";
import Report from "@/components/custom/report";

const Comment: React.FC<
	CommentProps & {
		/** Like event */
		onLike?: (id: number) => void;
		/** Submit event */
		onOk?: (id: number, comment: string) => void;
		/** Delete event */
		onDelete?: (id: number, comment: string) => void;
		/** Load next comments page */
		onLoadNext?: (offset: number) => void;
		/** Disabled */
		disabled?: boolean;
	}
> = (props) => {
	const { t } = useTranslation();
	const [isReply, setReply] = useState<boolean>(false);
	const { token } = useSelector(
		(state: StoreProps) => state.login,
	);
	const { modal } = useModal();

	useEffect(() => {
		setReply(false);
	}, [props.id]);

	const offset = props.answers?.length;
	const max = props.answers_total;
	

	return (
		<div className="w-full flex flex-col gap-4">
			{props.deleted ? (
				<div className="flex flex-row gap-4 items-center font-roboto text-gray-400 p-4 border border-gray-200 rounded-xl">
					<BiTrash className="size-6" />
					{t("games.comments.deleted")}
				</div>
			) : (
				<>
					<div>
						<User
							size={12}
							login={props.author.login}
							dataSource={props.author}
							className="inline-flex flex-row w-fit items-center gap-4"
						/>
					</div>
					<div className="p-4 border border-gray-200 rounded-xl">
						<p className="text-lg">{props.comment}</p>
						<div className="flex flex-col gap-1 w-full items-end text-[13pt] font-extralight">
							<p>
								{dayjs(props?.date_created).format(
									"HH:mm DD.MM.YYYY",
								)}
							</p>
							{props?.date_updated && (
								<p>
									{t("games.labels.edited")}:{" "}
									{dayjs(props?.date_updated).format(
										"HH:mm DD.MM.YYYY",
									)}
								</p>
							)}
						</div>
					</div>
					<div className="flex items-center gap-4 justify-between w-full">
						<Button
							variant={
								token
									? props.is_like
										? "second"
										: "default"
									: "text"
							}
							onClick={() =>
								props?.onLike && props.onLike(props.id)
							}
							disabled={!token}
						>
							<BiHeart />
							{props.likes}
						</Button>
						{token && (
							<div className="flex items-center gap-4">
								<Popup label={t("helps.reply")}>
									<Button
										variant="default"
										onClick={() => setReply(true)}
									>
										<BiReply />
									</Button>
								</Popup>
								{props?.is_me ? (
									<Popup label={t("helps.delete")}>
										<Button
											variant="default"
											onClick={() =>
												props?.onDelete &&
												props.onDelete(
													props.id,
													props.comment,
												)
											}
											disabled={!token}
										>
											<BiTrash />
										</Button>
									</Popup>
								) : (
									<Popup label={t("helps.report")}>
										<Button
											variant="default"
											onClick={() => modal("", (onClose) => (
												<Report
													type="comment"
													onClose={onClose}
													target_id={props.id}
													Instance={(
														<div className="flex flex-col gap-4 w-full">
															<User
																size={12}
																login={props.author.login}
																dataSource={props.author}
																className="inline-flex flex-row w-fit items-center gap-4"
																nolink
															/>
															<p className="w-full text-default p-4 border border-br rounded-xl">{props.comment}</p>
															<p className="w-full text-right text-placeholder">{dayjs(props.date_created)?.format("HH:mm DD.MM.YYYY")}</p>
														</div>
													)}
												/>
											))}
										>
											<BiMessageError />
										</Button>
									</Popup>
								)}
							</div>
						)}
					</div>
					{isReply && (
						<CommentForm
							isReply
							onClose={() => setReply(false)}
							onOk={(comment) => {
								setReply(false);
								props.onOk && props.onOk(props.id, comment);
							}}
						/>
					)}
				</>
			)}
			{props?.answers?.length > 0 && (
				<div className="flex flex-col gap-4 border-l border-l-gray-200 ml-4 pl-4">
					{props?.answers?.map(
						(comment: CommentProps, i: number) => (
							<Comment
								onLike={props.onLike}
								onOk={props.onOk}
								onDelete={props.onDelete}
								onLoadNext={props.onLoadNext}
								disabled={props.disabled}
								{...comment}
								key={`answer-${props.id}-${i}`}
							/>
						),
					)}
					{offset < max && (
						<Button
							variant="primary"
							htmlType="button"
							onClick={(e) => {
								e.preventDefault();
								props.onLoadNext &&
									props.onLoadNext(offset);
							}}
							disabled={props.disabled}
						>
							<BiDownArrowAlt />
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

export default Comment;
