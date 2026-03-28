import { jams_details } from "@/api/routes/jams";
import { Button, Game, Jam, Pagination, Spin, Table, Tag, User } from "@/components";
import { paths } from "@/routes";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { BiCalendarPlus, BiChevronsLeft, BiPlus } from "react-icons/bi";
import { Link, useNavigate, useParams } from "react-router";

/**
 * Jam details
 * @example
 * return <JamDetails />
*/
export default function JamDetails({}) {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const id = Number(params.id);

  const query = useQuery({
    queryKey: [ "jam", id ],
    queryFn: async () => {
      const response = await jams_details(id);
      return response;
    }
  });

  return (
    <Spin loading={query?.status == "pending"}>
      <div className="w-full flex flex-col gap-4 items-center">
        <div className="fixed right-0 top-12 p-4 flex flex-col gap-4 z-25">
          <Button
            variant="primary"
            htmlType="button"
          >
            {t("buttons.join")}
            <BiCalendarPlus />
          </Button>
        </div>
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
            <p className="text-default">{query?.data?.description}</p>
            <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <div className="flex flex-col gap-4 p-4 rounded-2xl border border-br items-center">
                <p className="text-placeholder">{t("jams.labels.nominations")}</p>
                <div className="flex gap-4 flex-wrap justify-center items-center">
                  {query?.data?.nominations?.map((title) => (
                    <Tag
                      title={title}
                      nolink
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
          </div>
          <div className="w-full flex flex-col gap-4">
            <p className="text-title">{t("jams.labels.games")}</p>
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
              ]}
              data={[]}
              loading={false}
              // footer={
              //   <Pagination
              //     total={searchQuery?.data?.total || 1}
              //     current={current_page}
              //     per_page={max}
              //     onChange={(offset, page) => {
              //       searchParams.set("page", String(page));
              //       setSearchParams(searchParams);
              //     }}
              //   />
              // }
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}