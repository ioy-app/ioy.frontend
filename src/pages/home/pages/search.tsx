import { search } from "@/api/routes/search";
import { Button, Game, Pagination, Spin, Table, User } from "@/components";
import { paths } from "@/routes";
import GameProps from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Input } from "@/components";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BiSearch } from "react-icons/bi";
import { Link, useSearchParams } from "react-router";
import imgEmpty from "@/icons/empty.svg";

/**
 * Search page
 * @example
 * return <Search />
*/
export default function Search({}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
	const methods = useForm();
	useEffect(() => {
		methods.setValue("query", null);

		if (searchParams.get("query"))
			methods.setValue(
				"query",
				searchParams.get("query"),
			);
		if (searchParams.get("status"))
			methods.setValue(
				"status",
				searchParams.get("status"),
			);
	}, [searchParams]);

	const isSearch = searchParams.get("query");
	const max = 20;
	const current_page = Number(
		searchParams.get("page") || 1,
	);

	const submit = (data) => {
		const us = new URLSearchParams(data);

		if (!data?.query)
      us.delete("query");

		setSearchParams(us);
	};

	const searchQuery = useQuery({
		queryKey: [ "search", searchParams?.toString() ],
		queryFn: async () => {
			if (!searchParams.get("query"))
				return {
					items: [],
					total: 0,
				};

			const us = new URLSearchParams();

			us.set("offset", String((current_page - 1) * max));
			us.set("limit", String(max));
			us.set("search", searchParams.get("query"));

			const response = await search(us);
			return response;
		},
		initialData: {
			items: [],
			total: 0,
		},
	});

  return (
    <div className="flex flex-col gap-4">
      <FormProvider {...methods}>
        <form
          className="w-full max-w-xl flex gap-4 items-end"
          onSubmit={methods.handleSubmit(submit)}	
        >
          <Input
            placeholder={t("home.search.placeholders.search")}
            type="search"
            {...methods.register("query")}
          />
          <Button
            variant="primary"
            htmlType="submit"
          >
            <BiSearch />
          </Button>
        </form>
      </FormProvider>
      <Spin loading={searchQuery?.status == "pending"}>
        {!searchQuery?.data?.items?.length && (
          <div className="w-full flex justify-center items-center flex-col gap-2">
            <img
              src={imgEmpty}
              className="h-64 pointer-events-none select-none"
            />
            <p className="text-placeholder text-2xl">{t("errors.nodata")}</p>
          </div>
        )}
        <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2">
          {searchQuery?.data?.items?.map((game: GameProps, i: number) => (
            <Game
              dataSource={game}
              key={i}
              size="full"
            />
          ))}
        </div>
        <Pagination
          total={searchQuery?.data?.total || 1}
          current={current_page}
          per_page={max}
          onChange={(offset, page) => {
            searchParams.set("page", String(page));
            setSearchParams(searchParams);
          }}
        />
      </Spin>
      </div>
    );
}