import { useEffect, useMemo, useState } from "react";
import Spin from "./spin";
import Button from "./button";
import { BiError, BiPlay } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { Routes } from "@/api";
import Picture from "../content/picture";

const Player: React.FC<{
	/** Game id */
	gameId?: number;
	/** Link ref */
	ref?: React.Ref<HTMLDivElement>;
	picture?: Record<string, any>;
}> = ({
	gameId,
	picture,
	ref
}) => {
	const [ isLoading, setLoading ] = useState<boolean>(true);
	const [ isPlay, setPlay ] = useState<boolean>(false);
	const [ isError, setError ] = useState<boolean>(false);

	const { t } = useTranslation();

	const pictureurl = useMemo(() => {
		if (!picture)
			return null;

		return `/api/v1${Routes.pictures.image(picture?.id)}`;
	}, [ picture ]);

	const handleLoad = async () => {
		try {
			setLoading(true);
			setPlay(true);
			setError(false);
		}
		catch (err) { setError(true); }
		finally { setLoading(false); }
	};

	useEffect(() => {
		setPlay(false);
		setError(false);
	}, [ gameId ]);

	return (
		<div
			className="flex justify-center items-center w-full aspect-video border border-br rounded-xl box-border bg-br/15 overflow-hidden"
			ref={ref}
		>
			{!isPlay ? (
				<div className="relative flex w-full h-full items-center justify-center bg-br/15">
					{picture && pictureurl && (
						<>
							<img
								src={pictureurl}
								className="absolute z-0 w-full opacity-50 scale-125"
							/>
							<div
								className="absolute right-4 bottom-4"
							>
								<Picture
									dataSource={picture}
								/>
							</div>
						</>
					)}
					<Button
						variant="primary"
						onClick={handleLoad}
						className="z-1"
					>
						<BiPlay size="2em" />
					</Button>
				</div>
			) : (
				<Spin loading={isLoading}>
					{isError ? (
						<div className="flex w-full h-full items-center justify-center flex-col gap-2 text-danger">
							<BiError size="2em" />
							<p className="text-placeholder">
								{t("games.errors.exists")}
							</p>
						</div>
					) : (
						<iframe
							src={`/api/v1/games/${gameId}/game`}
							className="w-full h-full"
						/>
					)}
				</Spin>
			)}
		</div>
	);
};

export default Player;