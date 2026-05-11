import imgEmpty from "@/icons/empty.svg";
import {
	Game,
	MasonryTable,
	Meta,
	Picture,
	Spin,
	Tag,
	ViewModel,
} from "@/components";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { pictures_list } from "@/api/routes/pictures";
import InfiniteScroll from "react-infinite-scroll-component";

/**
 * Pictures pages for home
 * @example
 * return <Pictures />
*/
const Pictures: React.FC<{}> = ({}) => {
	const { t } = useTranslation();

	const query = useInfiniteQuery({
    queryKey: [ "home", "pictures" ],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await pictures_list(pageParam);
      return response;
    },
    getNextPageParam: (lastPage) => {
      const next = lastPage.offset + lastPage.limit;
      if (next >= lastPage?.total)
        return null;
      return next;
    },
    getPreviousPageParam: (firstPage) => firstPage.offset
  });

  const items = [].concat(...(query?.data?.pages?.map(page => page.items) || []));

	return (
		<>
			<Meta
				title="ioy.app"
				description={t("about.description")}
				url=""
			/>
			<Spin loading={query?.isPending}>
        <InfiniteScroll
          className="col-span-4 flex flex-col gap-4 w-full overflow-hidden!"
          dataLength={items?.length}
          next={() => query.fetchNextPage()}
          hasMore={query.hasNextPage}
          loader={(<Spin loading/>)}
          endMessage={(
            <div className="flex flex-col justify-center items-center py-4 gap-2 text-xl text-text/35">
              <ViewModel
                name="rocket-pictures"
                href="/resources/gltf/rocket.gltf"
                spdX={.2}
                spdY={-.5}
              />
              <p>{t("pictures.empty")}</p>
            </div>
          )}
        >
          <MasonryTable pictures={items} />
        </InfiniteScroll>
      </Spin>
		</>
	);
};

export default Pictures;