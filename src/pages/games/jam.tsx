import { Jam, Vote } from "@/components";
import { VotingOne, VotingThird, VotingTwo } from "@/icons";
import JamProps from "@/types/jam";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

/**
 * Jam component for game details
 * @example
 * return <JamBlock />
*/
const JamBlock: React.FC<{
  data: JamProps
}> = ({
  data
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const game_id = Number(params.id);


  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full items-center gap-4 justify-between">
        <div className="w-fit">
          <Jam
            dataSource={data}
            size={12}
            className="flex-row w-fit gap-4"
          />
        </div>
        <div className="border border-br text-placeholder px-4 py-2 rounded-xl">
          {t(`jams.statuses.${data?.status}`)}
        </div>
      </div>
      {(data?.status != "voting") && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-placeholder">{t("jams.labels.voting")}</p>
          <div className="grid grid-cols-3 max-md:grid-cols-2 place-content-stretch gap-4 h-fit w-full">
            {data?.nominations?.map((nomination: string, i: number) => (
              <Vote
                jam_id={data?.id}
                game_id={game_id}
                nomination={nomination}
                key={i}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default JamBlock;