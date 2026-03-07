import { useEffect, useRef, useState } from "react";
import Spin from "./spin";
import Button from "./button";
import { BiError, BiPlay } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const Player: React.FC<{
	/** Game id */
	gameId?: number;
	/** Other link for game */
	src?: string;
}> = ({ gameId, src }) => {
	const ref = useRef(null);
	const [isLoading, setLoading] = useState<boolean>(true);
	const [gameFile, setGameFile] = useState<string>(null);
	const [isPlay, setPlay] = useState<boolean>(false);
	const [isError, setError] = useState<boolean>(false);

	const { t } = useTranslation();

	const handleLoad = async () => {
		try {
			setLoading(true);
			setPlay(true);
			setError(false);
			const file: Response = await fetch(src || `/api/v1/games/${gameId}/game`);
			const resource = await file.blob();

			if (!file.ok) throw new Error();

			setGameFile(URL.createObjectURL(resource));
		} catch (err) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setPlay(false);
		setError(false);
	}, [gameId]);

	return (
		<div
			className="flex justify-center items-center w-full aspect-video border border-disabled-content rounded-xl box-border bg-gray-900 overflow-hidden"
			ref={ref}
		>
			{!isPlay ? (
				<div className="flex w-full h-full items-center justify-center bg-disabled">
					<Button variant="primary" onClick={handleLoad}>
						<BiPlay size="2em" />
					</Button>
				</div>
			) : (
				<Spin loading={isLoading}>
					{isError ? (
						<div className="flex w-full h-full items-center justify-center flex-col gap-2 text-danger">
							<BiError size="2em" />
							<p className="text-placeholder">{t("games.errors.exists")}</p>
						</div>
					) : (
						<iframe
							src={gameFile}
							className="w-full h-full"
							onLoad={() => URL.revokeObjectURL(gameFile)}
						/>
					)}
				</Spin>
			)}
		</div>
	);
};

export default Player;
