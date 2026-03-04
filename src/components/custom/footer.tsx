import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { paths } from "@/routes";
import Button from "../base/button";
import { BiMoon, BiSun } from "react-icons/bi";
import { useState } from "react";

const Footer: React.FC = () => {
    const { i18n, t } = useTranslation();
    const [ darkMode, setDarkMode ] = useState<"dark" | "light">(localStorage.getItem("theme") as "dark" | "light");
    
    const handleChangeLanguage = ({ target: { value } }) => {
        i18n.changeLanguage(value);
        localStorage.setItem("lang", value);
    }

    const toggleDarkMode = () => {
        const htmlEl = document.documentElement;
        htmlEl.classList.toggle("dark");
        const value = htmlEl.classList.contains("dark") ? "dark" : "light";
        localStorage.setItem("theme", value);
        setDarkMode(value);
    }

    if (darkMode == "dark")
        document.documentElement.classList.add("dark");

    return (
        <footer className="flex flex-row gap-4 justify-between items-center w-full p-4 bg-back">
            <div className="flex flex-row items-center gap-4 text-placeholder flex-wrap">
                <abbr>© Copyright 2026</abbr>
                <NavLink to={paths.terms} target="_blank">
                    {t("footer.terms")}
                </NavLink>
            </div>
            <nav className="flex flex-row items-center gap-4 text-placeholder flex-wrap justify-end">
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
                <NavLink to={paths.about}>
                    {t("footer.about")}
                </NavLink>
                <Button
                    variant="text"
                    onClick={() => toggleDarkMode()}
                >
                    {darkMode != "dark" ? <BiSun /> : <BiMoon />}
                </Button>
            </nav>
        </footer>
    );
}

export default Footer;