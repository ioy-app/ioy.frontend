import * as Icons from "@/icons";
import { BiCalendarAlt, BiLogIn, BiUser } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    User,
    Spin
} from "@/components";
import { useModal } from "@/hooks";
import { Auth } from "@/pages";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Popup from "../base/popup";
import { useTranslation } from "react-i18next";

/**
 * Header
 * @example
 * return <Header />
*/
const Header: React.FC<{
    ref: React.Ref<HTMLDivElement>;
}> = ({
    ref
}) => {
    const { t } = useTranslation();
    const { token, login, loading } = useSelector((state: any) => state?.login);
    const { modal } = useModal();

    const { scrollY } = useScroll();
    const [ isScrollable, setScrollable ] = useState<boolean>(false);
    useMotionValueEvent(scrollY, "change", (value) => setScrollable(value > 32));

    return (
        <header className={`transition-shadow sticky top-0 flex flex-row gap-4 items-center justify-between box-border w-full h-12 bg-back px-2 py-1 z-10 border-b ${isScrollable && "border-b-br shadow-md shadow-[rgba(0, 0, 0, .05)]" || "border-b-transparent"}`}>
            <div className="h-full">
                <NavLink
                    to="/"
                    className="h-full aspect-square p-0 m-0"
                >
                    <img
                        src={Icons.Logo}
                        className="aspect-square h-full"
                    />
                </NavLink>
            </div>
            <nav className="h-full flex gap-4 items-center justify-end px-2">
                <button
                    className="h-full aspect-square cursor-pointer"
                    onClick={(e) => {
                        if (token || loading)
                            return;

                        e.preventDefault();
                        modal(Auth, () => (<></>));
                    }}
                >
                    <Spin
                        loading={loading}
                        key={login}
                    >
                        {token ? (
                            <Popup
                                align="l"
                                label={t("header.helps.profile")}
                            >
                                <User
                                    login={login}
                                    dataSource={{
                                        is_avatar: true
                                    }}
                                    size={"full"}
                                    ref={ref}
                                />
                            </Popup>
                        ): <BiUser className="w-full h-full p-1" />}
                    </Spin>
                </button>
            </nav>
        </header>
    )
}

export default Header;