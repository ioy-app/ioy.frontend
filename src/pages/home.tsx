import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { Button, Game, Input, Spin, Tag } from "@/components";
import { search_paths } from "@/routes/search";
import { games_list } from "@/api/routes/games";
import { useTranslation } from "react-i18next";
import GameProps from "@/types/game";

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
        navigation(search_paths.list + "?" + search.toString());
    }

    const search: string = watch("search");

    return (
        <Spin loading={isFetching}>
            <div className="flex w-full min-h-full h-fit flex-1 flex-col gap-8 items-center justify-center">
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
            </div>
        </Spin>
    );
}

export default Home;