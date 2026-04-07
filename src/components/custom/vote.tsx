import { VotingOne, VotingThird, VotingTwo } from "@/icons";
import { useState } from "react";
import Tag from "./tag";
import { BiTrophy } from "react-icons/bi";

/**
 * Vote component
 * @example
 * return <Vote />
*/
const Vote: React.FC<{
  nomination: string;
  jam_id: number;
  game_id: number;
}> = ({
  nomination,
  jam_id,
  game_id
}) => {
  const [ select, setSelect ] = useState<number>(null);

  return (
    <div className="flex flex-col items-center gap-4 border border-br rounded-xl p-4 w-full">
      <Tag
        title={nomination}
        nolink
        icon={<BiTrophy />}
      />
      <div className="flex gap-4" key={select}>
        <div
          className={`transition-opacity w-12 ${select != 1 && "opacity-25" || ""} hover:opacity-100 cursor-pointer`}
          onClick={() => setSelect(1)}
        >
          <img
            src={VotingOne}
            className="w-full h-full"
          />
        </div>
        <div
          className={`transition-opacity w-12 ${select != 2 && "opacity-25" || ""} hover:opacity-100 cursor-pointer`}
          onClick={() => setSelect(2)}
        >
          <img
            src={VotingTwo}
            className="w-full h-full"
          />
        </div>
        <div
          className={`transition-opacity w-12 ${select != 3 && "opacity-25" || ""} hover:opacity-100 cursor-pointer`}
          onClick={() => setSelect(3)}
        >
          <img
            src={VotingThird}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Vote;