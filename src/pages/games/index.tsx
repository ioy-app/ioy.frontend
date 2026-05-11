import { games_list } from "@/api/routes/games";
import imgEmpty from "@/icons/empty.svg";
import {
	Game,
	Meta,
	Spin,
	Tag,
} from "@/components";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

/**
 * Games pages for home
 * @example
 * return <Games />
*/
const Games: React.FC<{}> = ({}) => {
	const { t } = useTranslation();

	const query = useQuery({
		queryKey: ["home", "games"],
		queryFn: async () => {
			const response = await games_list();
			return response;
		}
	});

	return (
		<>
			<Meta
				title="ioy.app"
				description={t("about.description")}
				url=""
			/>
			<Spin loading={query.isPending}>
				<div className="col-span-4 flex flex-col gap-4 w-full h-fit">
					{!query?.data?.games?.length && (
						<div className="w-full flex justify-center items-center flex-col gap-2">
							<img
								src={imgEmpty}
								className="h-64 pointer-events-none select-none"
							/>
							<p className="text-placeholder text-2xl">{t("errors.nodata")}</p>
						</div>
					)}
					<div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2">
						{query?.data?.games?.map?.((game: GameProps, i: number) => (
							<Game
								dataSource={game}
								key={i}
								size="full"
							/>
						))}
					</div>
					<div className="flex gap-4 flex-wrap justify-center items-center py-8">
						{query?.data?.tags?.map?.((tag: string, i: number) => (
							<NavLink
								to={`/?search=${tag}`}
								className="cursor-pointer"
								key={i}
							>
								<Tag title={tag} />
							</NavLink>
						))}
					</div>
				</div>
			</Spin>
		</>
	);
};

export default Games;