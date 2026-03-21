import { paths } from "@/routes";
import { BiHash } from "react-icons/bi";
import { NavLink } from "react-router";

function hashString(str: string): number {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 33) ^ str.charCodeAt(i);
	}
	return hash >>> 0;
}

function stringToHSLColor(
	str: string,
	saturation = 70,
	lightness = 65,
): string {
	const hash = hashString(str);
	const hue = hash % 360;
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getContrastTextColor(hslColor: string): string {
	const match = hslColor.match(
		/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/,
	);
	if (!match) return "#000";
	const lightness = parseInt(match[1], 10);
	return lightness > 60 ? "#000" : "#fff";
}

const Tag: React.FC<{
	title: string;
	nolink?: boolean;
}> = ({
	title,
	nolink
}) => {
	const bg = stringToHSLColor(title);

	const root = (
		<div
			className="px-2 py-1 rounded-xl text-default flex gap-2 items-center select-none"
			style={{
				background: bg,
				color: getContrastTextColor(bg),
			}}
		>
			<BiHash />
			<p>{title}</p>
		</div>
	)

	if (nolink)
		return root;

	return (
		<NavLink to={`${paths.search}?search=${title}`}>
			{root}
		</NavLink>
	);
};

export default Tag;
