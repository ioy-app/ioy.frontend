import Button from "@/components/base/button";
import Spin from "@/components/base/spin";
import { user_paths } from "@/routes/user";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BiArrowFromRight, BiArrowToRight, BiChevronsRight, BiLinkExternal, BiRightArrow, BiRightArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Block: React.FC<{
    title: string;
    id?: string;
    request: (page: number, count: number) => Promise<{
        items: unknown[];
        total: number;
    }>;
    Component: React.ElementType;
}> = ({
    title,
    id,
    request,
    Component
}) => {
    const navigator = useNavigate();
    const { t } = useTranslation();

    const {
        isFetching,
        data,
    } = useQuery({
        queryKey: [ "profile", id ],
        queryFn: async () => {
            const count: number = 10;
            return request(1, count);
        }
    });

    if (!data?.items?.length)
        return null;

    return (
        <div className="border border-gray-200 rounded-xl overflow-clip py-4 px-4 gap-4 flex flex-col">
            <div className="bg-white flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-default">{title}</p>
                    <p className="text border border-gray-200 px-2 py-1 rounded-xl text-gray-700">{data?.total || 0}</p>
                </div>
                {(data?.total > 10) && (
                    <Button
                        type="text"
                        onClick={() => navigator(`./${id}`)}
                    >
                        {t("buttons.open")}
                        <BiChevronsRight />
                    </Button>
                )}
            </div>
            <div>
                <Spin loading={isFetching}>
                    <div className="flex gap-4 overflow-hidden flex-wrap">
                        {Component && data?.items?.map((item, i: number) => (
                            <Component
                                {...item as any}
                                key={i}
                            />
                        ))}
                    </div>
                </Spin>
            </div>
        </div>
    );
}

export default Block;