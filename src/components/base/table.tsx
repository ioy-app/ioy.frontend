import Spin from "./spin";

const Table: React.FC<{
    /** Columns data */
    columns: {
        /** Column's title */
        title: React.ReactNode;
        /** Column's id */
        dataIndex: string;
        /** Column's custom render function */
        render?: (data: any, row: any, i: number) => React.ReactNode;
    }[];
    /** Content */
    data?: any[];
    /** Header */
    header?: React.ReactNode;
    /** Footer */
    footer?: React.ReactNode;
    /** Control render */
    control: (row: any, i: number) => React.ReactNode;
    /** Loading table */
    loading?: boolean;
    /** Nodata placeholder */
    nodata?: React.ReactNode;
}> = ({
    columns,
    data,
    header,
    footer,
    control,
    loading,
    nodata
}) => (
    <div className="w-full border border-br rounded-xl text-default">
        {header && (
            <div className="p-4">
                {header}
            </div>
        )}
        <div className="w-full overflow-hidden overflow-x-auto">
            {!data?.length ? (
                <div className="w-full flex justify-center items-center flex-col gap-2">
                    {nodata || "–"}
                </div>
            ) : (
                <Spin loading={loading}>
                    <table className="w-full table-auto border-separate border-spacing-4 text-nowrap">
                        <thead className="text-placeholder">
                            <tr>
                                {columns?.map((col, i) => (
                                    <td key={`${col.dataIndex}-${i}`}>
                                        <div>
                                            {col?.title}
                                        </div>
                                    </td>
                                ))}
                                {control && (<td key="control" />)}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, i) => {
                                const keys = Object.keys(row)
                                    ?.filter(key => columns.find(col => col.dataIndex == key));

                                return (
                                    <tr key={i}>
                                        {keys?.map((col, j) => {
                                            const column = columns?.find(column => column.dataIndex == col);
                                            if (column && column?.render)
                                                return (
                                                    <td key={j}>
                                                        {column.render(row[col], row, i) || "–"}
                                                    </td>
                                                )

                                            return (
                                                <td key={j}>
                                                    <div>
                                                        {row[col] || "–"}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        {control && (
                                            <td>
                                                <div className="flex justify-end items-center gap-4">
                                                    {control(row, i)}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                </Spin>
            )}
        </div>
        {footer && (
            <div className="p-4">
                {footer}
            </div>
        )}
    </div>
);

export default Table;