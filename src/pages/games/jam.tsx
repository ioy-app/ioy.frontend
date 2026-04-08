import { Jam } from "@/components";
import JamProps from "@/types/jam";
import { useTranslation } from "react-i18next";

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
      {data?.status == "voting" && (
        <div className="flex flex-col gap-4 border border-br rounded-xl p-4 h-fit w-full">
        </div>
      )}
    </div>
  );
}

export default JamBlock;