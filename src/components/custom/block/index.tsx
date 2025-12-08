import Button from "@/components/base/button";
import Spin from "@/components/base/spin";
import { useEffect, useState } from "react";
import { BiCollapseAlt, BiExpandAlt } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

const Block: React.FC<{
    title: string;
    id?: string;
    request: (page: number, count: number) => Promise<{
        items: unknown[];
        total: number;
    }>;
    Component: React.ReactNode;
}> = ({
    title,
    id,
    request,
    Component
}) => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ isExpand, setExpand ] = useState<boolean>(searchParams.get("block") == id);
    const [ page, setPage ] = useState<number>(Number(searchParams.get("page") || 1));
    const [ total, setTotal ] = useState<number>(0);
    const [ pages, setPages ] = useState<number>(1);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ data, setData ] = useState<unknown[]>(null);

    const handleLoadContent = async (page: number = 1, ignore?: boolean) => {
        try {
            const block = searchParams.get("block");
            if (block != id && !ignore)
                return;
            setLoading(true);
            
            setData(null);

            const count: number = ignore ? 7 : 20;
            const response = await request(page, count);

            const { items, total } = response;

            setData(items);
            setPages(Math.ceil(total / count));
            setTotal(total);
        }
        catch(err) {
            console.log(err);
        }
        finally { setLoading(false); }
    }

    const handleGetPages = (current_page: number, pages: number) => {
        const arr: number[] = [];

        arr.push(1);
        if (current_page < 3) {
            for (let i = 1; i <= Math.min(4, pages); i++)
                arr.push(i);
        }
        if (current_page > pages - 3) {
            for (let i = Math.max(pages - 3, 1); i <= pages; i++)
                arr.push(i);
        }

        for (let i = Math.max(current_page - 1, 1); i <= Math.min(current_page + 1, pages); i++)
            arr.push(i);
        
        arr.push(pages);

        const new_arr = Array.from(new Set(arr));
        if (new_arr.length <= 1)
            return [];

        return new_arr;
    }

    const handleChangePage = (page: number) => {
        searchParams.set("page", String(page));
        searchParams.set("block", id);
        handleLoadContent(page, false);
        setSearchParams(searchParams);
    }

    useEffect(() => {
        setExpand(searchParams.get("block") == id);
        setPage(Number(searchParams.get("page") || 1));
        handleLoadContent(Number(searchParams.get("page") || 1), searchParams.get("block") != id);
    }, []);

    const current_page = Number(searchParams.get("page") || 1);
    const pagination = handleGetPages(current_page, pages);

    return (
        (data && data?.length > 0) && (
            <>
                <div className={`border border-gray-200 rounded-xl overflow-clip ${isExpand && "min-h-72"}`}>
                    <div className={`bg-white py-4 px-4 flex flex-row justify-between items-center ${isExpand && "border-b border-b-gray-200"}`}>
                        <div className="flex flex-row gap-2 items-center">
                            <p className="text">{title}</p>
                            <p className="text border border-gray-200 px-2 py-1 rounded-xl text-gray-700">{total || 0}</p>
                        </div>
                        {(page !== pages || isExpand) && (
                                <button
                                className="cursor-pointer hover:opacity-50"
                                onClick={() => {
                                    if (isExpand) {
                                        searchParams.delete("block");
                                        searchParams.delete("page");
                                        handleLoadContent(1, true);
                                    } else {
                                        searchParams.set("block", id);
                                        searchParams.set("page", String(1));
                                        handleLoadContent(1);
                                        setPage(1);
                                    }

                                    setSearchParams(searchParams);
                                    setExpand((prev: boolean) => !prev);
                                }}
                            >
                                {isExpand ? <BiCollapseAlt /> : <BiExpandAlt />}
                            </button>
                        )}
                    </div>
                    <Spin loading={isLoading}>
                        <div className="flex gap-4 px-4 py-4 overflow-hidden flex-wrap">
                            {data?.map((item: unknown, i: number) => <Component {...item} key={i} />)}
                        </div>
                    </Spin>
                </div>
                {isExpand && (
                    <div className="flex justify-end gap-4 items-center">
                        {pagination && pagination?.map((page: number, i: number) => (
                            <Button
                                disabled={page == current_page}
                                key={i}
                                onClick={() => handleChangePage(page)}
                                type={!i || i == (pagination.length - 1) ? "primary" : "default"}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}
            </>
        )
    );
}

export default Block;