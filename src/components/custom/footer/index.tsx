import { NavLink } from "react-router-dom";
import "./styles.less";

import confPackage from "@/../package.json";
import { useTranslation } from "react-i18next";
import { Lang } from "@/icons";

const Footer: React.FC = () => {
    const { i18n, t } = useTranslation();
    
    const handleChangeLanguage = ({ target: { value } }) => {
        i18n.changeLanguage(value);
        localStorage.setItem("lang", value);
    }

    return (
        <footer>
            <abbr>
                {confPackage.date}, {confPackage.name}
            </abbr>
            <nav>
                <NavLink to="/developers">
                    {t("footer.developers")}
                </NavLink>
                <NavLink to="/about">
                    {t("footer.about")}
                </NavLink>
                <label className="language">
                    <select
                        onChange={e => handleChangeLanguage(e)}
                        value={i18n.language}
                    >
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                    </select>
                    <img src={Lang} />
                </label>
            </nav>
        </footer>
    );
}

export default Footer;