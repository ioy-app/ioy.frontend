import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import Picture from "../content/picture";

const useMasonryColumns = ({
  items,
  minWidth=280,
  gap=16
}) => {
  const refElem = useRef(null);
  const [ cols, setColumns ] = useState(1);

  useEffect(() => {
    const obj = refElem?.current;
    if (!obj)
      return;

    const calculate = () => {
      const width = obj?.clientWidth;
      const maxCols = Math.max(1, ~~((width + gap) / (minWidth + gap)));

      setColumns(maxCols);
    }

    calculate();
    const observer = new ResizeObserver(calculate);
    observer.observe(obj);

    return () => observer.disconnect();
  }, [ minWidth, gap ]);

  const columns = useMemo(() => {
    if (cols <= 1)
      return [ items ];

    const res = Array.from({ length: cols }, () => []);
    items.forEach((item, i) => {
      res[i % cols].push(item);
    });

    return res;
  }, [ items, cols ]);

   return {
      refElem,
      columns,
      cols
    };
}

/**
 * Table like masonry
 * @example
 * return <MasonryTable />
*/
const MasonryTable: React.FC<{
  pictures: any[];
  nolink?: boolean;
  onClick?: (id: number) => void;
}> = ({
  pictures,
  nolink,
  onClick
}) => {
  const { refElem, columns } = useMasonryColumns({ items: pictures });

  return (
    <div
      ref={refElem}
      className="w-full"
    >
      <div className="flex gap-4">
        {columns?.map?.((col, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col gap-4"
          >
            {col?.map?.((item) => (
              <Picture
                key={item?.id}
                dataSource={item}
                size="full"
                className="break-inside-avoid"
                nolink={nolink}
                onClick={() => onClick && onClick(item?.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MasonryTable;