import { games_details, games_list } from "@/api/games";
import Button from "@/components/base/button";
import Input from "@/components/base/input";
import Spin from "@/components/base/spin";
import Game from "@/components/content/game";
import { useNotify } from "@/hooks";
import GameProps from "@/types/game";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiBox, BiSearchAlt2, BiXCircle } from "react-icons/bi";

/**
 * Game selector
 * @example
 * return <SelectGame />
*/
const SelectGame: React.FC<{
  value?: number;
  disabled?: boolean;
  onChange?: (id: number) => void;
}> = ({
  value,
  disabled,
  onChange
}) => {
  const { t } = useTranslation();
  const { notify } = useNotify();
  const [ isFocus, setFocus ] = useState<boolean>(false);
  const [ search, setSearch ] = useState<string>("");
  const [ select, setSelect ] = useState<GameProps>(null);

  const query = useQuery({
    queryKey: [ "selector", "games", search ],
    enabled: !!search,
    queryFn: () => games_list({
      search,
      count: 5
    })
  });

  const update = useMutation({
    mutationKey: [ "selector", "game", "update" ],
    mutationFn: (id: number) => games_details(id),
    onSuccess: (data: GameProps) => setSelect(data),
    onError: () => notify(t("select.errors.data"), "error")
  });

  useEffect(() => {
    if (!value && !select)
      return;
    update.mutate(value);
  }, [ value ]);

  useEffect(() => {
    if (select?.id == value)
      return;

    onChange && onChange?.(select?.id);
  }, [ select ]);

  const dataSource = useMemo(() => {
    if (!select)
      return null;
    const { title, ...dataSource } = select;
    return dataSource;
  }, [ select ]);

  if (dataSource)
    return (
      <div className="flex gap-4 items-center">
        <Game
          dataSource={dataSource}
          size={12}
          nolink
        />
        <p className="text-placeholder">{select?.title}</p>
        <Button
          variant="text"
          onClick={() => setSelect(null)}
          disabled={disabled}
        >
          <BiXCircle />
        </Button>
      </div>
    );

  return (
    <div className="group relative w-fit">
      <label className="relative border focus-within:border-primary text-br focus-within:text-primary border-br px-4 rounded-2xl w-fit flex gap-1 items-center text-2xl has-disabled:border-disabled has-disabled:text-disabled-content transition-colors z-5 bg-back">
        <BiSearchAlt2 className="transition-colors z-5" />
        <Input
          type="text"
          className="border-0 p-0 text-text z-5 transition-colors"
          placeholder={t("select.search")}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={search}
          onChange={(e) => {
            const value = e?.target?.value;
            setSearch(value);
          }}
        />
        {search && (
          <Button
            className="z-5 absolute right-2 bg-transparent"
            variant="text"
            onClick={() => setSearch("")}
            disabled={disabled}
          >
            <BiXCircle />
          </Button>
        )}
      </label>
      <AnimatePresence mode="wait">
        {(isFocus && search) && (
          <motion.div
            key="selector-game"
            initial={{
              height: 0
            }}
            animate={{
              height: "fit-content"
            }}
            exit={{
              height: 0,
              opacity: 0
            }}
            className="absolute left-0 top-[50%] w-full max-h-40 px-2 py-2 pt-6 rounded-b-2xl z-3 bg-back border border-br border-t-0 group-focus-within:border-primary transition-colors overflow-y-auto"
          >
            <Spin loading={query?.isLoading && query?.isEnabled}>
              <div className="flex flex-col gap-4 pt-2">
                {query?.data?.items?.map?.(({ title, ...dataSource }, i) => (
                  <div
                    className="w-full flex gap-4 items-center py-1 px-1 hover:bg-primary/20 rounded-2xl cursor-pointer"
                    onClick={() => {
                      setSearch("");
                      setSelect({
                        title,
                        ...dataSource
                      } as GameProps);
                    }}
                  >
                    <Game
                      dataSource={dataSource}
                      size={12}
                      nolink
                      className="appearance-none"
                    />
                    <p className="text-placeholder appearance-none">{title}</p>
                  </div>
                ))}
                {!query?.data?.items?.length && (
                  <div className="flex flex-col gap-2 justify-center items-center text-text/40">
                    <BiBox className="text-2xl"/>
                    <p className="text-placeholder text-xl">{t("select.nodata")}</p>
                  </div>
                )}
              </div>
            </Spin>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SelectGame;