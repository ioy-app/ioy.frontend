import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { paths } from "@/routes";

const Footer: React.FC = () => {
    const { i18n, t } = useTranslation();
    
    const handleChangeLanguage = ({ target: { value } }) => {
        i18n.changeLanguage(value);
        localStorage.setItem("lang", value);
    }

    return (
        <footer className="flex flex-row gap-4 justify-between items-center w-full p-4 bg-br">
            <div className="flex flex-row items-center gap-4 text-placeholder flex-wrap">
                <abbr>© Copyright 2026</abbr>
                <NavLink to={paths.terms} target="_blank">
                    {t("footer.terms")}
                </NavLink>
                <NavLink to={paths.privacy} target="_blank">
                    {t("footer.privacy")}
                </NavLink>
                <NavLink to={paths.cookie} target="_blank">
                    {t("footer.cookie")}
                </NavLink>
            </div>
            <nav className="flex flex-row items-center gap-4 text-placeholder flex-wrap justify-end">
                <NavLink to={paths.cookie}>
                    {t("footer.about")}
                </NavLink>
                <label className="flex items-center gap-2">
                    <select
                        onChange={e => handleChangeLanguage(e)}
                        value={i18n.language}
                        className="outline-0"
                    >
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                    </select>
                </label>
            </nav>
        </footer>
    );
}

export default Footer;