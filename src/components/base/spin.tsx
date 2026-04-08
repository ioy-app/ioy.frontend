import { Logo } from "@/icons";

const Spin: React.FC<{
	/** Content */
	children: React.ReactNode;
	/** Loading state */
	loading?: boolean;
}> = ({
	children,
	loading,
}) => {
	if (loading)
		return (
			<div className="flex-1 w-full h-full flex justify-center items-center">
				<img
					src={Logo}
					className="h-full aspect-square max-w-24 max-h-24 animate-spin"
				/>
			</div>
		);

	return children;
};

export default Spin;
