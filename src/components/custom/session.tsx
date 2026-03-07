import { Session as SessionProps } from "@/types";
import dayjs from "dayjs";
import { UAParser } from "ua-parser-js";
import Button from "@/components/base/button";
import { useTranslation } from "react-i18next";

interface SessionLocalProps extends SessionProps {
	/** Событие нажатия на кнопку "Удалить" */
	onDelete?: (id: SessionProps["id"]) => void;
	/** Отключение активных кнопок */
	disabled?: boolean;
}

const Session: React.FC<SessionLocalProps> = ({
	id,
	ip,
	user_agent,
	date_created,
	date_expires,
	onDelete,
	disabled,
}) => {
	const { t } = useTranslation();
	const parse = new UAParser(user_agent);
	const os = parse.getOS();
	const browser = parse.getBrowser();

	const date_created_text = date_created
		? dayjs(date_created).locale("ru").format("HH:mm DD.MM.YYYY")
		: t("undefined");
	const date_range_text = date_expires
		? t("sessions.days", {
				count: dayjs(date_expires).diff(Date.now(), "days"),
			})
		: t("undefined");

	return (
		<div className="flex gap-4 text-default items-start justify-between">
			<div className="flex flex-col gap-1">
				<p>
					{browser.name} ({browser.version})
				</p>
				<p className="text-placeholder">
					{os.name} ({os.version})
				</p>
			</div>
			<div className="flex gap-4 items-start">
				<div>
					<p>{ip}</p>
					<p className="text-placeholder">{date_created_text}</p>
				</div>
				<p>{date_range_text}</p>
				<Button
					variant="danger"
					onClick={() => onDelete(id)}
					disabled={disabled}
				>
					{t("buttons.delete")}
				</Button>
			</div>
		</div>
	);
};

export default Session;
