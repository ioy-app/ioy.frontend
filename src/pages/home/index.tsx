import * as Components from "@/components";

import "./style.less";
import { useAPI } from "../../hooks";
import { Routes } from "@/api";
import { BiSearch } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { search_paths } from "@/routes/search";

export default function Home() {
    const [ data, isLoading, error ] = useAPI(Routes.games.list, (localData) => {
        return localData;
    });

    const [ searchParams, setSearchParams ] = useSearchParams();
    const navigation = useNavigate();
    const { handleSubmit, register } = useForm();

    const submit = (fd) => {
        const search = new URLSearchParams(fd);
        navigation(search_paths.list + "?" + search.toString());
    }

    return (
        <Components.Spin loading={isLoading as boolean}>
            <div className="flex w-full flex-1 flex-col gap-8 py-4 px-10 items-center justify-center">
                <div className="flex flex-col gap-4 lg:w-2xl md:w-full">
                    <form className="flex flex-row gap-2" onSubmit={handleSubmit(submit)}>
                        <Components.Input
                            type="search"
                            placeholder="Search..."
                            {...register("search")}
                        />
                        <Components.Button
                            type="second"
                            htmlType="submit"
                        >
                            <BiSearch />
                        </Components.Button>
                    </form>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {data?.tags?.map((tag: string, index: number) => (
                            <NavLink to={search_paths.list + "?search=" + tag} className="cursor-pointer">
                                <Components.Tag title={tag} key={index} />
                            </NavLink>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                    {data?.games?.map((game, index) => (<Components.Game dataSource={game} key={index} />))}
                </div>
            </div>
        </Components.Spin>
    );
}