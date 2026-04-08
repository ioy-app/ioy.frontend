import { jams_list } from "@/api/routes/jams";
import { Button, Jam, Spin, Table } from "@/components";
import JamProps from "@/types/jam";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { BiX } from "react-icons/bi";

/**
 * Modal window for jams
 * @example
 * return <ModalJams />
*/
const ModalJams: React.FC<{
  onClose: (jam_id?: number) => void;
  date: string;
}> = ({
  onClose,
  date
}) => {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: [ "jams", date ],
    queryFn: async () => {
      return (await jams_list(date, date));
    }
  });

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="flex gap-4 justify-between items-center w-full">
        <p className="text-description">{dayjs(date).format("DD/MM/YYYY")}</p>
        <Button
          variant="text"
          onClick={() => onClose()}
        >
          <BiX />
        </Button>
      </div>
      <Spin loading={query.status == "pending"}>
        <div className="flex flex-col gap-4 w-full">
          {query?.data?.items?.map((jam, i) => (
            <div
              className="group flex items-center gap-2 w-fit cursor-pointer"
              key={i}
              onClick={() => onClose && onClose(jam.id)}
            >
              <Jam
                dataSource={
                  {
                    id: jam?.id,
                    is_avatar: jam?.is_avatar,
                  } as JamProps
                }
                nolink
                size={12}
              />
              <p className="text-default group-hover:text-primary">
                {jam?.title}
              </p>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
}

export default ModalJams;