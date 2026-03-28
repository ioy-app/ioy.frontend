import Tag from "@/components/custom/tag";
import Linkify from "linkify-react";
import { Opts } from "linkifyjs";
import { Link } from "react-router-dom";
import "linkify-plugin-hashtag";

const LinkifyText: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({
	children,
	className
}) => {
	const renderLink = ({ attributes, content }) => (
		<Link
			to={attributes.href}
			className="text-second"
		>
			{content}
		</Link>
	);
	const renderHashtag = ({ content }) => (<Tag title={content} />);

	const options: Opts = {
		render: {
			link: renderLink,
			hashtag: renderHashtag,
		},
		format: {
			hashtag: (value: string) => value.substring(1),
		},
		target: "_blank",
		className: `text-nowrap text-second ${(className && className) || ""}`,
	};

	return (
		<Linkify options={options}>
			<p
				className={`flex text-default flex-row flex-wrap gap-2 ${(className && className) || ""}`}
			>
				{children}
			</p>
		</Linkify>
	);
};

export default LinkifyText;
