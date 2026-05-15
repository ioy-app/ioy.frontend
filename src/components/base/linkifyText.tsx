import Tag from "@/components/custom/tag";
import Linkify from "linkify-react";
import { Opts } from "linkifyjs";
import { Link, useNavigate } from "react-router-dom";
import "linkify-plugin-hashtag";
import { useModal } from "@/hooks";
import Button from "./button";
import { useTranslation } from "react-i18next";

const LinkifyText: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({
	children,
	className
}) => {
	const { modal } = useModal();
	const { t } = useTranslation();

	const renderLink = ({ attributes, content }) => (
		<Link
			to={attributes.href}
			className={`text-second text-nowrap ${className && className || ""}`}
			onClick={(e) => {
				e.preventDefault();
				modal(() => (
					<p className="text-default">
						{t("modals.redirect", { url: attributes?.href })}
					</p>
				), (onClose) => (
					<>
						<Button
							variant="danger"
							onClick={() => onClose && onClose()}
						>
							{t("buttons.cancel")}
						</Button>
						<Button
							variant="primary"
							onClick={() => {
								window?.open?.(attributes?.href, "_blank", "noopener,noreferrer");
								onClose && onClose();
							}}
						>
							{t("buttons.ok")}
						</Button>
					</>
				));

			}}
		>
			{content}
		</Link>
	);
	const renderHashtag = ({ content }) => (<Tag title={content} />);

	const options: Opts = {
		render: {
			url: renderLink,
			hashtag: renderHashtag,
		},
		format: {
			hashtag: (value: string) => value.substring(1),
		}
	};

	return (
		<Linkify options={options}>
			<p className={`flex text-default flex-row flex-wrap gap-2 ${(className && className) || ""}`}>
				{children}
			</p>
		</Linkify>
	);
};

export default LinkifyText;
