import { pictures_details, pictures_like } from "@/api/routes/pictures";
import { Button, LinkifyText, Picture, Report, Spin, Tag, User } from "@/components";
import Popup from "@/components/base/popup";
import { useModal, useNotify } from "@/hooks";
import { StoreProps } from "@/stories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BiChevronsLeft, BiCopyAlt, BiHeart, BiMessageError, BiShare } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router";
import Auth from "../auth";
import Comments from "../games/comments";

/**
 * Details for pictures
 * @example
 * return <PictureDetails />
*/
export default function PictureDetails({}) {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const id = params?.id;
  const { modal } = useModal();
  const queryClient = useQueryClient();
  const { token } = useSelector(
		(state: StoreProps) => state.login,
	);
  const { notify } = useNotify();

  const query = useQuery({
    queryKey: [ "picture", id ],
    queryFn: () => pictures_details(id)
  });

  const report = () =>
		modal(
			() => <></>,
			(onClose) => (
				<Report
					type="picture"
					target_id={query?.data?.id}
					Instance={
						<>
							<Picture
								dataSource={
									{
										id: Number(id)
									} as any
								}
								nolink
							/>
							<h1 className="text-title">
								{query?.data?.title}
							</h1>
						</>
					}
					onClose={onClose}
				/>
			),
		);

  const repost = () => {
		const url = window.location.href;
		modal(
			() => (
				<div className="flex flex-col gap-2 w-full items-center">
					<Picture
						dataSource={
							{
								id
							} as any
						}
						nolink
					/>
					<p className="text-title">{query?.data?.title}</p>
					<p className="text-default max-w-xl line-clamp-2 text-center ...">
						{query?.data?.description}
					</p>
					<p className="w-full text-placeholder">
						{t("games.labels.share")}
					</p>
					<div className="text-default p-4 w-full rounded-xl border border-br flex flex-row gap-4 justify-between items-center text-text">
						<p>{url}</p>
						<BiCopyAlt />
					</div>
				</div>
			),
			(onClose) => (
				<div className="flex w-full pt-4 justify-end items-center">
					<Button
						variant="primary"
						onClick={() => onClose()}
					>
						{t("buttons.ok")}
					</Button>
				</div>
			),
		);
	};

  const like = useMutation({
		mutationFn: async () => {
			if (!token) {
				modal(Auth, () => <></>);
				return false;
			}
			const response = await pictures_like(Number(id));
			return response;
		},
		onError: (err) => notify(t(err?.message?.toString()), "error"),
		onSuccess: (data) => {
			if (!data) return;
			const is_like = data?.status == "liked";
			notify(
				t(`notify.${is_like ? "like" : "unlike"}`),
				is_like ? "success" : "warning",
			);
			queryClient.setQueryData(
				["picture", id],
				(current) => ({
					...current,
					is_like
				})
			);
		},
	});

	if (query?.isError)
		return (<Navigate to="/" />);
  
  return (
    <Spin loading={query?.isPending}>
      <div className="w-full flex flex-col gap-4 items-center">
        <div className="w-[65%] max-lg:w-full flex flex-col gap-4 items-start">
          <Button
            variant="text"
            onClick={() => navigate(-1)}
          >
            <BiChevronsLeft />
            {t("buttons.back")}
          </Button>
          <h1 className={`text-title ${query?.data?.hype && "text-amber-300" || ""}`}>
            {query?.data?.title}
          </h1>
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="w-full h-fit">
              <Picture
                dataSource={
                  {
                    id: Number(id),
                    jam_result: query?.data?.jam_result
                  } as any
                }
                size="full"
                nolink
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row gap-4 justify-between items-center">
                <div>
                  <User
                    dataSource={query?.data?.creater_data}
                    login={query?.data?.creater_data?.login}
                    size={12}
                    className="flex-row w-fit gap-4"
                  />
                </div>
                <div className="flex justify-end gap-4 items-center">
                  <Popup
                    align="b"
                    label={t(
                      query?.data?.is_like
                        ? "helps.unlike"
                        : "helps.like",
                    )}
                  >
                    <Button
                      variant={
                        (query?.data?.is_like && "second") ||
                        "default"
                      }
                      onClick={() => like.mutate()}
                      disabled={like.isPending}
                      loading={like.isPending}
                    >
                      <BiHeart />
                    </Button>
                  </Popup>
                  <Popup align="b" label={t("helps.share")}>
                    <Button onClick={() => repost()}>
                      <BiShare />
                    </Button>
                  </Popup>
                  <Popup align="b" label={t("helps.report")}>
                    <Button
                      variant="default"
                      onClick={() => report()}
                    >
                      <BiMessageError />
                    </Button>
                  </Popup>
                </div>
              </div>
              {query?.data?.description && (
								<div className="flex flex-col gap-2 w-full">
									<p className="text-placeholder">
										{t("games.labels.description")}
									</p>
									<div className="p-4 border border-br rounded-xl flex flex-col gap-4 w-full">
										<LinkifyText>
											{query?.data?.description}
										</LinkifyText>
										
									</div>
								</div>
							)}
							<div className="flex flex-row flex-wrap gap-4">
								{query?.data?.tags?.map(
									(tag: string, i: number) => (
										<Tag
											title={tag}
											key={i}
											link="/pictures"
										/>
									),
								)}
							</div>
            </div>
            <Comments type="picture" />
          </div>
        </div>
      </div>
    </Spin>
  );
}