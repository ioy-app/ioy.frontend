import { useEffect, useMemo, useState } from "react";
import Button from "./button";

/**
 * Pagination component
 * @example
 * return <Pagination current={1} total={50} per_page={10} />
*/
const Pagination: React.FC<{
    /** Total rows */
    total: number;
    /** Rows per page */
    per_page?: number;
    /** Current page */
    current: number;
    /** Change page event */
    onChange: (offset: number, page: number) => void;
    /** Disabled navigation */
    disabled?: boolean;
}> = ({
    total,
    per_page,
    current,
    onChange,
    disabled
}) => {
    const pages = useMemo<number[]>(() => {
        const max = Math.ceil(total / per_page);
        const setter = new Set<number>();
        
        setter.add(1);
        if (current < 4)
            for (let i = 1; i <= Math.min(6, max); i++)
                setter.add(i);
        if (current > max - 3)
            for (let i = Math.max(max - 5, 1); i <= max; i++)
                setter.add(i);

        for (let i = Math.max(current - 2, 1); i <= Math.min(current + 2, max); i++)
            setter.add(i);
        setter.add(max);

        return Array.from(setter).sort((a, b) => a - b);
    }, [ current, per_page, total ]);

    if (pages?.length <= 1)
        return <></>

    return (
        <div className="flex gap-4 items-center justify-end flex-wrap">
            {pages && pages?.map((page: number, i: number) => {
                const offset = Math.max(page - 1, 0) * per_page;
                return (
                    <Button
                        key={i}
                        disabled={Boolean(current == page) || disabled}
                        variant={(!i || (i == (pages?.length - 1))) && "primary" || "text"}
                        onClick={(e) => {
                            e.preventDefault();
                            onChange && onChange(offset, page);
                        }}
                    >
                        {page}
                    </Button>
                );
            })}
        </div>
    );
}

export default Pagination;