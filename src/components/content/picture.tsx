import GameProps from "@/types/game";
import { Link } from "react-router-dom";
import { Routes } from "@/api";
import Spin from "@/components/base/spin";
import { Profile } from "@/icons";
import { useQuery } from "@tanstack/react-query";
import { BiSolidCrown } from "react-icons/bi";
import { FaFireAlt } from "react-icons/fa";

const Picture: React.FC<{
	/** Game data */
	dataSource: GameProps;
	/** Preview game's avatar */
	preview?: string;
	/** Disabled link */
	nolink?: boolean;
	/** Avatar size */
	size?: number | string;
	onClick?: (id: number) => void;
}> = ({
	dataSource,
	preview,
	nolink,
	size = 24,
	onClick,
}) => {
	const { status, data, isError } = useQuery({
		queryKey: ["picture", dataSource, preview],
		queryFn: async () => {
			if (preview) {
				const file = await fetch(preview);
				if (!file.ok) throw new Error();

				const resource = await file.blob();
				return URL.createObjectURL(resource);
			}

			return `/api/v1${Routes.pictures.image(dataSource.id)}`;
		},
		retry: false,
	});

	const root = (
		<div
			className={`group flex flex-col items-center gap-1 max-w-${size}`}
			onClick={() => onClick && onClick(dataSource?.id)}
		>
			<div
				className={`relative w-full h-fit ${(!nolink && "transition-colors") || ""} ${dataSource?.hype && "border-4 border-amber-400 group-hover:border-amber-500 rounded-2xl" || ""}`}
			>
				<Spin loading={status == "pending"}>
					{isError || !data ? (
						<div className="flex w-full items-center justify-center flex-col gap-2 bg-primary rounded-xl overflow-hidden">
							<img src={Profile} />
						</div>
					) : (
						<img src={data} className="w-full rounded-xl overflow-hidden" />
					)}
				</Spin>
				{(dataSource?.jam_result || dataSource?.hype) && (
					<div className="absolute -top-2 -right-2">
						{dataSource?.jam_result?.place == 1 && <BiSolidCrown className="text-amber-300 text-xl bg-back rounded-full p-0.5" />}
						{dataSource?.jam_result?.place == 2 && <BiSolidCrown className="text-blue-100 text-xl bg-back rounded-full p-0.5" />}
						{dataSource?.jam_result?.place == 3 && <BiSolidCrown className="text-second text-xl bg-back rounded-full p-0.5" />}
						{dataSource?.hype && <FaFireAlt className="text-amber-300 text-xl bg-back rounded-full p-0.5" />}
					</div>
				)}
				
			</div>
			{dataSource?.title && (
				<p
					className={`max-w-${size} overflow-hidden text-placeholder wrap-anywhere line-clamp-2 w-full ... group-hover:text-primary ${dataSource?.hype && "text-amber-300 group-hover:text-amber-500!" || ""} transition-colors`}
				>
					{dataSource.title}
				</p>
			)}
		</div>
	);

	return !nolink ? (
		<Link
			to={`/p/${dataSource?.id}`}
			className={`w-${size}`}
		>
			{root}
		</Link>
	) : (
		root
	);
};

export default Picture;
