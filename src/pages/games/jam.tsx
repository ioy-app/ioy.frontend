import { games_votes_list, games_votes_put } from "@/api/games";
import { Jam, Spin, Vote } from "@/components";
import { useNotify } from "@/hooks";
import { VotingOne, VotingThird, VotingTwo } from "@/icons";
import JamProps from "@/types/jam";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

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
  const params = useParams();
  const game_id = Number(params.id);
  const { notify } = useNotify();

  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [ "votes", game_id ],
    queryFn: async () => {
      const response = await games_votes_list(game_id);
      return response;
    }
  });

  const vote = useMutation({
		mutationFn: async ({
      nomination,
      score
    }: {
      nomination: string,
      score: number
    }) => {
			const response = await games_votes_put(game_id, nomination, score);
			return response;
		},
		onError: (err) => notify(t(err?.message?.toString()), "error"),
		onSuccess: (data) => {
			if (!data) return;
			queryClient.setQueryData(
        [ "votes", game_id ],
        (current: Record<string, any>[]) => {
          const vote = current?.items?.find(item => item.id == data?.id);
          if (vote)
            return ({
              ...current,
              items: current?.items?.map((item, i) => {
                if (item?.id == data?.id)
                  return data;
                return item;
              })
            })
          
          return {
            ...current,
            items: [ ...current?.items || [], data ]
          }
        }
      );
		},
	});

  return (
    <Spin loading={query?.status == "pending"}>
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
        {(data?.is_vote) && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-placeholder">{t("jams.labels.voting")}</p>
            <div className="grid grid-cols-3 max-md:grid-cols-2 place-content-stretch gap-4 h-fit w-full">
              {data?.nominations?.map((nomination: string, i: number) => {
                const voteinfo = query?.data?.items?.find(item => item.nomination == nomination);
                return (
                  <Vote
                    jam_id={data?.id}
                    game_id={game_id}
                    nomination={nomination}
                    key={i}
                    score={voteinfo?.score}
                    disabled={vote.isPending || data?.status != "voting"}
                    onChange={(score: number) => {
                      vote.mutate({
                        nomination,
                        score
                      });
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
}

export default JamBlock;