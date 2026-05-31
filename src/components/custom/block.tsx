import Button from "@/components/base/button";
import Popup from "@/components/base/popup";
import Spin from "@/components/base/spin";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BiExpandAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Block: React.FC<{
	/** Title */
	title: string;
	/** ID */
	id?: string;
	/** Request function */
	request: (
		page: number,
		count: number,
	) => Promise<{
		items: unknown[];
		total: number;
	}>;
	/** Render component */
	Component: React.ElementType;
	/** Open event */
	onOpen: () => void;
}> = ({ title, id, request, Component, onOpen }) => {
	const { t } = useTranslation();

	const { isFetching, data } = useQuery({
		queryKey: ["profile", id],
		queryFn: async () => {
			const count: number = 10;
			return request(1, count);
		},
	});

	if (!data?.items?.length) return null;

	return (
		<div className="bg-back border border-br rounded-xl overflow-clip py-4 px-4 gap-4 flex flex-col h-fit text-text">
			<div className="bg-back flex flex-row justify-between items-center">
				<div className="flex flex-row gap-2 items-center">
					<p className="text-default">{title}</p>
					<p className="text-default border border-br px-2 py-1 rounded-xl text-text">
						{data?.total || 0}
					</p>
				</div>
				{data?.total > 10 && (
					<Popup label={t("helps.expand")} align="l">
						<Button
							variant="text"
							onClick={() => onOpen && onOpen()}
						>
							<BiExpandAlt className="text-2xl" />
						</Button>
					</Popup>
				)}
			</div>
			<div>
				<Spin loading={isFetching}>
					<div className="grid grid-cols-5 max-md:grid-cols-3 gap-4">
						{Component &&
							data?.items?.map((item, i: number) => (
								<Component
									size="full"
									{...(item as any)}
									key={i}
								/>
							))}
					</div>
				</Spin>
			</div>
		</div>
	);
};

export default Block;
