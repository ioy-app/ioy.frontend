import { jams_delete, jams_details, jams_games, jams_join, jams_leave } from "@/api/routes/jams";
import { Button, Code, Game, Jam, Pagination, Report, Spin, Table, Tag, User } from "@/components";
import { useModal } from "@/hooks";
import { paths } from "@/routes";
import { StoreProps } from "@/stories";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { BiCalendarMinus, BiCalendarPlus, BiChevronsLeft, BiMessageError, BiPlus, BiTrash, BiTrophy } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router";

/**
 * Jam details
 * @example
 * return <JamDetails />
*/
export default function JamDetails({}) {
  const params = useParams();
  const navigate = useNavigate();
  const [ searchParams, setSearchParams ] = useSearchParams();
  const { t } = useTranslation();

  const id = Number(params.id);
  const { token } = useSelector(
		(state: StoreProps) => state.login,
	);
  const { modal } = useModal();

  const query = useQuery({
    queryKey: [ "jam", id ],
    queryFn: async () => {
      const response = await jams_details(id);
      return response;
    }
  });

  const max = 10;
  const current_page = Number(searchParams.get("page") || 1);
  const queryGames = useQuery({
    queryKey: [ "jam", id, "games", current_page ],
    queryFn: async () => {
      const search = new URLSearchParams();

			search.set(
				"offset",
				String((current_page - 1) * max),
			);
			search.set("limit", String(max));
      return (await jams_games(id, search));
    }
  });

  const handleJoin = async () => {
    await jams_join(id);
    query.refetch();
  }

  const handleLeave = async () => {
    await jams_leave(id);
    query.refetch();
  }

  const handleDelete = async () => {
    modal(
      t("jams.warnings.delete"),
      (onClose: () => void) => (
        <>
          <Button
            variant="clear"
            onClick={() => onClose()}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="danger"
            onClick={async (e) => {

              try {
                const response = await jams_delete(
                  Number(id),
                );
                onClose();

                modal("", (onClosed: () => void) => (
                  <Code
                    onSubmit={(data) => {
                      query?.refetch();
                      onClosed();
                    }}
                    onCancel={() => onClosed()}
                  />
                ));
              } finally {

              }
            }}
          >
            {t("buttons.delete")}
          </Button>
        </>
      ),
    );
  };

  const handleReport = () =>
		modal(
			() => <></>,
			(onClose) => (
				<Report
					type="jam"
					target_id={query?.data?.id}
					Instance={
						<>
							<Jam
								dataSource={
									{
										id: Number(id),
										is_avatar: query?.data?.is_avatar,
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

  if (query?.status == "error")
    return <Navigate to="/" />;

  return (
    <Spin loading={query?.status == "pending"}>
      <div className="w-full flex flex-col gap-4 items-center">
        {token && (
          <div className="fixed right-0 top-12 p-4 flex flex-col gap-4 z-25">
            {!query?.data?.is_author && !["voting", "finished"].includes(query?.data?.status) && (
              <>
                {(!query?.data?.is_join) ? (
                  <Button
                    variant="primary"
                    htmlType="button"
                    onClick={() => handleJoin()}
                  >
                    {t("buttons.join")}
                    <BiCalendarPlus />
                  </Button>
                ) : (
                  <Button
                    variant="second"
                    htmlType="button"
                    onClick={() => handleLeave()}
                  >
                    {t("buttons.leave")}
                    <BiCalendarMinus />
                  </Button>
                )}
              </>
            )}
            {query?.data?.is_author ? (
              <Button
                variant="danger"
                htmlType="button"
                onClick={() => handleDelete()}
              >
                {t("buttons.delete")}
                <BiTrash />
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => handleReport()}
              >
                <BiMessageError />
                {t("buttons.report")}
              </Button>
            )}
          </div>
        )}
        <div className="w-[65%] max-lg:w-full flex flex-col gap-4 items-start">
          <Button
            variant="text"
            onClick={() => navigate(-1)}
          >
            <BiChevronsLeft />
            {t("buttons.back")}
          </Button>
          <div className="w-full flex flex-col gap-4 justify-center items-center">
            <div>
              <Jam
                dataSource={{
                  is_avatar: query?.data?.is_avatar,
                  id: query?.data?.id
                }}
                size={32}
                nolink
              />
            </div>
            <p className="text-title">{query?.data?.title}</p>
            <div className="border border-br text-placeholder px-4 py-2 rounded-xl">
              {t(`jams.statuses.${query?.data?.status}`)}
            </div>
            <p className="text-default">{query?.data?.description}</p>
            <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <div className="flex flex-col gap-4 p-4 rounded-2xl border border-br items-center">
                <p className="text-placeholder">{t("jams.labels.theme")}</p>
                <div className="border border-primary text-placeholder px-4 py-2 rounded-xl">
                  {query?.data?.theme || t("jams.no_theme")}
                </div>
                <p className="text-placeholder">{t("jams.labels.nominations")}</p>
                <div className="flex gap-4 flex-wrap justify-center items-center">
                  {query?.data?.nominations?.map((title) => (
                    <Tag
                      title={title}
                      nolink
                      icon={<BiTrophy />}
                    />
                  ))}
                </div>
                {query?.data?.judges_data?.length > 0 && (
                  <>
                    <p className="text-placeholder">{t("jams.labels.judges")}</p>
                    <div className="flex gap-4 flex-wrap justify-center items-center">
                      {query?.data?.judges_data?.map(judge => (
                        <div>
                          <User
                            login={judge?.login}
                            dataSource={judge}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-4 p-4 rounded-2xl border border-br items-center text-nowrap">
                <p className="text-placeholder">{t("jams.labels.date_range")}</p>
                <div className="flex items-center gap-1 text-default">
                  <p>{dayjs(query?.data?.date_started)?.isValid() && dayjs(query?.data?.date_started).format("HH:mm DD.MM.YYYY")}</p>
                  <p>—</p>
                  <p>{dayjs(query?.data?.date_finished)?.isValid() && dayjs(query?.data?.date_finished).format("HH:mm DD.MM.YYYY")}</p>
                </div>
                <p className="text-placeholder">{t("jams.labels.vote_range")}</p>
                <div className="flex items-center gap-1 text-default">
                  <p>{dayjs(query?.data?.date_vote_started)?.isValid() && dayjs(query?.data?.date_vote_started).format("HH:mm DD.MM.YYYY")}</p>
                  <p>—</p>
                  <p>{dayjs(query?.data?.date_vote_finished)?.isValid() && dayjs(query?.data?.date_vote_finished).format("HH:mm DD.MM.YYYY")}</p>
                </div>
                <p className="text-placeholder">{t("jams.labels.vote_type.title")}</p>
                <p className="text-primary text-title">{t(`jams.labels.vote_type.${query?.data?.vote_type}`)}</p>
              </div>
            </div>
            <p className="text-placeholder">{t("jams.labels.author")}</p>
              <div className="flex gap-4 flex-wrap justify-center items-center">
                <div>
                  <User
                    login={query?.data?.creater_data?.login}
                    dataSource={query?.data?.creater_data}
                  />
                </div>
              </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="flex gap-4 flex-wrap items-center w-full justify-between">
              <p className="text-title">{t("jams.labels.games")}</p>
              {(!query?.data?.is_author && query?.data?.is_join && query?.data?.status == "in_process") && (
                <Button
                  variant="primary"
                  onClick={() => navigate(paths.jams.create_game(id))}
                >
                  <BiPlus />
                  {t("buttons.add_game")}
                </Button>
              )}
            </div>
            <Table
              columns={[
                {
                  title: t("dashboard.table.games.game"),
                  dataIndex: "id",
                  render: (data, game) => (
                    <Link
                      to={paths.games.details(game?.id)}
                      className="group flex items-center gap-2 w-fit"
                    >
                      <Game
                        dataSource={
                          {
                            id: game?.id,
                            is_avatar: game?.is_avatar,
                            jam_result: game?.jam_result
                          } as GameProps
                        }
                        nolink
                        size={12}
                      />
                      <p className="text-default group-hover:text-primary transition-colors cursor-pointer">
                        {game?.title}
                      </p>
                    </Link>
                  ),
                },
                {
                  title: t("dashboard.table.games.author"),
                  dataIndex: "creater_data",
                  render: (data, game) => (
                    <Link
                      to={paths.users.details(data?.login)}
                      className="group flex items-center gap-2 w-fit"
                    >
                      <User
                        login={data.login}
                        dataSource={{
                          is_avatar: data?.is_avatar,
                        }}
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
                  title: t("dashboard.table.games.version"),
                  dataIndex: "version",
                },
                {
                  title: t(
                    "dashboard.table.games.date_created",
                  ),
                  dataIndex: "date_created",
                  render: (date) =>
                    dayjs(date)?.isValid() &&
                    dayjs(date).format("HH:mm DD.MM.YYYY"),
                },
                {
                  title: t(
                    "dashboard.table.games.date_updated",
                  ),
                  dataIndex: "date_updated",
                  render: (date) =>
                    dayjs(date)?.isValid() &&
                    dayjs(date).format("HH:mm DD.MM.YYYY"),
                },
                {
                  title: t(
                    "dashboard.table.games.place",
                  ),
                  dataIndex: "jam_result",
                  render: (_, data) => data?.jam_result?.place
                },
                {
                  title: t(
                    "dashboard.table.games.score",
                  ),
                  dataIndex: "title",
                  render: (_, data) => data?.jam_result?.score?.toFixed(2)
                }
              ]}
              data={queryGames?.data?.items}
              loading={queryGames?.status == "pending"}
              footer={
                <Pagination
                  total={queryGames?.data?.total || 1}
                  current={current_page}
                  per_page={max}
                  onChange={(offset, page) => {
                    searchParams.set("page", String(page));
                    setSearchParams(searchParams);
                  }}
                />
              }
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}