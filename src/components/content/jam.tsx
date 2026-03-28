import { Link } from "react-router-dom";
import { Routes } from "@/api";
import Spin from "@/components/base/spin";
import { Profile } from "@/icons";
import { useQuery } from "@tanstack/react-query";

const Jam: React.FC<{
	/** Game data */
	dataSource: Record<string, any>;
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
		queryKey: ["game", dataSource, preview],
		queryFn: async () => {
			if (!dataSource?.is_avatar) return null;

			if (preview) {
				const file = await fetch(preview);
				if (!file.ok) throw new Error();

				const resource = await file.blob();
				return URL.createObjectURL(resource);
			}

			return `/api/v1${Routes.jams.icon(dataSource.id)}`;
		},
		retry: false,
	});

	const root = (
		<div
			className={`group flex flex-col items-center gap-1 max-w-${size} overflow-hidden`}
			onClick={() =>
				onClick && nolink && onClick(dataSource?.id)
			}
		>
			<div
				className={`w-full h-${size} rounded-xl overflow-hidden aspect-square border border-br ${(!nolink && "group-hover:border-primary transition-colors") || ""}`}
			>
				<Spin loading={status == "pending"}>
					{isError || !data ? (
						<div className="flex w-full h-full items-center justify-center flex-col gap-2 bg-second">
							<img src={Profile} />
						</div>
					) : (
						<img src={data} className="w-full h-full" />
					)}
				</Spin>
			</div>
			{dataSource?.title && (
				<p
					className={`max-w-${size} overflow-hidden text-placeholder wrap-anywhere line-clamp-2 text-center ... group-hover:text-primary transition-colors`}
				>
					{dataSource.title}
				</p>
			)}
		</div>
	);

	return !nolink ? (
		<Link
			to={`/j/${dataSource?.id}`}
			className={`w-${size}`}
		>
			{root}
		</Link>
	) : (
		root
	);
};

export default Jam;