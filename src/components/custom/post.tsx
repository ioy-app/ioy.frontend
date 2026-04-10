import GameProps from "@/types/game";
import JamProps from "@/types/jam";
import Game from "../content/game";
import User from "../content/user";
import { useTranslation } from "react-i18next";
import Tag from "./tag";
import dayjs from "dayjs";
import { NavLink } from "react-router";
import { games_paths } from "@/routes/games";
import { jams_paths } from "@/routes/jams";
import Jam from "../content/jam";

/**
 * Post for feed
 * @example
 * return <Post />
*/
const Post: React.FC<{
  data: JamProps | GameProps;
  type?: "game" | "jam";
}> = ({
  data,
  type="game"
}) => {
  const {
    title,
    description,
    tags,
    author_data,
    ...props
  } = data;
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div>
          <User
            dataSource={author_data}
            login={author_data?.login}
            size={12}
            className="flex-row flex w-fit"
          />
        </div>
        <p className="text-placeholder">{t(`feed.label.${type}`)}</p>
      </div>
      <div className="p-4 border border-br rounded-xl w-full flex flex-col gap-4 justify-center items-center">
        {(type == "game" && data) && (
          <>
            <NavLink
              className="flex flex-col gap-4 items-center group"
              to={games_paths.details(props?.id)}
            >
              <Game
                dataSource={props}
                nolink
              />
              <p className="text-default text-center group-hover:text-primary transition-colors">{title}</p>
            </NavLink>
            <p className="text-default text-center">{description}</p>
            {data?.tags?.length > 0 && (
              <div className="flex flex-row items-center gap-4 flex-wrap">
                {data?.tags?.map((tag: string, i: number) => (
                  <Tag
                    title={tag}
                    key={i}
                  />
                ))}
              </div>
            )}
          </>
        )}
        {(type == "jam" && data) && (
          <>
            <NavLink
              className="flex flex-col gap-4 items-center group"
              to={jams_paths.details(props?.id)}
            >
              <Jam
                dataSource={props}
                nolink
              />
              <p className="text-default text-center group-hover:text-primary transition-colors">{title}</p>
            </NavLink>
            <p className="text-default text-center">{description}</p>
            {data?.nominations?.length > 0 && (
              <div className="flex flex-row items-center gap-4 flex-wrap">
                {data?.tags?.map((tag: string, i: number) => (
                  <Tag
                    title={tag}
                    key={i}
                    nolink
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-end w-full">
        <p className="text-placeholder">{dayjs(data.date_created).format("HH:mm DD.MM.YYYY")}</p>
      </div>
    </div>
  );
}

export default Post;