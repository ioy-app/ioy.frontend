import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { BiSearch, BiSolidHot } from "react-icons/bi";
import { Button, Checkbox, Game, Input, Spin, Tabs, Tag } from "@/components";
import { games_list } from "@/api/routes/games";
import { useTranslation } from "react-i18next";
import GameProps from "@/types/game";
import imgLabel from "@/icons/label.svg";

/**
 * Home page
 * route: /
*/
const Home: React.FC = () => {
    const navigation = useNavigate();
    const {
        handleSubmit,
        register,
        watch
    } = useForm();
    const { t } = useTranslation();

    document.title = t("home.title");

    const {
        isFetching,
        data: {
            games,
            tags
        }
    } = useQuery({
        queryKey: ["home", "games"],
        queryFn: async () => {
            const response = await games_list();
            return (await response.json());
        },
        initialData: () => ({
            games: [],
            tags: []
        })
    });

    const submit = (fd: {
        search: string;
    }) => {
        const search = new URLSearchParams(fd);
        navigation("/?" + search.toString());
    }

    const search: string = watch("search");

    return (
        <Spin loading={isFetching}>
            <div className="flex flex-col gap-4">
                <div className="w-full flex justify-center">
                    <div className="w-[40%] max-md:w-full flex justify-center items-center">
                        <img
                            src={imgLabel}
                            className="w-full p-8"
                        />
                    </div>
                </div>
                <div className="flex gap-4 w-full max-md:flex max-md:flex-col-reverse">
                    <div className="w-70 max-md:w-full">
                        <div className="rounded-xl text-placeholder px-4 py-2 bg-primary text-white w-full relative max-md:rounded-bl-none max-md:rounded-br-none">
                            <p>{t("home.labels.recommendations")}</p>
                            <BiSolidHot
                                className="text-second text-4xl absolute -right-3 -top-3 bg-back rounded-full p-1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4 max-md:flex max-md:gap-4 max-md:flex-wrap max-md:border max-md:border-br max-md:p-4 max-md:rounded-b-xl">
                            {games?.slice(0, 4)?.map((game: GameProps, i: number) => (
                                <Game
                                    dataSource={game}
                                    key={i}
                                />
                            ))}
                        </div>
                    </div>
                    <form className="col-span-4 flex flex-col gap-4 w-full h-fit">
                        <div className="flex gap-4">
                            <Input
                                placeholder={t("home.search.placeholders.search")}
                                type="search"
                            />
                            <Button variant="primary">
                                <BiSearch />
                            </Button>
                        </div>
                        <div className="flex gap-4 flex-wrap justify-start items-center">
                            {tags?.map((tag: string, i: number) => (
                                <NavLink
                                    to={`/?search=${tag}`}
                                    className="cursor-pointer"
                                >
                                    <Tag
                                        title={tag}
                                        key={i}
                                    />
                                </NavLink>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-4 p-4 border border-br rounded-xl">
                                <p className="text-lg font-roboto font-thin">{t("home.search.labels.type")}</p>
                                <Checkbox
                                    placeholder={t("home.search.placeholders.games")}
                                />
                                <Checkbox
                                    placeholder={t("home.search.placeholders.users")}
                                />
                                <Checkbox
                                    placeholder={t("home.search.placeholders.jams")}
                                />
                            </div>
                            <div className="flex flex-col gap-4 p-4 border border-br rounded-xl">
                                <p className="text-lg font-roboto font-thin">{t("home.search.labels.search")}</p>
                                <Checkbox
                                    placeholder={t("home.search.placeholders.tags")}
                                />
                                <Checkbox
                                    placeholder={t("home.search.placeholders.title")}
                                />
                                <Checkbox
                                    placeholder={t("home.search.placeholders.description")}
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <Tabs
                    headers={[
                        {
                            label: t("home.tabs.games"),
                            value: "games"
                        },
                        {
                            label: t("home.tabs.jams"),
                            value: "jams"
                        },
                        {
                            label: t("home.tabs.users"),
                            value: "users"
                        }
                    ]}
                    content={{
                        games: (
                            <div className="flex flex-wrap gap-4 h-fit">
                                {games?.map((game: GameProps, i: number) => (
                                    <Game
                                        dataSource={game}
                                        key={i}
                                    />
                                ))}
                            </div>
                        )
                    }}
                />
                
            </div>
            {/* <div className="flex w-full min-h-full h-fit flex-1 flex-col gap-8 items-center justify-center">
                <div className="flex flex-col gap-4 lg:w-2xl md:w-full">
                    <form className="flex flex-row gap-2" onSubmit={handleSubmit(submit)}>
                        <Input
                            type="search"
                            placeholder={t("home.search")}
                            {...register("search")}
                        />
                        <Button
                            variant="primary"
                            htmlType="submit"
                            disabled={!search}
                        >
                            <BiSearch />
                        </Button>
                    </form>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {tags?.map((tag: string, i: number) => (
                            <NavLink
                                to={`${search_paths.list}?search=${tag}`}
                                className="cursor-pointer"
                            >
                                 <Tag
                                    title={tag}
                                    key={i}
                                />
                            </NavLink>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 h-fit justify-center">
                    {games?.map((game: GameProps, i: number) => (
                        <Game
                            dataSource={game}
                            key={i}
                        />
                    ))}
                </div>
            </div> */}
        </Spin>
    );
}

export default Home;