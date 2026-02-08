import { useTranslation } from "react-i18next";
import * as Icons from "@/icons";
import { BiLogoTelegram } from "react-icons/bi";
import { SiBluesky } from "react-icons/si";
import { NavLink } from "react-router";

/**
 * About page
 * @example
 * return <About />
*/
export default function About({}) {
    const { t } = useTranslation();
    document.title = t("about.title");
    
    return (
        <div className="flex justify-center items-center w-full">
            <div className="flex flex-col items-center justify-center gap-4 flex-1 max-w-[60%] max-md:max-w-full">
                <img
                    src={Icons.Logo}
                    className="h-42"
                />
                <p className="text-4xl"><span className="text-primary">ioy</span><span className="text-second">.app</span></p>
                <div className="p-4 border border-br rounded-xl w-full text-xl">
                    <p>{t("about.description")}</p>
                </div>
                <div className="flex gap-6 text-2xl w-full justify-end items-center">
                    <NavLink to="mailto:support@wmgcat.net">
                        <address className="text-[14pt] text-second">
                            support@wmgcat.net
                        </address>
                    </NavLink>
                    <NavLink to="/">
                        <BiLogoTelegram />
                    </NavLink>
                    <NavLink to="/">
                        <SiBluesky />
                    </NavLink>
                </div>
            </div>
        </div>
    );
}